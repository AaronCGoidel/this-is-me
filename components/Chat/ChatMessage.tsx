import React from "react";

const ChatMessage = ({ isReceived, content }) => {
  const messageClass = isReceived ? "max-w-xs" : "max-w-xs ml-auto justify-end";
  const bubbleClass = isReceived
    ? "bg-gray-200 p-3 rounded-r-lg rounded-bl-lg"
    : "bg-primary text-white p-3 rounded-l-lg rounded-br-lg";

  return (
    <div className={`flex w-full mt-2 space-x-3 ${messageClass}`}>
      <div>
        <div className={bubbleClass}>
          <p className="text-sm">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
