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

function getContactName(contact) {
  return (
    contact?.name ||
    contact?.fullName ||
    contact?.username ||
    contact?.user?.name ||
    contact?.sender?.name ||
    contact?.senderId?.name ||
    ""
  ).trim();
}

function getContactImage(contact) {
  return (
    contact?.image ||
    contact?.profilePic ||
    contact?.profile_image ||
    contact?.avatar ||
    contact?.user?.image ||
    contact?.user?.profilePic ||
    ""
  );
}

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
  const contactName = getContactName(contact);
  const contactImage = getContactImage(contact);
  const displayName = contactName || "Select a chat";
  const contactInitial = contactName.charAt(0).toUpperCase() || "?";

  return (
    <div className="h-24 shrink-0 border-b border-gray-200 flex items-center justify-between px-8 bg-[#0B0F1A] text-white">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className={`relative w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-lg font-semibold ${getColor(
            contactName,
          )}`}
        >
          <span>{contactInitial}</span>
          {contactImage && (
            <img
              src={contactImage}
              alt=""
              className="absolute inset-0 w-full h-full rounded-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>

        {/* User Information */}
        <div className="flex flex-col min-w-0">
          <h2 className="text-2xl font-bold truncate text-white">
            {displayName}
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
