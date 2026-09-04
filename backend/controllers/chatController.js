import Message from "../models/Messagemodel.js";
import Conversation from "../models/conversationmodel.js";

// GET /api/messages/:conversationId


export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to view this conversation" });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate("senderId", "username avatar");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/messages/:conversationId
export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.participants.includes(senderId)) {
      return res.status(403).json({ message: "Not authorized to send in this conversation" });
    }

    if (!text && !image) {
      return res.status(400).json({ message: "Message must have text or image" });
    }

    const newMessage = await Message.create({
      conversationId,
      senderId,
      text,
      image,
    });

    conversation.lastMessage = newMessage._id;
    await conversation.save();

    const populatedMessage = await newMessage.populate("senderId", "username avatar");

    // emit via socket.io if you're broadcasting to conversation room
    // io.to(conversationId).emit("newMessage", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/messages/:messageId
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this message" });
    }

    await message.deleteOne();

    // io.to(message.conversationId.toString()).emit("messageDeleted", messageId);

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error in deleteMessage controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const createConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user.id;

    let conversation = await Conversation.findOne({
      participants: {
        $all: [currentUserId, userId],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [currentUserId, userId],
      });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create conversation",
    });
  }
}; 




export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const currentUserId = req.user.id;

    // Find the conversation
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    // Make sure the current user belongs to this conversation
    const isParticipant = conversation.participants.some(
      (participantId) =>
        participantId.toString() === currentUserId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not allowed to delete this conversation",
      });
    }

    // Delete the conversation
    await Conversation.findByIdAndDelete(conversationId);

    // Optional: delete all messages belonging to this conversation
    await Message.deleteMany({
      conversationId: conversationId,
    });

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Delete conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete conversation",
      error: error.message,
    });
  }
}


export const getConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Your database logic here

    res.status(200).json({
      message: "Conversation fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);

    res.status(500).json({
      message: "Failed to fetch conversation",
      error: error.message,
    });
  }
};



export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `
      SELECT
        c.id AS conversation_id,
        c.created_at,

        u.id AS user_id,
        u.name,
        u.email,
        u.profile_image,
        u.is_online

      FROM conversations c

      INNER JOIN conversation_participants cp
        ON c.id = cp.conversation_id

      INNER JOIN conversation_participants cp2
        ON c.id = cp2.conversation_id

      INNER JOIN users u
        ON u.id = cp2.user_id

      WHERE cp.user_id = $1
        AND cp2.user_id != $1

      ORDER BY c.created_at DESC
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      conversations: result.rows,
    });

  } catch (error) {
    console.error("Get conversations error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
      error: error.message,
    });
  }
};