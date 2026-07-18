import type { Types } from "mongoose";
import { ApiError } from "../../utils/ApiError.js";
import workflowModel from "./workflow.schema.js";
import type { UpdateWorkflowDTO } from "./workflow.types.js";


export interface workflowType {
  owner: string,
  name: string,
  description: string,
  status: "draft" | "active" | "archived",
  trigger: {},
  nodes: [],
  edges: [],
  settings: {}

}

class workflowrepository {
  async createWorkflow(workflowData: workflowType) {
    const workflow = await workflowModel.create(workflowData)
    if (!workflow) {
      return null
    }
    return workflow
  }

  async findWorkflowById(workflowId: string | Types.ObjectId) {
    const workflow = await workflowModel.findById(workflowId)
    if (!workflow) return null
    return workflow
  }

  async findByOwner(ownerId: string | Types.ObjectId) {
    const workflows = await workflowModel.find({
      owner: ownerId
    })
    return workflows
  }

  async updateWorkflow(payload: UpdateWorkflowDTO) {
    const workflow = await this.findWorkflowById(payload.workflowId)
    if (!workflow) throw new ApiError(404, "Workflow not found")
    const query = {
      name: payload.name || workflow.name,
      description: payload.description || workflow.description,
      status: payload.status || workflow.status,
      trigger: payload.trigger || workflow.trigger,
      nodes: payload.nodes || workflow.nodes,
      edges: payload.edges || workflow.edges,
      settings: payload.settings || workflow.settings
    }
    const UpdatedWorkflow = await workflowModel.findOneAndUpdate({
      owner: payload.owner,
      _id: payload.workflowId
    }, query, {
      new: true
    })
    if (!UpdatedWorkflow) return null
    return UpdatedWorkflow
  }

  async deleteWorkflow(workflowId: Types.ObjectId) {
    const workflow = await this.findWorkflowById(workflowId)
    if (!workflow) throw new ApiError(404, "Workflow not found")
    await workflowModel.findByIdAndDelete(workflowId)
  }
  async updateStatus(workflowId: Types.ObjectId, status: string) {
    const workflow = await this.findWorkflowById(workflowId)
    if (!workflow) throw new ApiError(404, "Workflow not found")
    const updatedWorkflow = await workflowModel.findByIdAndUpdate(workflowId,
      {
        '$set': {
          status: status
        }
      })
    if (!updatedWorkflow) {
      return null
    }
    return updatedWorkflow
  }

}

const workflowRepository = new workflowrepository()
export default workflowRepository