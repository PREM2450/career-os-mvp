import { Schema, model, models } from "mongoose";

const AchievementSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    key: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      default: "🏆",
    },

    category: {
  type: String,
  enum: [
    "Mission",
    "Streak",
    "Resume",
    "LeetCode",
    "GitHub",
    "AI",
    "Goal",
    "XP",
    "Level",
  ],
  default: "Mission",
},

    xpReward: {
      type: Number,
      default: 0,
    },

    unlocked: {
      type: Boolean,
      default: false,
    },

    unlockedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

AchievementSchema.index(
  {
    userId: 1,
    key: 1,
  },
  {
    unique: true,
  }
);

export default models.Achievement ||
  model("Achievement", AchievementSchema);