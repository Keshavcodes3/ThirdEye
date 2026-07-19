import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { apiSuccessResponse } from "../../utils/ApiResponse.js";
import executionService from "./execution.service.js";

class ExecutionController {
    /**
     * POST /api/v1/execution/start/:workflowId
     *
     * Validates the workflowId, delegates entirely to ExecutionService.
     * The service creates the execution record and fires the runner.
     */
    startExecution = asyncHandler(async (req: Request, res: Response) => {
        const { workflowId } = req.params;
        if (!workflowId) throw new ApiError(400, "Workflow ID not provided");

        const execution = await executionService.startExecution(workflowId);

        return res.status(200).json(
            apiSuccessResponse(200, "Workflow execution completed", execution)
        );
    });

    /**
     * GET /api/v1/execution/:executionId
     *
     * Fetch a single execution record by its ID.
     */
    getExecution = asyncHandler(async (req: Request, res: Response) => {
        const { executionId } = req.params;
        if (!executionId) throw new ApiError(400, "Execution ID not provided");

        const execution = await executionService.getExecutionById(executionId);

        return res.status(200).json(
            apiSuccessResponse(200, "Execution fetched successfully", execution)
        );
    });

    /**
     * GET /api/v1/execution/workflow/:workflowId
     *
     * List all executions for a given workflow.
     */
    getWorkflowExecutions = asyncHandler(async (req: Request, res: Response) => {
        const { workflowId } = req.params;
        if (!workflowId) throw new ApiError(400, "Workflow ID not provided");

        const executions = await executionService.getWorkflowExecutions(workflowId);

        return res.status(200).json(
            apiSuccessResponse(200, "Executions fetched successfully", executions)
        );
    });

    /**
     * POST /api/v1/execution/:executionId/cancel
     *
     * Marks a running execution as cancelled.
     * Note: Does not interrupt an in-progress runner — for a distributed
     * cancel you would use a message queue / cancellation token in the future.
     */
    cancelExecution = asyncHandler(async (req: Request, res: Response) => {
        const { executionId } = req.params;
        if (!executionId) throw new ApiError(400, "Execution ID not provided");

        const execution = await executionService.cancelExecution(executionId);

        return res.status(200).json(
            apiSuccessResponse(200, "Execution cancelled", execution)
        );
    });
}

const executionController = new ExecutionController();
export default executionController;