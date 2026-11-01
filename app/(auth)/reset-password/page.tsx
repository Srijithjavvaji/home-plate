"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  UtensilsCrossed,
  Lock,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const [code, setCode] = useState("1234");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (code !== "1234" && code !== "4321") {
      toastError("Invalid Code", "Please enter valid verification code 1234.");
      return;
    }

    if (newPassword.length < 6) {
      toastError("Password Short", "Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toastError("Password Mismatch", "Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      success("Password Reset!", "Your account password has been updated.");
    }, 700);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fffdfa]">
      <div className="max-w-md w-full space-y-6 bg-white p-7 sm:p-9 rounded-3xl border border-orange-100 shadow-card">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="w-13 h-13 rounded-2xl bg-orange-600 flex items-center justify-center text-white mx-auto shadow-md shadow-orange-600/30 mb-3 hover:scale-105 transition-transform">
              <KeyRound className="w-7 h-7" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#26140e] tracking-tight">
            Create New Password
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Choose a strong new password for your Home Plate account
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-stone-900">
                Password Successfully Reset
              </h2>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                You can now sign in with your updated credentials.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition shadow-md"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <span className="font-bold">Demo Verification Code:</span> Use <strong>1234</strong>
            </div>

            <Input
              label="Verification Code / OTP"
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="1234"
              className="font-mono tracking-widest text-center"
            />

            <Input
              label="New Password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4 text-stone-400" />}
              helperText="Minimum 6 characters with mixed letters and numbers"
            />

            <Input
              label="Confirm New Password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4 text-stone-400" />}
            />

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md shadow-orange-600/20"
            >
              Update Password
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
