import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    // Kept optional so existing messages without a conversation can still be read.
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },

    delivered: {
      type: Boolean,
      default: false,
    },

    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Messsagemodal =
  mongoose.models.Messagemodel || mongoose.model("Messagemodel", messageSchema);

export default Messsagemodal;
