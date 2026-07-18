import type { Types } from "mongoose";
import { ApiError } from "../../utils/ApiError.js";
import { logger } from "../../config/logger.js";
import workflowRepository from "./workflow.repository.js";
import type { UpdateWorkflowDTO } from "./workflow.types.js";

class WorkflowService {
  async createWorkflow({ owner, name, description }: { owner: string; name: string; description: string }) {
    await this.ensureUniqueName(owner, name);

    const workflow = await workflowRepository.createWorkflow({
      owner,
      name,
      description,
      status: "draft",
      trigger: { type: "manual", cronExpression: null },
      nodes: [],
      edges: [],
      settings: { retryCount: 3, timeout: 30000, continueOnFailure: false }
    } as any);

    if (!workflow) {
      logger.error("workflow creation failed");
      throw new ApiError(400, "workflow creation failed");
    }
    return workflow;
  }

  async getWorkflowById(workflowId: string) {
    const cleanId = Array.isArray(workflowId) ? workflowId[0] : workflowId;
    if (!cleanId) throw new ApiError(400, "Workflow Id not found");

    const workflow = await workflowRepository.findWorkflowById(cleanId);
    if (!workflow) {
      throw new ApiError(404, "Workflow not found");
    }
    return workflow;
  }

  async getAllWorkflows(ownerId: string) {
    if (!ownerId) throw new ApiError(400, "Owner Id is required");
    const workflows = await workflowRepository.findByOwner(ownerId);
    return workflows || [];
  }

  async updateWorkflow(payload: UpdateWorkflowDTO) {
    if (!payload.workflowId) throw new ApiError(400, "Workflow Id is required");

    const workflowIdStr = payload.workflowId.toString();
    await this.verifyOwnership(workflowIdStr, payload.owner.toString());
    await this.ensureEditable(workflowIdStr);

    if (payload.name) {
      await this.ensureUniqueName(payload.owner.toString(), payload.name, workflowIdStr);
    }

    if (payload.nodes || payload.edges) {
      this.validateWorkflow(payload.nodes || [], payload.edges || []);
    }

    const updatedWorkflow = await workflowRepository.updateWorkflow(payload);
    if (!updatedWorkflow) {
      throw new ApiError(500, "Failed to update workflow");
    }
    return updatedWorkflow;
  }

  async deleteWorkflow(workflowId: string, ownerId: string) {
    await this.verifyOwnership(workflowId, ownerId);

    await workflowRepository.deleteWorkflow(workflowId as any);
    return true;
  }

  async publishWorkflow(workflowId: string, ownerId: string) {
    await this.verifyOwnership(workflowId, ownerId);
    const workflow = await this.getWorkflowById(workflowId);

    if (!workflow.nodes || workflow.nodes.length === 0) {
      throw new ApiError(400, "Cannot publish an empty workflow canvas with zero nodes");
    }

    this.validateWorkflow(workflow.nodes, workflow.edges || []);

    const updated = await workflowRepository.updateStatus(workflowId as any, "active");
    if (!updated) throw new ApiError(500, "Failed to publish workflow");

    logger.info(`Workflow ${workflowId} published successfully by user ${ownerId}`);
    return updated;
  }

  async pauseWorkflow(workflowId: string, ownerId: string) {
    await this.verifyOwnership(workflowId, ownerId);
    const workflow = await this.getWorkflowById(workflowId);

    if (workflow.status !== "active") {
      throw new ApiError(400, "Only active workflows can be paused");
    }

    const updated = await workflowRepository.updateStatus(workflowId as any, "paused");
    if (!updated) throw new ApiError(500, "Failed to pause workflow");

    return updated;
  }

  async archiveWorkflow(workflowId: string, ownerId: string) {
    await this.verifyOwnership(workflowId, ownerId);

    const updated = await workflowRepository.updateStatus(workflowId as any, "archived");
    if (!updated) throw new ApiError(500, "Failed to archive workflow");

    return updated;
  }

  async duplicateWorkflow(workflowId: string, ownerId: string) {
    await this.verifyOwnership(workflowId, ownerId);
    const originWorkflow = await this.getWorkflowById(workflowId);

    let baseName = `${originWorkflow.name} (Copy)`;
    let isUnique = false;
    let counter = 1;

    while (!isUnique) {
      const existing = await workflowRepository.findByOwner(ownerId);
      const nameConflict = existing.find(w => w.name === baseName);
      if (!nameConflict) {
        isUnique = true;
      } else {
        baseName = `${originWorkflow.name} (Copy ${counter++})`;
      }
    }

    const duplicatedWorkflow = await workflowRepository.createWorkflow({
      owner: ownerId,
      name: baseName,
      description: originWorkflow.description,
      status: "draft",
      trigger: originWorkflow.trigger,
      nodes: originWorkflow.nodes,
      edges: originWorkflow.edges,
      settings: originWorkflow.settings
    } as any);

    if (!duplicatedWorkflow) throw new ApiError(500, "Duplication engine failed");
    return duplicatedWorkflow;
  }

  private validateWorkflow(nodes: any[], edges: any[]) {
    const hasTriggerNode = nodes.some(node => node.type === "trigger" || node.type === "manual" || node.type === "cron");
    if (!hasTriggerNode && nodes.length > 0) {
      throw new ApiError(400, "Invalid Workflow Canvas: Graph must contain a target execution engine trigger block.");
    }

    if (nodes.length > 1 && edges.length === 0) {
      throw new ApiError(400, "Invalid Workflow Canvas: Multiple node profiles exist but structural linking edges are empty.");
    }
    edges.forEach(edge => {
      if (edge.source === edge.target) {
        throw new ApiError(400, `Circular reference validation failed on Node ID: ${edge.source}`);
      }
    });

    return true;
  }

  private async verifyOwnership(workflowId: string, ownerId: string) {
    const workflow = await this.getWorkflowById(workflowId);
    if (workflow.owner.toString() !== ownerId.toString()) {
      logger.warn(`Unauthorized resource modification attempt on workflow ${workflowId} by user ${ownerId}`);
      throw new ApiError(403, "Access Denied: You do not own this workflow profile configuration");
    }
  }

  private async ensureEditable(workflowId: string) {
    const workflow = await this.getWorkflowById(workflowId);
    if (workflow.status === "archived") {
      throw new ApiError(400, "Operation Lock: Archived workflows are immutable blueprints and cannot be edited.");
    }
  }

  private async ensureUniqueName(ownerId: string, name: string, excludeWorkflowId?: string) {
    const existingWorkflows = await workflowRepository.findByOwner(ownerId);
    const hasConflict = existingWorkflows.some(
      w => w.name.toLowerCase() === name.toLowerCase() && w._id.toString() !== excludeWorkflowId
    );

    if (hasConflict) {
      throw new ApiError(409, `A workflow named "${name}" already exists inside your engine configuration dashboard.`);
    }
  }
}

const workflowservice = new WorkflowService();
export default workflowservice;