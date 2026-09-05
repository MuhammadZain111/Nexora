"use client";
import SidebarChats from "../components/SidebarChats";
import ChatHeader from "../components/ChatHeader";
import MessageComponent from "../components/MessageComponent";
import MessageInput from "../components/MessageInput";
import { setSelectedChat } from "../store/chatSlice";
import EmptyChatContainer from "../components/EmptyChatContainer";
import { useSelector } from "react-redux";
import { useEffect } from 'react';
import { Link } from "react-router-dom";
import socket from "../socket/socket";


export default function ChatAppUI() {
  
  const selectedChat = useSelector((state) => state.chat.selectedChatData);


 useEffect(() => {
    socket.connect();

   socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
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
    socket.off("connect");
    socket.off("connect_error");
    socket.off("disconnect");
    socket.off("reconnect_attempt");
    socket.off("reconnect_failed");
    socket.off("error");
    socket.disconnect();
  };
}, []);

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex text-black">
      {/* Sidebar */}

      <SidebarChats />

      {/* Chat Section */}
      <main className="flex-1 flex flex-col bg-[#FAFAFA]">
        {/* Header */}

        <ChatHeader />

        {/* Messages */}
        {selectedChat === null ? <EmptyChatContainer /> : <MessageComponent />}
        {/* Input Area */}

        <MessageInput />
      </main>
    </div>
  );
}
