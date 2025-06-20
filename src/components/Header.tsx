import { type Profile } from "@/contexts/UserContext";
import HamburgerMenu from "./HamburgerMenu";
import { useState } from "react";
import { useEffect } from "react";
import { AuthError } from "@supabase/supabase-js";

export default function Header({
  handlePromptClick,
  handleResetChat,
  profile,
  signOut,
}: {
  handlePromptClick: (prompt: string) => void;
  handleResetChat: () => void;
  profile: Profile | null;
  signOut: () => Promise<{ error: AuthError | null }>;
}) {
  const [displayName, setDisplayName] = useState<string | null>();

  useEffect(() => {
    if (profile) {
      setDisplayName(`${profile.first_name} ${profile.last_name}`.trim());
    } else {
      setDisplayName(null);
    }
  }, [profile]);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-end items-center h-20 px-4 pr-20 md:pr-24">
        {displayName && (
          <p className="text-sm text-gray-400 mr-4 relative top-2">
            Hi, {displayName}
          </p>
        )}
        <HamburgerMenu
          profile={profile || undefined}
          onPromptClick={handlePromptClick}
          onResetChat={handleResetChat}
          onLogout={signOut}
          className="relative top-0 right-0"
        />
      </div>
    </header>
  );
}
