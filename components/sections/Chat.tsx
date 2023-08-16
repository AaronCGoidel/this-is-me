import React from "react";
import ChatApp from "../Chat/ChatApp";

const Chat = (): JSX.Element => {
  return (
    <div className="py-16">
      <div
        id="chat"
        className="flex flex-col justify-center items-center md:flex-row"
      >
        <div className="md:w-2/5 w-3/5">
          <img src="/acg head.png"/>
        </div>
        <ChatApp />
      </div>
      {/* add note */}
      <div className="flex flex-col justify-center items-center md:flex-row">
        <p className="text-xs text-gray-500 mt-3">*This chatbot may occasionally provide inaccurate information, break character, fail to finish a thought, or otherwise behave unexpectedly.</p>
      </div>
    </div>
  );
};

export default Chat;
