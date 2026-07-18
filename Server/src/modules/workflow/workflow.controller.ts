import type { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiFailedResponse, apiSuccessResponse } from "../../utils/ApiResponse.js";
import { ENV } from "../../config/env.js";
import { logger } from "../../config/logger.js";
import workflowRepository from "./workflow.repository.js";
import { Types } from "mongoose";
import workflowservice from "./workflow.service.js";

class workflowController {
  createWorkflow = asyncHandler(async (req: Request, res: Response) => {
    const { name, description } = req.body
    const owner = (req as any).user.userID
    const workflow = await workflowservice.createWorkflow({
      owner,
      name,
      description
    })
    return res.status(200).json(apiSuccessResponse(200, "workflow created successfully", workflow))
  })


  getWorkflowById = asyncHandler(async (req: Request, res: Response) => {
    let workflowId = req.params.workflowId;
    if (!workflowId) {
      return apiFailedResponse(400, "Workflow id not provided")
    }
    if (Array.isArray(workflowId)) {
      workflowId = workflowId[0];
    }

    const workflow = await workflowservice.getWorkflowById(workflowId as string);
    return res.status(200).json(apiSuccessResponse(200, "workflow fetched successfully", workflow))
  })


  getAllWorkflows = asyncHandler(async (req: Request, res: Response) => {
    const workflows = await workflowRepository.findByOwner((req as any).user.userID)
    if (!workflows) return apiFailedResponse(404, "No workflow found", [])
    return res.status(200).json(apiSuccessResponse(200, "workflows fetched successfully", workflows))
  })

  updateWorkflow = asyncHandler(async (req: Request, res: Response) => {
    const { workflowId, name, description, status, trigger, nodes, edges, settings } = req.body
    if (!workflowId) throw new ApiError(400, "Workflow Id not found")
    const updatedWorkflow = await workflowRepository.updateWorkflow({
      workflowId: new Types.ObjectId(workflowId),
      owner: (req as any).user.userID,
      name,
      description,
      status,
      trigger,
      nodes,
      edges,
      settings
    })
    if (!updatedWorkflow) return apiFailedResponse(404, "No workflow found",)
    return res.status(200).json(apiSuccessResponse(200, "workflow updated successfully", updatedWorkflow))
  })


  deleteWorkflow = asyncHandler(async (req: Request, res: Response) => {
    const workflowId = req.params.workflowId
    if (!workflowId) throw new ApiError(400, "Workflow Id not found")
    const cleanId = Array.isArray(workflowId) ? workflowId[0] : workflowId;
    if (!cleanId) throw new ApiError(400, "Workflow Id not found")
    const workflow = await workflowRepository.findWorkflowById(cleanId)
    return res.status(200).json(apiSuccessResponse(200, "workflow deleted successfully"))
  })

}



const workflowcontroller = new workflowController()
export default workflowcontroller
