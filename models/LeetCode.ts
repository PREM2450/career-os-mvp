import mongoose, { Schema, models, model } from "mongoose";

const LeetCodeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    profileUrl: {
      type: String,
      default: "",
    },

    totalSolved: {
      type: Number,
      default: 0,
    },

    easySolved: {
      type: Number,
      default: 0,
    },

    mediumSolved: {
      type: Number,
      default: 0,
    },

    hardSolved: {
      type: Number,
      default: 0,
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    acceptanceRate: {
      type: Number,
      default: 0,
    },

    ranking: {
      type: Number,
      default: 0,
    },

    contestRating: {
      type: Number,
      default: 0,
    },

    contestAttended: {
      type: Number,
      default: 0,
    },

    streak: {
      type: Number,
      default: 0,
    },

    badges: [
      {
        type: String,
      },
    ],

    lastSynced: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default models.LeetCode ||
  model("LeetCode", LeetCodeSchema);