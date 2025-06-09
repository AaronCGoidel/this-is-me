"use client";

import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Profile } from "@/contexts/UserContext";
import { getMenuPrompts } from "@/lib/cannedPrompts";
import { ppMori } from "@/app/lib/fonts";
import { useBackdrop } from "./BackdropProvider";
import { AuthError } from "@supabase/supabase-js";

interface HamburgerMenuProps {
  className?: string;
  profile?: Profile;
  onPromptClick?: (prompt: string) => void;
  onResetChat?: () => void;
  onLogout?: () => Promise<{ error: AuthError | null }>;
}

const UNDERLAY_VARIANTS: Variants = {
  open: {
    width: "calc(100% - 32px)",
    height: "calc(100dvh - 32px)",
    transition: { type: "spring", mass: 2, stiffness: 500, damping: 60 },
  },
  closed: {
    width: "64px",
    height: "64px",
    transition: {
      delay: 0.3,
      type: "spring",
      mass: 2,
      stiffness: 420,
      damping: 60,
    },
  },
};

const HAMBURGER_VARIANTS: Record<"top" | "middle" | "bottom", Variants> = {
  top: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      top: ["35%", "50%", "50%"],
      transition: { duration: 0.25, ease: "easeInOut" },
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      top: ["50%", "50%", "35%"],
      transition: { duration: 0.35, ease: "easeInOut" },
    },
  },
  middle: {
    open: {
      rotate: ["0deg", "0deg", "-45deg"],
      transition: { duration: 0.25, ease: "easeInOut" },
    },
    closed: {
      rotate: ["-45deg", "0deg", "0deg"],
      transition: { duration: 0.35, ease: "easeInOut" },
    },
  },
  bottom: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      bottom: ["35%", "50%", "50%"],
      transition: { duration: 0.25, ease: "easeInOut" },
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      bottom: ["50%", "50%", "35%"],
      transition: { duration: 0.35, ease: "easeInOut" },
    },
  },
};

