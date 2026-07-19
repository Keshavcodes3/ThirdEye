import { Schema, model, Types } from "mongoose";

const workflowExecutionSchema = new Schema(
    {
        workflow: {
            type: Types.ObjectId,
            ref: "Workflow",
            required: true
        },

        status: {
            type: String,
            enum: [
                "running",
                "success",
                "failed",
                "cancelled"
            ],
            default: "running"
        },

        startedAt: {
            type: Date,
            default: Date.now
        },

        finishedAt: {
            type: Date
        },

        currentNode: {
            type: String,
            required: true
        },

        context: {
            type: Schema.Types.Mixed,
            default: {}
        },

        logs: [
            {
                nodeId: String,

                nodeType: String,

                status: {
                    type: String,
                    enum: [
                        "success",
                        "failed",
                        "skipped"
                    ]
                },

                startedAt: Date,

                finishedAt: Date,

                duration: Number,

                input: Schema.Types.Mixed,

                output: Schema.Types.Mixed,

                error: String
            }
        ]
    },
    {
        timestamps: true
    })

const executionModel = model(
    "WorkflowExecution",
    workflowExecutionSchema
)

export default executionModel