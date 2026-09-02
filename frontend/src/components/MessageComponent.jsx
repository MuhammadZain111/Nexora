"use client";
import React from "react";
import { useEffect } from "react";
import { socket } from "@/lib/socket";

function MessageComponent() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection failed:", error.message);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto px-10 py-8 space-y-8">
      {/* Incoming Message */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-semibold">
          A
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <p className="font-semibold">Ali Khan</p>
            <span className="text-sm text-gray-500">11:45 AM</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 max-w-[500px] shadow-sm">
            <p className="text-gray-700">
              Hello everyone 👋 Welcome to the new chat application.
            </p>
          </div>
        </div>
      </div>

      {/* Outgoing Message */}
      <div className="flex justify-end">
        <div>
          <div className="bg-black text-white rounded-2xl p-5 max-w-[400px] shadow-lg">
            <p>The UI design is completed successfully. Please review it.</p>
          </div>

          <p className="text-sm text-gray-500 mt-2 text-right">11:47 AM</p>
        </div>
      </div>

      {/* File Message */}
      <div className="flex justify-end">
        <div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 w-[360px] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-xl">
                📄
              </div>

              <div>
                <p className="font-medium text-sm">project-design.zip</p>
                <p className="text-xs text-gray-500">2.5 MB</p>
              </div>
            </div>

            <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
              ↓
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-2 text-right">11:50 AM</p>
        </div>
      </div>
    </div>
  );
}

export default MessageComponent;
