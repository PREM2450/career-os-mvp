import mongoose, { Schema, models } from "mongoose";

const UserSettingsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    appearance: {
      theme: {
        type: String,
        default: "dark",
      },
      accentColor: {
        type: String,
        default: "#8B5CF6",
      },
      animations: {
        type: Boolean,
        default: true,
      },
      glassmorphism: {
        type: Boolean,
        default: true,
      },
    },

    notifications: {
      missionReminder: {
        type: Boolean,
        default: true,
      },
      goalReminder: {
        type: Boolean,
        default: true,
      },
      achievementPopup: {
        type: Boolean,
        default: true,
      },
      emailNotification: {
        type: Boolean,
        default: false,
      },
      soundEffects: {
        type: Boolean,
        default: true,
      },
      pushNotification: {
        type: Boolean,
        default: false,
      },
    },

    ai: {
      difficulty: {
        type: String,
        default: "Adaptive",
      },
      missionCount: {
        type: Number,
        default: 5,
      },
      learningStyle: {
        type: String,
        default: "Mixed",
      },
      motivation: {
        type: Boolean,
        default: true,
      },
      strictMode: {
        type: Boolean,
        default: false,
      },
      roadmapUpdate: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default models.UserSettings ||
  mongoose.model("UserSettings", UserSettingsSchema);