import engineFactory from "./engine.factory.js";
import type {
    ExecutionContext,
    ExecutionDocument,
    NodeLog,
    RuntimeContext,
    Workflow,
    WorkflowNode,
} from "./engines/engine.interface.js";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_RETRY_COUNT = 0;
const DEFAULT_TIMEOUT_MS = 30_000;
const RETRY_BASE_DELAY_MS = 1_000; // wait = attempt × 1000 ms

// ─── WorkflowRunner ──────────────────────────────────────────────────────────

class WorkflowRunner {
    private workflow: Workflow;
    private execution: ExecutionDocument;

    constructor(workflow: Workflow, execution: ExecutionDocument) {
        this.workflow = workflow;
        this.execution = execution;
    }

    // ─── Public entry point ──────────────────────────────────────────────────

    async run(): Promise<ExecutionDocument> {
        let currentNodeId: string | null = this.execution.currentNode;

        // ExecutionContext — serializable, persisted to MongoDB
        const context: ExecutionContext = { ...this.execution.context };

        // RuntimeContext — in-memory only (browser, page, etc.), never saved to MongoDB
        const runtimeContext: RuntimeContext = {
            variables: {},
            outputs: {},
            metadata: {
                startedAt: this.execution.startedAt,
                executionId: String(this.execution._id),
            },
        };

        const continueOnFailure =
            this.workflow.settings?.continueOnFailure ?? false;

        while (currentNodeId) {
            const node = this.findNode(currentNodeId);

            let output: unknown;
            let nodeFailed = false;

            try {
                output = await this.executeNodeWithRetryAndTimeout(
                    node,
                    context,
                    runtimeContext
                );

                // Persist output into serializable context so downstream nodes can read it
                context[node.id] = output;
                context.previous = output;
                this.execution.context = { ...context };

            } catch (err: unknown) {
                nodeFailed = true;
                const message = err instanceof Error ? err.message : String(err);

                console.error(
                    `[Runner] Node "${node.id}" (${node.type}) permanently failed: ${message}`
                );

                this.execution.status = "failed";
                this.execution.finishedAt = new Date();

                if (!continueOnFailure) {
                    await this.saveExecution();
                    // Clean up browser if one is open
                    await this.cleanupRuntime(runtimeContext);
                    return this.execution;
                }

                // continueOnFailure=true: log the error but keep going
                context[node.id] = null;
                context.previous = null;
                this.execution.context = { ...context };
            }

            // Determine next node
            let nextNodeId: string | null;

            if (node.type === "condition") {
                nextNodeId = this.findConditionNextNode(node.id, output as boolean);
            } else {
                nextNodeId = this.findNextNode(node.id);
            }

            // End node or no outgoing edge — execution complete
            if (node.type === "end" || nextNodeId === null) {
                if (!nodeFailed) {
                    this.execution.status = "success";
                }
                this.execution.finishedAt = new Date();
                this.execution.currentNode = node.id;
                await this.saveExecution();
                await this.cleanupRuntime(runtimeContext);
                break;
            }

            this.execution.currentNode = nextNodeId;
            await this.saveExecution();

            currentNodeId = nextNodeId;
        }

        return this.execution;
    }

    // ─── Retry + Timeout wrapper ─────────────────────────────────────────────

