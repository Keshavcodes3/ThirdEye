import type {
    IEngine,
    ExecutionContext,
    RuntimeContext,
    WorkflowNode,
} from "./engine.interface.js";

class CronEngine implements IEngine {
    async execute(
        node: WorkflowNode,
        context: ExecutionContext,
        runtimeContext: RuntimeContext
    ): Promise<{ cron: boolean; schedule: unknown; triggeredAt: string }> {
        return {
            cron: true,
            schedule: node.data.schedule,
            triggeredAt: new Date().toISOString(),
        };
    }
}

const cronEngine = new CronEngine();

export default cronEngine;