"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertTriangle,
  KeyRound,
  Fingerprint,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityPin, setSecurityPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      success("Admin Authenticated", "Session established with elevated security privileges.");
      router.push("/admin");
    } else {
      setErrorMessage(res.error || "Invalid administrator credentials.");
      toastError("Access Denied", res.error || "Please verify credentials.");
    }
  };

  const handleQuickAdminLogin = async () => {
    setEmail("admin@homeplate.app");
    setPassword("password123");
    setIsLoading(true);
    const res = await login("admin@homeplate.app", "password123");
    setIsLoading(false);
    if (res.success) {
      success("Logged in as System Administrator");
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100">
      <div className="max-w-md w-full space-y-6 bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-orange-500/30 mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="inline-block px-3 py-0.5 rounded-full bg-orange-950/80 text-orange-400 border border-orange-800/80 text-[10px] font-bold uppercase tracking-widest mb-1.5">
            Internal Operations Portal
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Administrator Sign In
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Restricted access for Home Plate Hyderabad platform managers and food safety auditors.
          </p>
        </div>

        {/* Security Warning */}
        <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl flex items-start gap-2.5 text-xs text-slate-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            All administrative sessions are cryptographic, IP-logged, and subject to audit logs. Public admin registration is disabled.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@homeplate.app"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Admin Security Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Security Token / 2FA PIN (Optional for Demo)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={securityPin}
                onChange={(e) => setSecurityPin(e.target.value)}
                placeholder="Default: 9999"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-mono"
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-600/30"
          >
            Authenticate Session
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        {/* Fast Admin Tester */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
          <p className="text-[11px] font-bold text-slate-400 mb-1.5 text-center">Fast Development Demo Access:</p>
          <button
            type="button"
            onClick={handleQuickAdminLogin}
            className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-orange-400" />
              <span>Sign in as Platform Administrator</span>
            </span>
            <span className="text-[10px] text-orange-400 font-bold">Launch &rarr;</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-slate-200 transition font-medium"
          >
            &larr; Return to Home Plate Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
