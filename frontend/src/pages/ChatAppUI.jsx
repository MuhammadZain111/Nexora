"use client";
import SidebarChats from "../components/SidebarChats";
import ChatHeader from "../components/ChatHeader";
import MessageComponent from "../components/MessageComponent";
import MessageInput from "../components/MessageInput";
import { appStore } from "../store/appStore";
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

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
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
