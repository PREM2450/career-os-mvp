import { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {settings: {
  appearance: {
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
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
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    goal: {
      type: String,
      default: "",
    },
    dreamCompany: {
  type: String,
  default: "",
},

communicationScore: {
  type: Number,
  default: 50,
},

readinessScore: {
  type: Number,
  default: 0,
},

selectionProbability: {
  type: Number,
  default: 0,
},
githubUsername: {
  type: String,
  default: "",
},
atsScore: {
  type: Number,
  default: 0,
},

resumeSummary: {
  type: String,
  default: "",
},

resumeStrengths: {
  type: [String],
  default: [],
},

resumeWeaknesses: {
  type: [String],
  default: [],
},

technicalSkills: {
  type: [String],
  default: [],
},

softSkills: {
  type: [String],
  default: [],
},

missingKeywords: {
  type: [String],
  default: [],
},

resumeImprovements: {
  type: [String],
  default: [],
},

resumeFileName: {
  type: String,
  default: "",
},

resumeUploadedAt: {
  type: Date,
  default: null,
},
    // Experience Points
    xp: {
      type: Number,
      default: 0,
    },

    // User Level
    level: {
      type: Number,
      default: 1,
    },

    // Current Daily Streak
    streak: {
      type: Number,
      default: 0,
    },

    // Highest Streak Achieved
    longestStreak: {
      type: Number,
      default: 0,
    },

    // Last Date User Completed Any Mission
    lastActivityDate: {
    type: Date,
    default: null,

    },
  },
  {
    timestamps: true,
  }
);

export default models.User || model("User", UserSchema);