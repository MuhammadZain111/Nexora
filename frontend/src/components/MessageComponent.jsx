"use client";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";

function MessageComponent() {


  const { user } = useAuth();

  const selectedChat = useSelector((state) => state.chat.selectedChatData);

  const selectedChatId = selectedChat?._id || selectedChat?.id;

  const messages = useSelector((state) => state.chat.messages[selectedChatId] || []);

  const currentUserId = user?._id || user?.id;

  return (
    <div className="min-h-full px-4 sm:px-10 py-8 space-y-4">
      {messages.length === 0 && (
        <p className="text-center text-gray-500">No messages yet. Say hello.</p>
      )}

      {messages.map((message) => {
       
       const isMine = String(message.senderId) === String(currentUserId);
        
        const messageText = message.text || message.message;

        return (
          <div
            key={message._id || message.tempId}
            className={isMine ? "flex justify-end" : "flex justify-start"}
          >
            <div className="max-w-[75%]">
              <div
                className={
                  isMine
                    ? "bg-black text-white rounded-2xl px-4 py-3"
                    : "bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm"
                }
              >
                <p>{messageText}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 px-1">
                {message.createdAt
                  ? new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
                {message.status === "pending" ? " · Sending" : ""}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MessageComponent;
