import { Router } from 'express'
import { authMiddleware } from '../../middlewares/authMiddleware.js'
import executioncontroller from './execution.controller.js'
const executionRouter = Router()


executionRouter.post('/start/:workflowId', authMiddleware, executioncontroller.startExecution)


export default executionRouter