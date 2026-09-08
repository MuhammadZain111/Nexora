"use client";
import { Circle, CircleOff } from "lucide-react";
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
  const onlineUsers = useSelector((state) => state.chat.onlineUsers);

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
  const contactId = String(
    contact?._id ||
      contact?.id ||
      contact?.userId ||
      contact?.user?._id ||
      contact?.user?.id ||
      "",
  );
  const isOnline = Boolean(contactId && onlineUsers.includes(contactId));

  return (
    <div className="min-h-20 shrink-0 border-b border-gray-200 flex items-center justify-between gap-3 px-4 sm:px-8 py-3 bg-[#0B0F1A] text-white">
      <div className="min-w-0 flex items-center gap-3 sm:gap-4">
        {/* Avatar */}
        <div
            className={`relative w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full flex items-center justify-center text-lg font-semibold ${getColor(
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
          <h2 className="text-lg sm:text-2xl font-bold truncate text-white">
            {displayName}
          </h2>

          {contact?.email && (
            <p className="text-sm text-gray-400 truncate">{contact.email}</p>
          )}

        </div>

        {/* Online Indicator */}
        {contact && (
          isOnline ? (
            <Circle
              size={14}
              strokeWidth={3}
              className="shrink-0 text-emerald-400"
              fill="currentColor"
              aria-label="Online"
              title="Online"
            />
          ) : (
            <CircleOff
              size={16}
              strokeWidth={2.5}
              className="shrink-0 text-gray-400"
              aria-label="Offline"
              title="Offline"
            />
          )
        )}
      </div>

      {/* Close Chat */}
      <button
        onClick={handleCloseChat}
        className="text-3xl font-light  hover:text-black transition text-white hover:cursor-pointer  "
        aria-label="Close chat"
      >
        ×
      </button>
    </div>
  );
}

export default ChatHeader;
