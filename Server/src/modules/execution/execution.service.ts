import { ApiError } from "../../utils/ApiError.js";
import workflowRepository from "../workflow/workflow.repository.js";
import executionRepository from "./execution.repository.js";
import WorkflowRunner from "./workflow-runner.js";
import { Types } from "mongoose";

class ExecutionService {
    async startExecution(workflowId: string) {
        if (!workflowId) {
            throw new ApiError(400, "Workflow ID not provided");
        }

        const workflow = await workflowRepository.findWorkflowById(workflowId);
        if (!workflow) {
            throw new ApiError(404, "Workflow not found");
        }

        const startNode = workflow.nodes.find((node: any) => node.type === "start");
        if (!startNode) {
            throw new ApiError(400, "Start node not found in workflow");
        }

        const execution = await executionRepository.createExecution({
            workflow: workflow._id as unknown as string,
            status: "running",
            currentNode: startNode.id,
            context: {},
        });

        // Await the full workflow run so the API responds with the final result.
        const runner = new WorkflowRunner(workflow, execution);

        try {
            await runner.run();
        } catch (err) {
            console.error(`Workflow execution ${execution._id} failed:`, err);
        }

        const updatedExecution = await executionRepository.findExecutionById(execution._id);
        return updatedExecution || execution;
    }

    async getExecutionById(executionId: string) {
        if (!executionId) {
            throw new ApiError(400, "Execution ID not provided");
        }

        const execution = await executionRepository.findExecutionById(executionId);
        if (!execution) {
            throw new ApiError(404, "Execution not found");
        }

        return execution;
    }

    async getWorkflowExecutions(workflowId: string) {
        if (!workflowId) {
            throw new ApiError(400, "Workflow ID not provided");
        }

        const executions = await executionRepository.getExecutionsByWorkflow(workflowId);
        return executions;
    }

    async cancelExecution(executionId: string) {
        if (!executionId) {
            throw new ApiError(400, "Execution ID not provided");
        }

        const execution = await executionRepository.findExecutionById(executionId);
        if (!execution) {
            throw new ApiError(404, "Execution not found");
        }

        if (execution.status !== "running") {
            throw new ApiError(400, `Cannot cancel execution with status: ${execution.status}`);
        }

        const updatedExecution = await executionRepository.updateExecution(executionId, {
            status: "cancelled",
            finishedAt: new Date()
        });

        return updatedExecution;
    }
}

export default new ExecutionService();
