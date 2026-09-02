import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

// Speeds up lookups like: Conversation.findOne({ participants: { $all: [senderId, receiverId] } })
conversationSchema.index({ participants: 1 });

const Conversatio = mongoose.model("Conversation", conversationSchema);

export default Conversation;