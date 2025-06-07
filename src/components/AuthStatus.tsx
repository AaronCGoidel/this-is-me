"use client";

import { useUser } from "@/contexts/UserContext";

export function AuthStatus() {
  const { user, profile, loading, signOut } = useUser();

  if (loading) {
    return (
      <div className="text-sm text-gray-500">
        Loading authentication status...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-sm text-gray-500">
        Not authenticated. Use the chat to login with your phone number.
      </div>
    );
  }

  return (
    <div className="text-sm space-y-2">
      <div className="text-green-600">
        ✅ Authenticated as{" "}
        {profile
          ? `${profile.first_name} ${profile.last_name}`.trim()
          : user.phone || user.email}
      </div>
      <button
        onClick={signOut}
        className="text-xs text-gray-500 hover:text-gray-700 underline"
      >
        Sign out
      </button>
    </div>
  );
}
