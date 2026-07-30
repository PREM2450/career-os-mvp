import mongoose, { Schema, models, model } from "mongoose";

const TaskSchema = new Schema(
  {
    goalId: {
      type: Schema.Types.ObjectId,
      ref: "Goal",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "AI Study",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    xp: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Task || model("Task", TaskSchema);