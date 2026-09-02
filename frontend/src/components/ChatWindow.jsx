"use client";

import { useSelector } from "react-redux";
import { useSocket } from "@/hooks/useSocket";

export default function ChatWindow({ currentUserId, activeConversationId }) {
  const { sendMessage } = useSocket(currentUserId);
  const messages = useSelector(
    (state) => state.chat.messages[activeConversationId] || [],
  );
  const onlineUsers = useSelector((state) => state.chat.onlineUsers);

  const handleSend = (text) => {
    sendMessage({
      senderId: currentUserId,
      receiverId: activeConversationId,
      conversationId: activeConversationId,
      text,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div>
      <div>
        {onlineUsers.includes(activeConversationId)
          ? "🟢 Online"
          : "⚪ Offline"}
      </div>
      {messages.map((m) => (
        <div key={m._id || m.tempId}>{m.text}</div>
      ))}
      {/* your input + send button calling handleSend(text) */}
    </div>
  );
}
