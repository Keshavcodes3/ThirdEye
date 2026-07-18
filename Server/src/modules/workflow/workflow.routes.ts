
import { Router } from "express";
import workflowcontroller from "./workflow.controller.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
const workflowRouter = Router();

workflowRouter.post('/create', authMiddleware, workflowcontroller.createWorkflow)

workflowRouter.get('/:workflowId', authMiddleware, workflowcontroller.getWorkflowById)

workflowRouter.get('/', authMiddleware, workflowcontroller.getAllWorkflows)

workflowRouter.put('/:workflowId', authMiddleware, workflowcontroller.updateWorkflow)

workflowRouter.delete('/:workflowId', authMiddleware, workflowcontroller.deleteWorkflow)


export default workflowRouter