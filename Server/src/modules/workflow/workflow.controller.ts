import type { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiSuccessResponse } from "../../utils/ApiResponse.js";
import { ENV } from "../../config/env.js";
import { logger } from "../../config/logger.js";
import workflowRepository from "./workflow.repository.js";


class workflowController {
  createWorkflow = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, status } = req.body
    const owner = (req as any).user.userID
    const workflow = await workflowRepository.createWorkflow({
      owner,
      name,
      description,
      status,
      trigger:[],
      nodes:[],
      edges:[],
      settings:[]
    })
    if (!workflow) {
      logger.error("workflow creation failed")
      throw new ApiError(400, "workflow creation failed")
    }
    logger.success("workflow created successfully", workflow)
    return res.status(200).json(apiSuccessResponse(200, "workflow created successfully", workflow))
  })
}



const workflowcontroller = new workflowController()
export default workflowController
