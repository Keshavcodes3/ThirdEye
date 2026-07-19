import type {
    IEngine,
    ExecutionContext,
    RuntimeContext,
    WorkflowNode,
} from "./engine.interface.js";

class WebhookEngine implements IEngine {
    async execute(
        node: WorkflowNode,
        context: ExecutionContext,
        runtimeContext: RuntimeContext
    ): Promise<{ webhook: boolean; url: unknown; method: string }> {
        return {
            webhook: true,
            url: node.data.url,
            method: (node.data.method as string) || "POST",
        };
    }
}

const webhookEngine = new WebhookEngine();

export default webhookEngine;