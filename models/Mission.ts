import { Schema, model, models } from "mongoose";

const MissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      default: "General",
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    xp: {
      type: Number,
      default: 20,
      min: 0,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    // ✅ Added
    completedAt: {
      type: Date,
      default: null,
    },

    missionDate: {
      type: String,
      required: true,
      index: true,
    },

    generatedBy: {
      type: String,
      default: "AI",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate mission generation
MissionSchema.index(
  {
    userId: 1,
    missionDate: 1,
    title: 1,
  },
  {
    unique: true,
  }
);

// Fast lookup
MissionSchema.index({
  userId: 1,
  missionDate: 1,
});

export default models.Mission || model("Mission", MissionSchema);