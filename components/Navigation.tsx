import Link from "next/link";
import React from "react";
import { FaHome, FaCommentDots, FaInfoCircle } from "react-icons/fa";

const Navigation = (): JSX.Element => {
  return (
    <nav>
      <Link
        className="pr-6 py-4 text-content hover:text-hover inline-flex items-center"
        href="/"
      >
        <FaHome className="mr-1" /> Home
      </Link>
      <Link
        className="px-6 py-4 text-content hover:text-hover inline-flex items-center"
        href="/about"
      >
        <FaCommentDots className="mr-1" /> Chat
      </Link>
      <Link
        className="px-6 py-4 text-content hover:text-hover inline-flex items-center"
        href="/about"
      >
        <FaInfoCircle className="mr-1" /> About
      </Link>
    </nav>
  );
};

export default Navigation;
