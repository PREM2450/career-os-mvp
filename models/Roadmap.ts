import mongoose, { Schema, models, model } from "mongoose";

const RoadmapSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    goalId: {
      type: Schema.Types.ObjectId,
      ref: "Goal",
      required: true,
    },

    day: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    xp: {
      type: Number,
      default: 50,
    },

    estimatedTime: {
      type: Number,
      default: 60, // minutes
    },
  },
  {
    timestamps: true,
  }
);

export default models.Roadmap || model("Roadmap", RoadmapSchema);