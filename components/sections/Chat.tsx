import React from "react";
import ChatApp from "../Chat/ChatApp";

const Chat = (): JSX.Element => {
  return (
    <div className="py-16">
      <div
        id="chat"
        className="flex flex-col justify-center items-center md:flex-row"
      >
        <div>
          <img src="/acg head.png" />
        </div>
        <ChatApp />
      </div>
    </div>
  );
};

export default Chat;
