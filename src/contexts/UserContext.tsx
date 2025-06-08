"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import { Database } from "@/database.types";

export type Profile = Database["public"]["Tables"]["user_profiles"]["Row"];

type UserContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  profileLoading: boolean;
  signOut: () => Promise<{ error: AuthError | null }>;
  refreshProfile: () => Promise<void>;
  updateSession: (session: Session, profile: Profile) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching profile:", error);
          return null;
        }

        return data;
      } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
    },
    [supabase]
  );

  const refreshProfile = async () => {
    if (user) {
      setProfileLoading(true);
      const profileData = await fetchProfile(user.id);
      if (profileData) {
        setProfile(profileData);
        setProfileLoading(false);
      } else {
        setProfile(null);
        setProfileLoading(false);
      }
    }
  };

  const updateSession = useCallback(
    (newSession: Session, newProfile: Profile) => {
      setSession(newSession);
      setUser(newSession.user);
      setProfile(newProfile);

      supabase.auth.setSession(newSession);
    },
    [supabase]
  );

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setProfileLoading(false);
    return { error };
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        "Auth state change:",
        event,
        session ? "session exists" : "no session"
      );

      setSession(session);
      setUser(session?.user ?? null);

      // auth event handled; unblock initial loading regardless of profile
      setLoading(false);
    });

    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setSession(session);
        setUser(session.user);
      }

      // Ensure the loading state is cleared once the initial session check completes (whether or not a session exists)
      setLoading(false);
    })();

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // Fetch profile whenever a valid user object is present or changes
  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      if (user) {
        console.log(`Fetching profile for user ${user.id}`);
        setProfileLoading(true);
        const profileData = await fetchProfile(user.id);
        if (isMounted) {
          setProfile(profileData);
          setProfileLoading(false);
        }
      } else {
        setProfile(null);
        setProfileLoading(false);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [user, fetchProfile]);

  return (
    <UserContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        profileLoading,
        signOut,
        refreshProfile,
        updateSession,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
