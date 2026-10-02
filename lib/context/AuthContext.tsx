"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Profile, UserRole } from "../supabase/types";
import { createClient, isSupabaseConfigured } from "../supabase/client";

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    password?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const DEFAULT_USERS: Record<UserRole, Profile> = {
  customer: {
    id: "u0000000-0000-0000-0000-000000000001",
    email: "customer@homeplate.app",
    full_name: "Rahul Sharma",
    phone: "+91 98765 22001",
    role: "customer",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
  },
  seller: {
    id: "s0000000-0000-0000-0000-000000000001",
    email: "lakshmi@ammamma.com",
    full_name: "Lakshmi Devi",
    phone: "+91 98765 11001",
    role: "seller",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
  },
  admin: {
    id: "a0000000-0000-0000-0000-000000000001",
    email: "admin@homeplate.app",
    full_name: "Home Plate Admin",
    phone: "+91 98765 00001",
    role: "admin",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage or Supabase session
    const initAuth = async () => {
      try {
        if (isSupabaseConfigured) {
          const supabase = createClient();
          if (supabase) {
            const { data } = await supabase.auth.getSession();
            if (data.session?.user) {
              const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", data.session.user.id)
                .single();

              if (profile) {
                setUser(profile as Profile);
                setIsLoading(false);
                return;
              }
            }
          }
        }

        // Local storage demo fallback
        const savedUser = localStorage.getItem("homeplate_user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          // Default to customer demo user
          setUser(DEFAULT_USERS.customer);
        }
      } catch (err) {
        console.error("Auth init error:", err);
        setUser(DEFAULT_USERS.customer);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        const supabase = createClient();
        if (supabase && password) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) {
            setIsLoading(false);
            return { success: false, error: error.message };
          }
          if (data.user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", data.user.id)
              .single();
            if (profile) {
              setUser(profile as Profile);
              localStorage.setItem("homeplate_user", JSON.stringify(profile));
              setIsLoading(false);
              return { success: true };
            }
          }
        }
      }

      // Demo login
      let matchedUser: Profile = DEFAULT_USERS.customer;
      if (email.includes("admin")) {
        matchedUser = DEFAULT_USERS.admin;
      } else if (email.includes("seller") || email.includes("lakshmi") || email.includes("cook")) {
        matchedUser = DEFAULT_USERS.seller;
      } else {
        matchedUser = {
          ...DEFAULT_USERS.customer,
          email,
          full_name: email.split("@")[0].replace(/[._]/g, " "),
        };
      }

      setUser(matchedUser);
      localStorage.setItem("homeplate_user", JSON.stringify(matchedUser));
      setIsLoading(false);
      return { success: true };
    } catch {
      setIsLoading(false);
      return { success: false, error: "An unexpected error occurred during login." };
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    password?: string;
  }) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        const supabase = createClient();
        if (supabase && data.password) {
          const { data: authData, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              data: {
                full_name: data.fullName,
                phone: data.phone,
                role: data.role,
              },
            },
          });
          if (error) {
            setIsLoading(false);
            return { success: false, error: error.message };
          }
          if (authData.user) {
            const newProfile: Profile = {
              id: authData.user.id,
              email: data.email,
              full_name: data.fullName,
              phone: data.phone,
              role: data.role,
            };
            setUser(newProfile);
            localStorage.setItem("homeplate_user", JSON.stringify(newProfile));
            setIsLoading(false);
            return { success: true };
          }
        }
      }

      // Demo registration
      const newProfile: Profile = {
        id: `usr_${Date.now()}`,
        email: data.email,
        full_name: data.fullName,
        phone: data.phone,
        role: data.role,
      };

      setUser(newProfile);
      localStorage.setItem("homeplate_user", JSON.stringify(newProfile));
      setIsLoading(false);
      return { success: true };
    } catch {
      setIsLoading(false);
      return { success: false, error: "Registration failed. Please try again." };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    }
    setUser(null);
    localStorage.removeItem("homeplate_user");
  };

  const switchRole = (role: UserRole) => {
    const targetUser = DEFAULT_USERS[role];
    setUser(targetUser);
    localStorage.setItem("homeplate_user", JSON.stringify(targetUser));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, switchRole }}>
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
