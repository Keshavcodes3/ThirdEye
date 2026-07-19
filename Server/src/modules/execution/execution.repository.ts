import { Types } from "mongoose";
import executionModel from "./execution.schema.js";
import type { ExecutionDocument, NodeLog } from "./engines/engine.interface.js";

class ExecutionRepository {
    async createExecution(data: {
        workflow: string | Types.ObjectId;
        status: "running" | "success" | "failed" | "cancelled";
        currentNode: string;
        context: Record<string, unknown>;
    }): Promise<ExecutionDocument> {
        const execution = await executionModel.create(data);
        return execution as unknown as ExecutionDocument;
    }

    async updateExecution(
        id: string | Types.ObjectId,
        updateData: Partial<ExecutionDocument>
    ): Promise<ExecutionDocument | null> {
        const execution = await executionModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        return execution as unknown as ExecutionDocument | null;
    }

    async findExecutionById(id: string | Types.ObjectId): Promise<ExecutionDocument | null> {
        const execution = await executionModel
            .findById(id)
            .populate("workflow", "name nodes edges");
        return execution as unknown as ExecutionDocument | null;
    }

    async getExecutionsByWorkflow(workflowId: string | Types.ObjectId): Promise<ExecutionDocument[]> {
        const executions = await executionModel
            .find({ workflow: workflowId })
            .sort({ startedAt: -1 });
        return executions as unknown as ExecutionDocument[];
    }

    async addLog(executionId: string | Types.ObjectId, log: NodeLog): Promise<ExecutionDocument | null> {
        const execution = await executionModel.findByIdAndUpdate(
            executionId,
            {
                $push: { logs: log }
            },
            { new: true }
        );
        return execution as unknown as ExecutionDocument | null;
    }
}

export default new ExecutionRepository();
