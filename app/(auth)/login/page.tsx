"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { UtensilsCrossed, Lock, Mail, ArrowRight, ShieldCheck, ChefHat, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      success("Logged In Successfully", `Welcome back!`);
      if (email.includes("admin")) {
        router.push("/admin");
      } else if (email.includes("seller") || email.includes("lakshmi") || email.includes("cook")) {
        router.push("/seller/dashboard");
      } else {
        router.push("/foods");
      }
    } else {
      setErrorMessage(res.error || "Invalid email or password");
      toastError("Login Failed", res.error || "Please check your credentials.");
    }
  };

  const handleQuickLogin = async (roleEmail: string, roleName: string) => {
    setEmail(roleEmail);
    setPassword("password123");
    setIsLoading(true);
    const res = await login(roleEmail, "password123");
    setIsLoading(false);
    if (res.success) {
      success(`Logged in as ${roleName}`);
      if (roleEmail.includes("admin")) router.push("/admin");
      else if (roleEmail.includes("seller")) router.push("/seller/dashboard");
      else router.push("/foods");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/50 to-white">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-card">
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-600/30 mb-4">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-950">
            Welcome Back to Home Plate
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Sign in to explore delicious fresh homemade food from home cooks
          </p>
        </div>

        {/* Quick Demo Login Fillers */}
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 text-center">
            One-Click Demo Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("customer@homeplate.app", "Customer")}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-100/50 transition text-[11px] font-semibold"
            >
              <User className="w-3.5 h-3.5 mb-1 text-emerald-600" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("seller@homeplate.app", "Home Cook")}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-100/50 transition text-[11px] font-semibold"
            >
              <ChefHat className="w-3.5 h-3.5 mb-1 text-emerald-600" />
              <span>Home Cook</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@homeplate.app", "Admin")}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-emerald-200 text-purple-900 hover:bg-purple-50 transition text-[11px] font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5 mb-1 text-purple-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {errorMessage}
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-emerald-700 hover:text-emerald-800 font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full py-3 mt-2"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-emerald-700 font-bold hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
