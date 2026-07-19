import type {
    IEngine,
    ExecutionContext,
    RuntimeContext,
    WorkflowNode,
} from "./engine.interface.js";

class StartEngine implements IEngine {
    async execute(
        node: WorkflowNode,
        context: ExecutionContext,
        runtimeContext: RuntimeContext
    ): Promise<{ started: boolean; timestamp: string }> {
        console.log("🚀 Workflow Started");

        return {
            started: true,
            timestamp: new Date().toISOString(),
        };
    }
}

const startEngine = new StartEngine();

export default startEngine;