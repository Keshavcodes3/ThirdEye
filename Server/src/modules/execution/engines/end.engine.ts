import type {
    IEngine,
    ExecutionContext,
    RuntimeContext,
    WorkflowNode,
} from "./engine.interface.js";

class EndEngine implements IEngine {
    async execute(
        node: WorkflowNode,
        context: ExecutionContext,
        runtimeContext: RuntimeContext
    ): Promise<{ success: boolean; finishedAt: string }> {
        // Close browser if one was opened during this execution
        if (runtimeContext.browser) {
            await runtimeContext.browser.close();
            delete runtimeContext.browser;
            delete runtimeContext.page;
        }
        return {
            success: true,
            finishedAt: new Date().toISOString(),
        };
    }
}

export default new EndEngine();