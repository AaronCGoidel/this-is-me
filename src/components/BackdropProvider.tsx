"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface BackdropContextType {
  isBackdropVisible: boolean;
  showBackdrop: () => void;
  hideBackdrop: () => void;
}

const BackdropContext = createContext<BackdropContextType | undefined>(
  undefined
);

export function useBackdrop() {
  const context = useContext(BackdropContext);
  if (context === undefined) {
    throw new Error("useBackdrop must be used within a BackdropProvider");
  }
  return context;
}

interface BackdropProviderProps {
  children: ReactNode;
}

export function BackdropProvider({ children }: BackdropProviderProps) {
  const [isBackdropVisible, setIsBackdropVisible] = useState(false);

  const showBackdrop = () => setIsBackdropVisible(true);
  const hideBackdrop = () => setIsBackdropVisible(false);

  return (
    <BackdropContext.Provider
      value={{
        isBackdropVisible,
        showBackdrop,
        hideBackdrop,
      }}
    >
      <div className="relative">
        {children}
        {/* Global Backdrop */}
        {isBackdropVisible && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={hideBackdrop}
            aria-hidden="true"
          />
        )}
      </div>
    </BackdropContext.Provider>
  );
}
