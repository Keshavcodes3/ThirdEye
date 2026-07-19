import { Browser, Page } from "puppeteer-core";

// ─── Execution context (serializable — stored in MongoDB) ────────────────────

export type ExecutionContext = Record<string, unknown>;

// ─── Runtime context (in-memory only — NEVER stored in MongoDB) ─────────────

export interface RuntimeContext {
    browser?: Browser;
    page?: Page;
    cookies?: unknown[];
    variables?: Record<string, unknown>;
    outputs?: Record<string, unknown>;
    metadata?: {
        startedAt?: Date;
        executionId?: string;
    };
    [key: string]: unknown;
}

// ─── Internal runner state (combines both — used inside WorkflowRunner) ──────

export interface ExecutionState {
    context: ExecutionContext;
    runtime: RuntimeContext;
}

// ─── Workflow graph types ────────────────────────────────────────────────────

export interface WorkflowNode {
    id: string;
    type: string;
    data: {
        retryCount?: number;
        timeout?: number;
        continueOnFailure?: boolean;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

export interface WorkflowEdge {
    id?: string;
    source: string;
    target: string;
    /** Present on condition nodes: "true" | "false" */
    sourceHandle?: string;
    [key: string]: unknown;
}

export interface WorkflowSettings {
    retryCount?: number;
    timeout?: number;
    continueOnFailure?: boolean;
}

export interface Workflow {
    id: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    settings?: WorkflowSettings;
    [key: string]: unknown;
}

// ─── Execution persistence types ─────────────────────────────────────────────

export interface NodeLog {
    nodeId: string;
    nodeType: string;
    status: "success" | "failed" | "skipped";
    startedAt: Date;
    finishedAt: Date;
    duration: number; // milliseconds
    input?: unknown;
    output?: unknown;
    error?: string;
}

export interface NodeOutput {
    nodeId: string;
    output: unknown;
}

export interface ExecutionDocument {
    _id: string;
    workflow: string;
    status: "running" | "success" | "failed" | "cancelled";
    startedAt: Date;
    finishedAt?: Date;
    currentNode: string;
    context: ExecutionContext;
    logs: NodeLog[];
    save: () => Promise<void>;
    [key: string]: unknown;
}

// ─── Engine contract ─────────────────────────────────────────────────────────

/**
 * Every engine must implement this interface.
 *
 * @param node           - The workflow node being executed
 * @param context        - Serializable execution context (MongoDB-safe)
 * @param runtimeContext - In-memory runtime state (browser, page, etc.)
 */
export interface IEngine {
    execute(
        node: WorkflowNode,
        context: ExecutionContext,
        runtimeContext: RuntimeContext
    ): Promise<unknown>;
}
