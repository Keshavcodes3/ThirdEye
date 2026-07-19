import type { Request, Response } from 'express'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { ApiError } from '../../utils/ApiError.js'
import workflowRepository from '../workflow/workflow.repository.js'
import executionModel from './execution.schema.js'
import { Types } from 'mongoose'
import workflowRunner from './workflow-runner.js'
class executionController {
    startExecution = asyncHandler(async (req: Request, res: Response) => {

        const workflowId = req.params?.workflowId
        if (!workflowId) throw new ApiError(404, "workflow id not provided")
        const workflow = await workflowRepository.findWorkflowById(workflowId as string)
        if (!workflow) throw new ApiError(404, "Workflow not found")
        //start workflow
        const startNode = workflow.nodes.find(
            node => node.type === "start"
        )

        if (!startNode) throw new ApiError(400, "Start node not found")
        const execution = await executionModel.create({
            workflow: workflow._id!,
            status: "running",
            currentNode: startNode.id!,
            context: {}
        })
        const runner = new workflowRunner(
            workflow,
            execution
        );

        const result = await runner.run();

        return res.status(200).json({
            message: "workflow executed",
            data: result
        });



    })
    getExecution = asyncHandler(async (req: Request, res: Response) => {

    })
}


const executioncontroller = new executionController()
export default executioncontroller