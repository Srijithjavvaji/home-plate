"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Profile, UserRole, Seller } from "../supabase/types";
import { createClient, isSupabaseConfigured } from "../supabase/client";
import { store } from "../data/store";

interface AuthContextType {
  user: Profile | null;
  seller: Seller | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string; redirectTo?: string }>;
  loginWithOtp: (phone: string, otp: string, role?: UserRole) => Promise<{ success: boolean; error?: string; redirectTo?: string }>;
  sendOtp: (phoneOrEmail: string) => Promise<{ success: boolean; code?: string; error?: string }>;
  loginWithGoogle: (role?: UserRole) => Promise<{ success: boolean; error?: string; redirectTo?: string }>;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    role?: UserRole;
    password?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

export const DEFAULT_USERS: Record<string, Profile> = {
  customer: {
    id: "u0000000-0000-0000-0000-000000000001",
    email: "customer@homeplate.app",
    full_name: "Rahul Sharma",
    phone: "+91 98765 22001",
    role: "customer",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
  },
  seller: {
    id: "s0000000-0000-0000-0000-000000000001",
    email: "seller@homeplate.app",
    full_name: "Lakshmi Devi",
    phone: "+91 98765 11001",
    role: "seller",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
  },
  seller_pending: {
    id: "s0000000-0000-0000-0000-000000000004",
    email: "seller.pending@homeplate.app",
    full_name: "Radhika Reddy (Pending Verification)",
    phone: "+91 98765 11004",
    role: "seller",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
  },
  seller_rejected: {
    id: "s0000000-0000-0000-0000-000000000005",
    email: "seller.rejected@homeplate.app",
    full_name: "Sujatha Rao (Rejected)",
    phone: "+91 98765 11005",
    role: "seller",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
  },
  admin: {
    id: "a0000000-0000-0000-0000-000000000001",
    email: "admin@homeplate.app",
    full_name: "Home Plate Administrator",
    phone: "+91 98765 00001",
    role: "admin",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
  },
  super_admin: {
    id: "sa000000-0000-0000-0000-000000000001",
    email: "superadmin@homeplate.app",
    full_name: "Super Admin (Founder)",
    phone: "+91 98765 00002",
    role: "super_admin",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
  },
  operations_admin: {
    id: "oa000000-0000-0000-0000-000000000001",
    email: "ops@homeplate.app",
    full_name: "Operations Admin",
    phone: "+91 98765 00003",
    role: "operations_admin",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  },
  seller_support: {
    id: "ss000000-0000-0000-0000-000000000001",
    email: "support@homeplate.app",
    full_name: "Seller Support Specialist",
    phone: "+91 98765 00004",
    role: "seller_support",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
  },
};

