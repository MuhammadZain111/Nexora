"use client";
import { useDispatch, useSelector } from "react-redux";
import { closeChat } from "../store/chatSlice";

const AVATAR_COLORS = [
  "bg-red-500 text-white",
  "bg-blue-500 text-white",
  "bg-green-500 text-white",
  "bg-purple-500 text-white",
  "bg-orange-500 text-white",
  "bg-pink-500 text-white",
];

function ChatHeader() {
 
  const dispatch = useDispatch();

  const selectedChatData = useSelector((state) => state.chat.selectedChatData);

  const getColor = (name = "") => {
    if (!name) return AVATAR_COLORS[0];

    const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[idx];
  };

  const handleCloseChat = () => {
    dispatch(closeChat());
  };

  const contact = selectedChatData;

  console.log(contact);

  return (
    <div className="h-24 shrink-0 border-b border-gray-200 flex items-center justify-between px-8 bg-[#0B0F1A] text-white">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${getColor(
            contact?.name,
          )}`}
        >
          {contact?.name?.charAt(0).toUpperCase() || "?"}
        </div>

        {/* User Information */}
        <div className="flex flex-col min-w-0">
          <h2 className="text-2xl font-bold truncate text-white">
            {contact?.name || "Select a chat"}
          </h2>

          {contact?.email && (
            <p className="text-sm text-gray-400 truncate">{contact.email}</p>
          )}

          {/* <p className="text-sm text-gray-500">
            {contact?.isOnline ? "Online" : "Offline"}
            {onlineUsers.includes(activeConversationId)
              ? "🟢 Online"
              : "⚪ Offline"}
          </p> */}
        </div>

        {/* Online Indicator */}
        {contact && (
          <div className="relative shrink-0">
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                contact?.isOnline ? "bg-emerald-400" : "bg-gray-400"
              }`}
            />
          </div>
        )}
      </div>

      {/* Close Chat */}
      <button
        onClick={handleCloseChat}
        className="text-3xl font-light text-gray-500 hover:text-black transition"
        aria-label="Close chat"
      >
        ×
      </button>
    </div>
  );
}

export default ChatHeader;
