"use client";
import { socket } from "@/lib/socket";
import { addMessage } from "@/store/chatSlice";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

const EmojiPicker = lazy(() => import("emoji-picker-react"));

function MessageInput({ currentUserId, receiverId }) {
  const dispatch = useDispatch();
  const emojiRef = useRef();

  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const handleAddEmoji = (emojiData) => {
    setMessage((previousMessage) => `${previousMessage}${emojiData.emoji}`);
    setEmojiPickerOpen(false);
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
    <div className="shrink-0 p-2 sm:p-4 border-t border-gray-200">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative min-w-0 flex-1 flex items-center border border-gray-200 rounded-2xl px-3 sm:px-5 py-3 sm:py-4">
          <input
            type="text"
            placeholder="Enter message"
            className="flex-1 bg-transparent outline-none text-white"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <div className="flex items-center gap-1 sm:gap-4 text-lg sm:text-2xl text-gray-600">
            <button type="button">📎</button>
            <div ref={emojiRef} className="relative">
              <button
                type="button"
                className="cursor-pointer"
                aria-label="Add emoji"
                onClick={() => setEmojiPickerOpen((previous) => !previous)}
              >
                😊
              </button>

              {emojiPickerOpen && (
                <div className="absolute bottom-12 right-0 z-50">
                  <Suspense fallback={<div className="w-[min(350px,calc(100vw-2rem))] h-[min(450px,calc(100dvh-8rem))] bg-white rounded-lg" />}>
                    <EmojiPicker
                      theme="light"
                      onEmojiClick={handleAddEmoji}
                      autoFocusSearch={false}
                    />
                  </Suspense>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="w-11 h-11 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-black text-white text-xl sm:text-2xl shadow-lg hover:scale-105 transition-all"
          onClick={handleSendMessage}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
