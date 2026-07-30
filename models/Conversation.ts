import { Schema, model, models } from "mongoose";

const ConversationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "New Chat",
    },
  },
  {
    timestamps: true,
  }
);

export default models.Conversation ||
  model("Conversation", ConversationSchema);