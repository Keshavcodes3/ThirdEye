import { Schema, model, Types } from "mongoose";

const workflowSchema = new Schema(
  {
    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "active", "paused", "archived"],
      default: "draft",
    },

    trigger: {
      type: {
        type: String,
        enum: ["manual", "cron", "webhook"],
        default: "manual",
      },

      cronExpression: {
        type: String,
        default: null,
      },
    },

    nodes: [
      {
        id: String,

        type: String,

        position: {
          x: Number,
          y: Number,
        },

        data: Schema.Types.Mixed,
      },
    ],

    edges: [
      {
        id: String,

        source: String,

        target: String,

        sourceHandle: String,

        targetHandle: String,
      },
    ],

    settings: {
      retryCount: {
        type: Number,
        default: 3,
      },

      timeout: {
        type: Number,
        default: 30000,
      },

      continueOnFailure: {
        type: Boolean,
        default: false,
      },
    },

    lastExecutedAt: {
      type: Date,
      default: Date.now()
    },

    totalExecutions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);


workflowSchema.index(
  { owner: 1, name: 1 },
  { unique: true }
);


const workflowModel = model("Workflow", workflowSchema);



export default workflowModel