import React from "react";

function EmptyChatContainer() {
  
  return (
    <div className="flex min-h-full bg-[#0B0F1A]">
      {/* Chat Container */}
      <div className="flex-1">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Select a conversation</h2>
            <p className="text-gray-500 mt-2">
              Choose a contact to start chatting
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmptyChatContainer;
