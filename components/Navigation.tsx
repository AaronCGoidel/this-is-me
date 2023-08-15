import React, { useState } from "react";
import {
  FaHome,
  FaCommentDots,
  FaInfoCircle,
  FaBars,
  FaTimes,
  FaEnvelope,
  FaGripHorizontal,
} from "react-icons/fa";
import styles from "./Navigation.module.css";

const Navigation = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const links = [
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
  ];

  return (
    <nav className={styles.navbar}>
      <div
        className={`text-heading ${styles.menuIcon}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      <div className={styles.navLinks}>
        {links.map((link, index) => (
          <a
            className="pr-6 py-4 text-content hover:text-hover inline-flex items-center"
            href={link.href}
            onClick={(e) => handleLinkClick(e, link.href)}
            key={index}
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
            onClick={(e) => handleLinkClick(e, link.href)}
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
