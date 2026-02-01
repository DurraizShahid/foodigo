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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async (authUser: { id: string; email?: string | null; user_metadata?: any }) => {
      const { data } = await supabase.from("profiles").select("*").eq("id", authUser.id).single();
      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          name: data.name ?? authUser.user_metadata?.name,
          avatar: data.avatar_url ?? authUser.user_metadata?.avatar_url,
          role: data.role ?? "customer",
        });
        return;
      }

      setUser({
        id: authUser.id,
        email: authUser.email || "",
        name: authUser.user_metadata?.name,
        avatar: authUser.user_metadata?.avatar_url,
        role: authUser.user_metadata?.role || "customer",
      });
    };

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user);
      } else {
        setUser(null);
      }
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
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        name: name || email.split("@")[0],
        role: "customer",
        avatar_url: data.user.user_metadata?.avatar_url ?? null,
      });
      setUser({
        id: data.user.id,
        email: data.user.email || "",
        name: name || email.split("@")[0],
        role: "customer",
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (data.user) {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
      setUser({
        id: data.user.id,
        email: data.user.email || "",
        name: profile?.name ?? data.user.user_metadata?.name,
        avatar: profile?.avatar_url ?? data.user.user_metadata?.avatar_url,
        role: profile?.role ?? data.user.user_metadata?.role || "customer",
      });
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

    const { error } = await supabase.auth.updateUser({
      data: {
        name: updates.name,
        avatar: updates.avatar,
        role: updates.role,
      },
    });

    if (error) throw error;

    await supabase
      .from("profiles")
      .update({
        name: updates.name ?? null,
        avatar_url: updates.avatar ?? null,
        role: updates.role ?? null,
      })
      .eq("id", user.id);

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

