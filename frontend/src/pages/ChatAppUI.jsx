"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import ChatHeader from "../components/ChatHeader";
import EmptyChatContainer from "../components/EmptyChatContainer";
import MessageComponent from "../components/MessageComponent";
import MessageInput from "../components/MessageInput";
import SidebarChats from "../components/SidebarChats";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../lib/axios";
import { socket } from "../lib/socket";
import { addMessage, setConnected, setMessages, updateMessageStatus } from "../store/chatSlice";


export default function ChatAppUI() {
  
  const selectedChat = useSelector((state) => state.chat.selectedChatData);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const currentUserId = user?._id || user?.id;
  const selectedChatId = selectedChat?._id || selectedChat?.id;


 useEffect(() => {
    if (!currentUserId) return undefined;

    socket.io.opts.query = { userId: currentUserId };
    socket.connect();

   socket.on("connect", () => {
    dispatch(setConnected(true));
    console.log("Socket connected:", socket.id);
  });

  socket.on("message_ack", ({ tempId, savedMessage }) => {
    dispatch(updateMessageStatus({
      conversationId: String(savedMessage.receiverId),
      tempId,
      status: "sent",
      realId: savedMessage._id,
    }));
  });

  socket.on("receive_message", (message) => {
    dispatch(
      addMessage({
        ...message,
        conversationId: String(message.senderId),
      }),
    );
  });

  socket.on("message_error", ({ tempId, error }) => {
    console.error("Message delivery failed:", error, tempId);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
    // err.message often includes the reason, e.g. "xhr poll error" for network issues
    // or a custom message if your server's middleware rejects the connection (e.g. bad auth)
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
    // reason can be "io server disconnect" (server forced it — won't auto-reconnect)
    // or "transport close" / "ping timeout" (network issue — will auto-reconnect)
    if (reason === "io server disconnect") {
      // server explicitly kicked the client off; reconnect manually if needed
      socket.connect();
    }
  });

  socket.on("reconnect_attempt", (attempt) => {
    console.log(`Reconnect attempt #${attempt}`);
  });

  socket.on("reconnect_failed", () => {
    console.error("Socket failed to reconnect after max attempts");
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });

  return () => {
    dispatch(setConnected(false));
    socket.off("connect");
    socket.off("connect_error");
    socket.off("message_ack");
    socket.off("receive_message");
    socket.off("message_error");
    socket.off("disconnect");
    socket.off("reconnect_attempt");
    socket.off("reconnect_failed");
    socket.off("error");
    socket.disconnect();
  };
}, [currentUserId, dispatch]);

  useEffect(() => {
    if (!selectedChatId) return undefined;

    const loadMessages = async () => {
      try {
        const response = await axiosInstance.get(`/api/messages/${selectedChatId}`);
        dispatch(setMessages({
          conversationId: selectedChatId,
          messages: (response.data.messages || []).map((message) => ({
            ...message,
            conversationId: selectedChatId,
          })),
        }));
      } catch (error) {
        console.error("Unable to load conversation:", error);
        dispatch(setMessages({ conversationId: selectedChatId, messages: [] }));
      }
    };

    loadMessages();
  }, [dispatch, selectedChatId]);

  return (
    <div className="h-dvh min-h-0 overflow-hidden bg-[#F5F5F5] flex text-black">
      {/* Sidebar */}

      <SidebarChats />

      {/* Chat Section */}
      <main className="min-w-0 min-h-0 flex-1 flex flex-col bg-[#FAFAFA]">
        {/* Header */}

        <div className="shrink-0">
          <ChatHeader />
        </div>

        {/* Messages */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {selectedChat === null ? <EmptyChatContainer /> : <MessageComponent />}
        </div>
        {/* Input Area */}

        <div className="shrink-0 bg-[#0B0F1A]  ">
          <MessageInput currentUserId={currentUserId} receiverId={selectedChatId} />
        </div>
      </main>
    </div>
  );
}
