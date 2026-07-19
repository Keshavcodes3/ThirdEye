import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import executionController from "./execution.controller.js";

const executionRouter = Router();

/**
 * POST /api/v1/execution/start/:workflowId
 * Start a workflow execution.
 */
executionRouter.post(
    "/start/:workflowId",
    authMiddleware,
    executionController.startExecution
);

/**
 * GET /api/v1/execution/workflow/:workflowId
 * List all executions for a given workflow.
 * NOTE: This route must come BEFORE /:executionId to avoid "workflow" being
 * matched as an executionId param.
 */
executionRouter.get(
    "/workflow/:workflowId",
    authMiddleware,
    executionController.getWorkflowExecutions
);

/**
 * GET /api/v1/execution/:executionId
 * Fetch a single execution by ID.
 */
executionRouter.get(
    "/:executionId",
    authMiddleware,
    executionController.getExecution
);

/**
 * POST /api/v1/execution/:executionId/cancel
 * Cancel a running execution.
 */
executionRouter.post(
    "/:executionId/cancel",
    authMiddleware,
    executionController.cancelExecution
);

export default executionRouter;