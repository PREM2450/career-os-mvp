import mongoose, { Schema, models, model } from "mongoose";

const GoalSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      default: "",
      trim: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    dailyHours: {
      type: Number,
      default: 2,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
  },
  {
    timestamps: true,
  }
);

export default models.Goal || model("Goal", GoalSchema);