export default function HamburgerMenu({
  className = "",
  profile,
  onPromptClick,
  onResetChat,
  onLogout,
}: HamburgerMenuProps) {
  const [active, setActive] = useState(false);
  const { showBackdrop, hideBackdrop } = useBackdrop();

  // Keep backdrop in-sync with menu state
  useEffect(() => {
    if (active) {
      showBackdrop();
    } else {
      hideBackdrop();
    }
  }, [active, showBackdrop, hideBackdrop]);

  // Close on ESC key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const menuPrompts = getMenuPrompts();

  const router = useRouter();
  const utilityItems: Array<{
    label: string;
    action: () => void;
    isDestructive?: boolean;
  }> = [
    {
      label: "Reset Chat",
      action: () => onResetChat?.(),
      isDestructive: true,
    },
  ];

  if (profile) {
    utilityItems.push({
      label: "Logout",
      action: () => onLogout?.(),
    });
    if (profile.is_admin) {
      utilityItems.push({
        label: "Admin",
        action: () => router.push("/admin"),
      });
    }
  } else {
    utilityItems.push({
      label: "Login",
      action: () => onPromptClick?.("Login me in"),
    });
  }

  return (
    <div className={`relative ${className}`}>
      {/* HAMBURGER BUTTON + UNDERLAY */}
      <HamburgerButton active={active} setActive={setActive} />

      {/* LINKS OVERLAY */}
      <AnimatePresence>
        {active && (
          <LinksOverlay
            key="links-overlay"
            menuPrompts={menuPrompts}
            utilityItems={utilityItems}
            onPromptClick={(prompt: string) => {
              onPromptClick?.(prompt);
              setActive(false);
            }}
            onUtilityAction={(fn: () => void) => {
              fn();
              setActive(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const HamburgerButton = ({
  active,
  setActive,
}: {
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <>
      <motion.div
        initial={false}
        animate={active ? "open" : "closed"}
        variants={UNDERLAY_VARIANTS}
        style={{ top: 16, right: 16 }}
        className="fixed z-10 rounded-xl bg-gradient-to-br bg-bot-message-bg border-2 border-foreground/10 shadow-lg"
      />

      <motion.button
        initial={false}
        animate={active ? "open" : "closed"}
        onClick={() => setActive((pv) => !pv)}
        aria-label="Toggle navigation menu"
        className={`group fixed right-4 top-4 z-50 h-16 w-16 transition-all ${
          active ? "rounded-bl-xl rounded-tr-xl" : "rounded-xl"
        }`}
      >
        <motion.span
          variants={HAMBURGER_VARIANTS.top}
          className="absolute block h-1 w-8 bg-white"
          style={{ y: "-50%", left: "50%", x: "-50%" }}
        />
        <motion.span
          variants={HAMBURGER_VARIANTS.middle}
          className="absolute block h-1 w-8 bg-white"
          style={{ left: "50%", x: "-50%", top: "50%", y: "-50%" }}
        />
        <motion.span
          variants={HAMBURGER_VARIANTS.bottom}
          className="absolute block h-1 w-8 bg-white"
          style={{ left: "50%", x: "-50%", y: "50%" }}
        />
      </motion.button>
    </>
  );
};

function LinksOverlay({
  menuPrompts,
  utilityItems,
  onPromptClick,
  onUtilityAction,
}: {
  menuPrompts: ReturnType<typeof getMenuPrompts>;
  utilityItems: Array<{
    label: string;
    action: () => void;
    isDestructive?: boolean;
  }>;
  onPromptClick: (prompt: string) => void;
  onUtilityAction: (fn: () => void) => void;
}) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeInOut" },
      }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.3 } }}
      className="fixed right-4 top-4 z-40 h-[calc(100dvh_-_64px)] w-[calc(100%_-_32px)] overflow-hidden"
    >
      <LinksContainer menuPrompts={menuPrompts} onPromptClick={onPromptClick} />
      <UtilityFooter
        utilityItems={utilityItems}
        onUtilityAction={onUtilityAction}
      />
    </motion.nav>
  );
}

function LinksContainer({
  menuPrompts,
  onPromptClick,
}: {
  menuPrompts: ReturnType<typeof getMenuPrompts>;
  onPromptClick: (prompt: string) => void;
}) {
  return (
    <motion.div className="space-y-6 p-12 pl-4 md:pl-20">
      {menuPrompts.map((item, idx) => (
        <NavLink
          key={item.label}
          href={"#"}
          idx={idx}
          onClick={() => onPromptClick(item.prompt)}
        >
          {item.label}
        </NavLink>
      ))}
    </motion.div>
  );
}

function NavLink({
  children,
  href,
  idx,
  onClick,
}: {
  children: ReactNode;
  href: string;
  idx: number;
  onClick: () => void;
}) {
  return (
    <motion.a
      initial={{ opacity: 0, y: -8 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.25 + idx * 0.125,
          duration: 0.5,
          ease: "easeInOut",
        },
      }}
      exit={{ opacity: 0, y: -8 }}
      href={href}
      onClick={onClick}
      className="block text-5xl font-semibold hover:text-foreground/60 transition-colors md:text-7xl"
    >
      {children}.
    </motion.a>
  );
}

function UtilityFooter({
  utilityItems,
  onUtilityAction,
}: {
  utilityItems: Array<{
    label: string;
    action: () => void;
    isDestructive?: boolean;
  }>;
  onUtilityAction: (fn: () => void) => void;
}) {
  return (
    <div className="absolute bottom-6 right-6 md:right-12 flex flex-row gap-4 items-end justify-end">
      {utilityItems.map((item, idx) => (
        <motion.button
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 0.5 + idx * 0.125,
              duration: 0.5,
              ease: "easeInOut",
            },
          }}
          exit={{ opacity: 0, y: 8 }}
          onClick={() => onUtilityAction(item.action)}
          className={`hover:cursor-pointer rounded-md px-4 py-2 md:px-8 md:py-4 text-lg flex-shrink-0 ${
            ppMori.regular
          } ${
            item.isDestructive
              ? "bg-red-600 text-white hover:bg-red-700/60"
              : "bg-background text-foreground hover:bg-background/60"
          }`}
        >
          {item.label}
        </motion.button>
      ))}
    </div>
  );
}
