import { Schema, model, models } from "mongoose";

const ResumeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    atsScore: {
      type: Number,
      required: true,
    },

    summary: {
      type: String,
      default: "",
    },

    strengths: [
      {
        type: String,
      },
    ],

    weaknesses: [
      {
        type: String,
      },
    ],

    technicalSkills: [
      {
        type: String,
      },
    ],

    softSkills: [
      {
        type: String,
      },
    ],

    missingKeywords: [
      {
        type: String,
      },
    ],

    suggestions: [
      {
        type: String,
      },
    ],

    companyRecommendations: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default models.Resume || model("Resume", ResumeSchema);