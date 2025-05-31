"use client";

import { useState, useEffect, useRef } from "react";
import { ppMori } from "@/app/lib/fonts";

interface HamburgerMenuProps {
  className?: string;
  onPromptClick?: (prompt: string) => void;
  onResetChat?: () => void;
}

export default function HamburgerMenu({
  className = "",
  onPromptClick,
  onResetChat,
}: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeMenu();
        buttonRef.current?.focus();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const menuItems = [
    {
      label: "About Aaron",
      prompt: "Give me a brief bio for Aaron",
      description: "Learn about Aaron's background",
    },
    {
      label: "Resume",
      prompt: "Can I have a copy of Aaron's resume?",
      description: "View and download Aaron's resume",
    },
    {
      label: "Connect",
      prompt: "How can I connect with Aaron?",
      description: "Get Aaron's social links and contact info",
    },
    {
      label: "Schedule Meeting",
      prompt: "Schedule a meeting with Aaron",
      description: "Book a call with Aaron",
    },
    {
      label: "Projects",
      prompt: "What are some of Aaron's notable projects?",
      description: "Explore Aaron's work and projects",
    },
  ];

  const utilityItems = [
    {
      label: "Reset Chat",
      action: () => onResetChat?.(),
      description: "Clear all messages and start fresh",
      isDestructive: true,
    },
  ];

  const handleItemClick = (prompt: string) => {
    if (onPromptClick) {
      onPromptClick(prompt);
    }
    closeMenu();
  };

  const handleUtilityClick = (action: () => void) => {
    action();
    closeMenu();
  };

  return (
    <div ref={menuRef} className={`fixed top-4 right-4 z-50 ${className}`}>
      {/* Hamburger Button */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="w-12 h-12 bg-[#020203] hover:bg-[#020203]/80 rounded-lg flex flex-col items-center justify-center space-y-1.5 transition-all duration-300 shadow-lg border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-white/20"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Menu Dropdown */}
      <div
        className={`absolute top-16 right-0 w-72 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200/20 transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        role="menu"
        aria-labelledby="menu-button"
      >
        <div className="p-2">
          <div className="px-3 py-2 mb-1">
            <h3
              className={`text-sm font-semibold text-[#020203] ${ppMori.semiBold}`}
            >
              Quick Actions
            </h3>
          </div>
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item.prompt)}
              className={`w-full text-left px-3 py-3 text-[#020203] hover:bg-[#020203]/10 rounded-md transition-all duration-200 group focus:outline-none focus:bg-[#020203]/10 ${ppMori.regular}`}
              role="menuitem"
              tabIndex={isOpen ? 0 : -1}
            >
              <div className="flex flex-col">
                <span className={`font-medium ${ppMori.semiBold} text-sm`}>
                  {item.label}
                </span>
                <span className="text-xs text-gray-600 mt-0.5">
                  {item.description}
                </span>
              </div>
            </button>
          ))}

          {utilityItems.length > 0 && (
            <>
              <div className="border-t border-gray-200/50 my-2"></div>
              <div className="px-3 py-2 mb-1">
                <h3
                  className={`text-sm font-semibold text-[#020203] ${ppMori.semiBold}`}
                >
                  Utilities
                </h3>
              </div>
              {utilityItems.map((item, index) => (
                <button
                  key={`utility-${index}`}
                  onClick={() => handleUtilityClick(item.action)}
                  className={`w-full text-left px-3 py-3 rounded-md transition-all duration-200 group focus:outline-none ${
                    item.isDestructive
                      ? "text-red-600 hover:bg-red-50 focus:bg-red-50"
                      : "text-[#020203] hover:bg-[#020203]/10 focus:bg-[#020203]/10"
                  } ${ppMori.regular}`}
                  role="menuitem"
                  tabIndex={isOpen ? 0 : -1}
                >
                  <div className="flex flex-col">
                    <span className={`font-medium ${ppMori.semiBold} text-sm`}>
                      {item.label}
                    </span>
                    <span className="text-xs mt-0.5 opacity-70">
                      {item.description}
                    </span>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