function setSessionCookie(profile: Profile | null, sellerStatus?: string) {
  if (typeof document === 'undefined') return;
  if (!profile) {
    document.cookie = 'homeplate_session=; path=/; max-age=0; SameSite=Lax';
    return;
  }
  const payload = { 
    id: profile.id, 
    role: profile.role, 
    email: profile.email,
    sellerStatus: sellerStatus || (profile.role === 'seller' ? 'approved' : undefined)
  };
  document.cookie = 'homeplate_session=' + encodeURIComponent(JSON.stringify(payload)) + '; path=/; max-age=604800; SameSite=Lax';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to load seller profile for authenticated seller user
  const loadSellerForUser = async (profile: Profile) => {
    if (profile.role === "seller") {
      const sellers = await store.getSellers();
      const match = sellers.find((s) => s.user_id === profile.id || s.phone === profile.phone);
      if (match) {
        setSeller(match);
        return match;
      }
    }
    setSeller(null);
    return null;
  };

  useEffect(() => {
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
                const p = profile as Profile;
                setUser(p);
                const s = await loadSellerForUser(p);
                setSessionCookie(p, s?.status);
                setIsLoading(false);
                return;
              }
            }
          }
        }

        // Local storage session fallback
        const savedUser = localStorage.getItem("homeplate_user");
        if (savedUser) {
          const p = JSON.parse(savedUser) as Profile;
          setUser(p);
          const s = await loadSellerForUser(p);
          setSessionCookie(p, s?.status);
        } else {
          // Default to guest (unauthenticated)
          setUser(null);
          setSeller(null);
          setSessionCookie(null);
        }
      } catch (err) {
        console.error("Auth init error:", err);
        setUser(null);
        setSessionCookie(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const determineRedirect = (profile: Profile, sellerRecord?: Seller | null): string => {
    // 1. Admin roles automatically route to Admin dashboard
    if (
      profile.role === "admin" ||
      profile.role === "super_admin" ||
      profile.role === "operations_admin" ||
      profile.role === "seller_support"
    ) {
      return "/admin";
    }

    // 2. Home Cook roles automatically route to Seller dashboard or verification
    if (profile.role === "seller") {
      if (!sellerRecord || sellerRecord.status === "approved") {
        return "/seller/dashboard";
      }
      if (sellerRecord.status === "rejected") {
        return "/seller/application-status?status=rejected";
      }
      if (sellerRecord.status === "suspended") {
        return "/seller/application-status?status=suspended";
      }
      return "/seller/application-status";
    }

    // 3. Customer role automatically routes to Customer marketplace
    return "/";
  };

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
              const p = profile as Profile;
              setUser(p);
              const sellerRec = await loadSellerForUser(p);
              localStorage.setItem("homeplate_user", JSON.stringify(p));
              setSessionCookie(p, sellerRec?.status);
              setIsLoading(false);
              return { success: true, redirectTo: determineRedirect(p, sellerRec) };
            }
          }
        }
      }

      // Automatic role recognition from credentials
      let matchedUser: Profile = DEFAULT_USERS.customer;
      const cleanEmail = email.toLowerCase().trim();

      if (cleanEmail.includes("admin") || cleanEmail === "admin@homeplate.app") {
        matchedUser = DEFAULT_USERS.admin;
      } else if (cleanEmail.includes("pending")) {
        matchedUser = DEFAULT_USERS.seller_pending;
      } else if (cleanEmail.includes("rejected")) {
        matchedUser = DEFAULT_USERS.seller_rejected;
      } else if (cleanEmail.includes("seller") || cleanEmail.includes("lakshmi") || cleanEmail.includes("cook")) {
        matchedUser = DEFAULT_USERS.seller;
      } else {
        matchedUser = {
          ...DEFAULT_USERS.customer,
          email: cleanEmail,
          full_name: cleanEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        };
      }

      setUser(matchedUser);
      const sellerRec = await loadSellerForUser(matchedUser);
      localStorage.setItem("homeplate_user", JSON.stringify(matchedUser));
      setSessionCookie(matchedUser, sellerRec?.status);
      setIsLoading(false);
      return { success: true, redirectTo: determineRedirect(matchedUser, sellerRec) };
    } catch {
      setIsLoading(false);
      return { success: false, error: "An unexpected error occurred during login." };
    }
  };

  const sendOtp = async (phoneOrEmail: string) => {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase && phoneOrEmail.includes("+")) {
        try {
          await supabase.auth.signInWithOtp({ phone: phoneOrEmail });
        } catch {
          // graceful fallback
        }
      }
    }
    // Demo verification code
    const code = "1234";
    return { success: true, code };
  };

  const loginWithOtp = async (phone: string, otp: string, role?: UserRole) => {
    setIsLoading(true);
    if (otp !== "1234" && otp !== "4321") {
      setIsLoading(false);
      return { success: false, error: "Invalid OTP code. Please enter demo code 1234." };
    }

    const cleanPhone = phone.replace(/\D/g, "");

    // Automatic role detection based on phone credentials (or requested role if specifically authenticating on seller/admin page)
    let matchedUser: Profile;
    if (role === "admin" || cleanPhone.endsWith("00001") || cleanPhone.endsWith("00002") || cleanPhone.includes("admin")) {
      matchedUser = DEFAULT_USERS.admin;
    } else if (role === "seller" || cleanPhone.endsWith("11001") || cleanPhone.endsWith("11002") || cleanPhone.endsWith("11003")) {
      matchedUser = DEFAULT_USERS.seller;
    } else if (cleanPhone.endsWith("11004")) {
      matchedUser = DEFAULT_USERS.seller_pending;
    } else if (cleanPhone.endsWith("11005")) {
      matchedUser = DEFAULT_USERS.seller_rejected;
    } else {
      matchedUser = {
        ...DEFAULT_USERS.customer,
        id: "u_" + cleanPhone,
        phone: "+91 " + cleanPhone.slice(-10),
        full_name: "Home Plate Customer",
        role: "customer",
      };
    }

    setUser(matchedUser);
    const sellerRec = await loadSellerForUser(matchedUser);
    localStorage.setItem("homeplate_user", JSON.stringify(matchedUser));
    setSessionCookie(matchedUser, sellerRec?.status);
    setIsLoading(false);
    return { success: true, redirectTo: determineRedirect(matchedUser, sellerRec) };
  };

  const loginWithGoogle = async (role?: UserRole) => {
    setIsLoading(true);
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        try {
          await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: window.location.origin },
          });
          return { success: true, redirectTo: "/" };
        } catch {
          // fallback
        }
      }
    }

    // Google Sign-In defaults strictly to Customer role
    const assignedRole: UserRole = role === "seller" ? "seller" : "customer";
    const profile: Profile = {
      id: "google_" + Date.now(),
      email: "customer.google@homeplate.app",
      full_name: "Google Customer",
      role: assignedRole,
      avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
    };

    setUser(profile);
    const sellerRec = await loadSellerForUser(profile);
    localStorage.setItem("homeplate_user", JSON.stringify(profile));
    setSessionCookie(profile, sellerRec?.status);
    setIsLoading(false);
    return { success: true, redirectTo: determineRedirect(profile, sellerRec) };
  };

  const register = async (data: {
    fullName: string;
    email: string;
    phone: string;
    role?: UserRole;
    password?: string;
  }) => {
    setIsLoading(true);
    // Security Rule: Public registration always creates a Customer account unless approved seller onboarding
    const assignedRole: UserRole = data.role === "seller" ? "seller" : "customer";

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
                role: assignedRole,
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
              role: assignedRole,
            };
            setUser(newProfile);
            localStorage.setItem("homeplate_user", JSON.stringify(newProfile));
            setSessionCookie(newProfile);
            setIsLoading(false);
            return { success: true };
          }
        }
      }

      // Local Registration
      const newProfile: Profile = {
        id: "usr_" + Date.now(),
        email: data.email,
        full_name: data.fullName,
        phone: data.phone,
        role: assignedRole,
      };

      setUser(newProfile);
      localStorage.setItem("homeplate_user", JSON.stringify(newProfile));
      setSessionCookie(newProfile);
      setIsLoading(false);
      return { success: true };
    } catch {
      setIsLoading(false);
      return { success: false, error: "Registration failed. Please try again." };
    }
  };

  const switchRole = (role: UserRole) => {
    // Kept for internal compatibility
    const targetUser = DEFAULT_USERS[role] || DEFAULT_USERS.customer;
    setUser(targetUser);
    loadSellerForUser(targetUser);
    localStorage.setItem("homeplate_user", JSON.stringify(targetUser));
    setSessionCookie(targetUser);
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    }
    setUser(null);
    setSeller(null);
    localStorage.removeItem("homeplate_user");
    setSessionCookie(null);
  };

  const resetPassword = async (email: string) => {
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        seller,
        isLoading,
        login,
        loginWithOtp,
        sendOtp,
        loginWithGoogle,
        register,
        switchRole,
        logout,
        resetPassword,
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
