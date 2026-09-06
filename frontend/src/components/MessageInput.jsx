"use client";
import { useRef, useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { useDispatch } from "react-redux";
import { socket } from "@/lib/socket";
import { addMessage } from "@/store/chatSlice";

function MessageInput({ currentUserId, receiverId }) {
  const dispatch = useDispatch();
  const emojiRef = useRef();

  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const handleAddEmoji = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiPickerOpen(false);
      }
    };

    if (emojiPickerOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [emojiPickerOpen]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    if (!receiverId) {
      console.error("No receiverId provided — can't route this message.");
      return;
    }

    const tempId = `temp-${Date.now()}`;

    const payload = {
      tempId,
      senderId: currentUserId,
      receiverId,
      conversationId: receiverId,
      text: message,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    // Optimistically render it right away
    dispatch(addMessage(payload));

    // Send it to the server over the socket
    socket.emit("send_message", payload);

    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="shrink-0 p-3 sm:p-4 border-t border-gray-200 ">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative flex-1 flex items-center  border border-gray-200 rounded-2xl px-5 py-4">
          <input
            type="text"
            placeholder="Enter message"
            className="flex-1 bg-transparent outline-none text-white"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <div className="flex items-center gap-2 sm:gap-4 text-xl sm:text-2xl text-gray-600">
            <button type="button">📎</button>
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => setEmojiPickerOpen((prev) => !prev)}
            >
              😊
            </button>
          </div>

          <div
            className="absolute bottom-16 right-0 cursor-pointer"
            ref={emojiRef}
          >
            <EmojiPicker
              theme="light"
              onEmojiClick={handleAddEmoji}
              open={emojiPickerOpen}
              autoFocusSearch={false}
            />
          </div>
        </div>

        <button
          type="button"
          className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-black text-white text-xl sm:text-2xl shadow-lg hover:scale-105 transition-all"
          onClick={handleSendMessage}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
