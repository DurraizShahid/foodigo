"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: "customer" | "restaurant" | "driver" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  supabase: SupabaseClient;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthSession = Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"];
type AuthSessionUser = NonNullable<AuthSession>["user"];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (sessionUser: AuthSessionUser) => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, role")
      .eq("id", sessionUser.id)
      .maybeSingle();

    if (error) throw error;

    if (!profile) {
      const fallbackName = sessionUser.user_metadata?.name || sessionUser.email?.split("@")[0] || "User";
      const { error: insertError } = await supabase.from("profiles").insert({
        id: sessionUser.id,
        full_name: fallbackName,
        avatar_url: sessionUser.user_metadata?.avatar_url,
        role: sessionUser.user_metadata?.role || "customer",
      });
      if (insertError) throw insertError;
      return {
        id: sessionUser.id,
        email: sessionUser.email || "",
        name: fallbackName,
        avatar: sessionUser.user_metadata?.avatar_url,
        role: sessionUser.user_metadata?.role || "customer",
      } as User;
    }

    return {
      id: sessionUser.id,
      email: sessionUser.email || "",
      name: profile.full_name || sessionUser.user_metadata?.name,
      avatar: profile.avatar_url || sessionUser.user_metadata?.avatar_url,
      role: (profile.role as User["role"]) || "customer",
    } as User;
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user)
          .then(setUser)
          .catch(() => setUser(null));
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user)
          .then(setUser)
          .catch(() => setUser(null))
          .finally(() => setLoading(false));
        return;
      }
      setUser(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split("@")[0],
          role: "customer",
        },
      },
    });

    if (error) throw error;
    if (data.user) {
      const profileUser = await loadProfile(data.user);
      setUser(profileUser);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (data.user) {
      const profileUser = await loadProfile(data.user);
      setUser(profileUser);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: updates.name,
        avatar_url: updates.avatar,
        role: updates.role,
      })
      .eq("id", user.id);

    if (error) throw error;

    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        updateProfile,
        supabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

