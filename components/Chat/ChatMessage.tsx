import React from "react";
import ReactMarkdown from "react-markdown";

const ChatMessage = ({ isReceived, content }) => {
  const messageClass = isReceived ? "max-w-sm" : "max-w-sm ml-auto justify-end";
  const bubbleClass = isReceived
    ? "bg-gray-200 p-3 rounded-r-lg rounded-bl-lg"
    : "bg-primary text-white p-3 rounded-l-lg rounded-br-lg";

  const color = isReceived ? "text-black" : "text-white";
  const codeColor = isReceived
    ? "border-primary text-black"
    : "border-white text-white";

  const markdownComponents = {
    a: ({ node, ...props }) => (
      <a
        {...props}
        className={`${color} underline decoration-dashed`}
        target="_blank"
      />
    ),
    h1: ({ node, ...props }) => (
      <h1 {...props} className={`${color} text-xl font-bold my-2`} />
    ),
    h2: ({ node, ...props }) => (
      <h2 {...props} className={`${color} text-lg font-bold my-2`} />
    ),
    h3: ({ node, ...props }) => (
      <h3 {...props} className={`${color} text-base font-bold my-2`} />
    ),
    p: ({ node, ...props }) => <p {...props} className={`${color}`} />,
    pre: ({ node, ...props }) => (
      <pre
        {...props}
        className={`${codeColor} bg-gray-200 text-sm p-1 border-2 rounded`}
      />
    ),
    li: ({ node, ...props }) => <li {...props} className={`my-2`} />,
  };

  return (
    <div className={`flex w-full max-w-full mt-2 space-x-3 ${messageClass}`}>
      <div>
        <div className={bubbleClass}>
          <ReactMarkdown components={markdownComponents} children={content} />
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