    /**
     * Executes a node engine with:
     * - Timeout: every node has a max execution time (Promise.race)
     * - Retry:   on failure, retry up to retryCount times with linear backoff
     */
    private async executeNodeWithRetryAndTimeout(
        node: WorkflowNode,
        context: ExecutionContext,
        runtimeContext: RuntimeContext
    ): Promise<unknown> {
        // Resolution order: node-level > workflow-level > defaults
        const retryCount =
            node.data.retryCount ??
            this.workflow.settings?.retryCount ??
            DEFAULT_RETRY_COUNT;

        const timeoutMs =
            node.data.timeout ??
            this.workflow.settings?.timeout ??
            DEFAULT_TIMEOUT_MS;

        const maxAttempts = (retryCount as number) + 1;
        let lastError: unknown;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const startedAt = new Date();

            try {
                const engine = engineFactory.get(node.type);

                // Race engine execution against a timeout promise
                const output = await Promise.race([
                    engine.execute(node, context, runtimeContext),
                    this.createTimeoutPromise(timeoutMs as number, node.id),
                ]);

                const finishedAt = new Date();

                this.logNode({
                    nodeId: node.id,
                    nodeType: node.type,
                    status: "success",
                    startedAt,
                    finishedAt,
                    duration: finishedAt.getTime() - startedAt.getTime(),
                    input: context.previous,
                    output,
                });

                console.log(
                    `[Runner] ✅ ${node.type} (${node.id}) succeeded in ${finishedAt.getTime() - startedAt.getTime()}ms`
                );

                return output;

            } catch (err: unknown) {
                lastError = err;
                const finishedAt = new Date();
                const message = err instanceof Error ? err.message : String(err);
                const isLastAttempt = attempt === maxAttempts;

                this.logNode({
                    nodeId: node.id,
                    nodeType: node.type,
                    status: isLastAttempt ? "failed" : "failed",
                    startedAt,
                    finishedAt,
                    duration: finishedAt.getTime() - startedAt.getTime(),
                    input: context.previous,
                    error: isLastAttempt
                        ? message
                        : `Attempt ${attempt} failed: ${message}`,
                });

                if (isLastAttempt) {
                    console.error(
                        `[Runner] ❌ ${node.type} (${node.id}) failed after ${attempt} attempt(s): ${message}`
                    );
                    await this.saveExecution();
                    break;
                }

                // Wait before retry: attempt * RETRY_BASE_DELAY_MS
                const delay = attempt * RETRY_BASE_DELAY_MS;
                console.warn(
                    `[Runner] ⚠️  ${node.type} (${node.id}) attempt ${attempt} failed, retrying in ${delay}ms...`
                );
                await this.sleep(delay);
            }
        }

        throw lastError;
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    /** Rejects after `ms` milliseconds with a descriptive error */
    private createTimeoutPromise(ms: number, nodeId: string): Promise<never> {
        return new Promise((_, reject) =>
            setTimeout(
                () => reject(new Error(`Node "${nodeId}" timed out after ${ms}ms`)),
                ms
            )
        );
    }

    /** Simple sleep utility */
    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /** Close browser and clean up in-memory resources */
    private async cleanupRuntime(runtimeContext: RuntimeContext): Promise<void> {
        if (runtimeContext.browser) {
            try {
                await runtimeContext.browser.close();
            } catch {
                // Ignore cleanup errors — browser may already be closed
            }
            delete runtimeContext.browser;
            delete runtimeContext.page;
        }
    }

    // ─── Graph traversal helpers ─────────────────────────────────────────────

    /** Find a node by id. Throws if missing — indicates a corrupt workflow graph. */
    private findNode(id: string): WorkflowNode {
        const node = this.workflow.nodes.find((n) => n.id === id);
        if (!node) {
            throw new Error(`Node not found in workflow graph: "${id}"`);
        }
        return node;
    }

    /**
     * Follow a standard (non-condition) edge from the given source node.
     * Returns null when there is no outgoing edge (terminal node).
     */
    private findNextNode(nodeId: string): string | null {
        const edge = this.workflow.edges.find((e) => e.source === nodeId);
        return edge?.target ?? null;
    }

    /**
     * Follow a condition edge whose sourceHandle matches the boolean result.
     * The frontend is expected to set sourceHandle="true" or sourceHandle="false"
     * on each branch edge leaving a condition node.
     */
    private findConditionNextNode(
        nodeId: string,
        result: boolean
    ): string | null {
        const handle = result ? "true" : "false";
        const edge = this.workflow.edges.find(
            (e) => e.source === nodeId && e.sourceHandle === handle
        );
        return edge?.target ?? null;
    }

    // ─── Persistence helpers ─────────────────────────────────────────────────

    /** Push a log entry onto the execution document. */
    private logNode(entry: NodeLog): void {
        this.execution.logs.push(entry);
    }

    /** Persist the current execution state to MongoDB. */
    private async saveExecution(): Promise<void> {
        await this.execution.save();
    }
}

export default WorkflowRunner;