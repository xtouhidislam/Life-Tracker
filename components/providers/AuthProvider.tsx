"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";
import { useRouter } from "next/navigation";
import { getLocalUserProfile, getLocalUserStats } from "@/lib/storage/local-store";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type UserStats = Database["public"]["Tables"]["user_stats"]["Row"];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  stats: UserStats | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  stats: null,
  loading: true,
  refreshProfile: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const supabase = createClient();

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const [profileRes, statsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase.from("user_stats").select("*").eq("user_id", userId).maybeSingle(),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
      }
      if (statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error("Error fetching user profile or stats:", err);
    }
  }, [supabase]);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!mounted) return;

        if (currentUser) {
          setUser(currentUser);
          await fetchUserData(currentUser.id);
        } else {
          setUser(null);
          setProfile(getLocalUserProfile() as any);
          setStats(getLocalUserStats() as any);
        }
      } catch (err) {
        console.error("Init auth error:", err);
        setUser(null);
        setProfile(getLocalUserProfile() as any);
        setStats(getLocalUserStats() as any);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchUserData(session.user.id);
      } else {
        setUser(null);
        setProfile(getLocalUserProfile() as any);
        setStats(getLocalUserStats() as any);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchUserData]);

  const refreshProfile = async () => {
    if (user) {
      await fetchUserData(user.id);
    } else {
      setProfile(getLocalUserProfile() as any);
      setStats(getLocalUserStats() as any);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setStats(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        stats,
        loading,
        refreshProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
