import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaHome, FaCommentDots, FaInfoCircle, FaBars, FaTimes, FaEnvelope, FaGripHorizontal } from "react-icons/fa";
import styles from './Navigation.module.css';

const Navigation = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.menuIcon} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      <div className={styles.navLinks}>
        <Link className="pr-3 py-4 text-content hover:text-hover inline-flex items-center" href="#home">
          <FaHome className="mr-2" /> Home
        </Link>
        <Link className="px-3 py-4 text-content hover:text-hover inline-flex items-center" href="#chat">
          <FaCommentDots className="mr-2" /> Chat
        </Link>
        <Link className="px-3 py-4 text-content hover:text-hover inline-flex items-center" href="#about">
          <FaInfoCircle className="mr-2" /> About
        </Link>
        <Link className="px-3 py-4 text-content hover:text-hover inline-flex items-center" href="#projects">
          <FaGripHorizontal className="mr-2" /> Projects
        </Link>
        <Link className="px-3 py-4 text-content hover:text-hover inline-flex items-center" href="#contact">
          <FaEnvelope className="mr-2" /> Contact/Résumé
        </Link>
      </div>

      {
        <div className={`${styles.drawer} ${isOpen ? styles.active : ""}`}>
        <Link className="pr-6 py-4 text-content hover:text-hover inline-flex items-center" href="#home">
          <FaHome className="mr-2" /> Home
        </Link>
        <Link className="pr-6 py-4 text-content hover:text-hover inline-flex items-center" href="#chat">
          <FaCommentDots className="mr-2" /> Chat
        </Link>
        <Link className="pr-6 py-4 text-content hover:text-hover inline-flex items-center" href="#about">
          <FaInfoCircle className="mr-2" /> About
        </Link>
        <Link className="pr-6 py-4 text-content hover:text-hover inline-flex items-center" href="#projects">
          <FaGripHorizontal className="mr-2" /> Projects
        </Link>
        <Link className="pr-6 py-4 text-content hover:text-hover inline-flex items-center" href="#contact">
          <FaEnvelope className="mr-2" /> Contact/Résumé
        </Link>
      </div>}
    </nav>
  );
};

export default Navigation;
