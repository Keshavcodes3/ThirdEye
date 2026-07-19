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

        // Run in background / parallel to response
        // Note: in a production distributed environment this would go to a message queue like RabbitMQ or Redis BullMQ.
        // For now, we execute in memory but we do not await it here so the API responds quickly.
        const runner = new WorkflowRunner(workflow, execution);
        
        // We catch errors from the runner here so they don't crash the Node.js process as unhandled rejections
        runner.run().catch(err => {
            console.error(`Workflow execution ${execution._id} failed:`, err);
        });

        return execution;
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
