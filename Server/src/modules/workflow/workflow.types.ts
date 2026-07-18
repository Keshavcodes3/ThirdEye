import { Types } from "mongoose";

export type WorkflowStatus =
    | "draft"
    | "active"
    | "paused"
    | "archived";

export type WorkflowTrigger = {
    type: "manual" | "cron" | "webhook";
    cronExpression?: string | null;
};

export interface NodePosition {
    x: number;
    y: number;
}

export interface WorkflowNode {
    id: string;
    type: string;
    position: NodePosition;
    data: Record<string, unknown>;
}

export interface WorkflowEdge {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
}

export interface WorkflowSettings {
    retryCount?: number;
    timeout?: number;
    continueOnFailure?: boolean;
}

export interface UpdateWorkflowDTO {
    workflowId: Types.ObjectId;
    owner: Types.ObjectId ,

    name?: string;
    description?: string;
    status?: WorkflowStatus;
    trigger?: WorkflowTrigger;

    nodes?: WorkflowNode[];
    edges?: WorkflowEdge[];

    settings?: WorkflowSettings;
}