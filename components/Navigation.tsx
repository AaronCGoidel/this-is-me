import React, { useState } from "react";
import {
  FaHome,
  FaCommentDots,
  FaInfoCircle,
  FaBars,
  FaTimes,
  FaEnvelope,
  FaGripHorizontal,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import styles from "./Navigation.module.css";

const Navigation = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  type Link = {
    icon: JSX.Element;
    text: string;
    href: string;
    external?: boolean;
  };

  const handleLinkClick = (e, link: Link) => {
    if (link.external) {
      return;
    }
    e.preventDefault();
    const element = document.querySelector(link.href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const links: Link[] = [
    { icon: <FaHome className="mr-2" />, text: "Home", href: "#home" },
    { icon: <FaCommentDots className="mr-2" />, text: "Chat", href: "#chat" },
    { icon: <FaInfoCircle className="mr-2" />, text: "About", href: "#about" },
    {
      icon: <FaGripHorizontal className="mr-2" />,
      text: "Projects",
      href: "#projects",
    },
    {
      icon: <FaEnvelope className="mr-2" />,
      text: "Contact/Résumé",
      href: "#contact",
    },
    {
      icon: <FaGithub className="mr-2" />,
      text: "Github",
      href: "https://github.com/aaroncgoidel/",
      external: true,
    },
    {
      icon: <FaLinkedin className="mr-2" />,
      text: "LinkedIn",
      href: "https://www.linkedin.com/in/aaroncgoidel/",
      external: true,
    },
  ];

  return (
    <nav className={styles.navbar}>
      <div
        className={`text-heading rounded-full p-3 shadow-md bg-white ${styles.menuIcon}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      <div className={styles.navLinks}>
        {links.map((link, index) => (
          <a
            className="pr-6 py-4 text-content hover:text-hover inline-flex items-center"
            href={link.href}
            onClick={(e) => handleLinkClick(e, link)}
            key={index}
            target={link.external ? "_blank" : undefined}
          >
            {link.icon} {link.text}
          </a>
        ))}
      </div>

      <div className={`${styles.drawer} ${isOpen ? styles.active : ""}`}>
        {links.map((link, index) => (
          <a
            className="pr-6 py-4 text-content hover:text-hover inline-flex items-center"
            href={link.href}
            onClick={(e) => handleLinkClick(e, link)}
            key={index}
          >
            {link.icon} {link.text}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
