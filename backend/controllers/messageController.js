import Message from "../models/Messagemodel.js";

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error loading messages:", error.message);
    res.status(500).json({ message: "Unable to load messages" });
  }
};
