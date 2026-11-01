"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  UtensilsCrossed,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { sendOtp } = useAuth();
  const { success, error: toastError } = useToast();

  const [method, setMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (method === "phone") {
      await sendOtp(phone);
      setIsLoading(false);
      setIsSubmitted(true);
      success("OTP Sent!", "Use demo code 1234 to reset password.");
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
        success("Reset Link Sent!", "Instructions sent to your email.");
      }, 700);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fffdfa]">
      <div className="max-w-md w-full space-y-6 bg-white p-7 sm:p-9 rounded-3xl border border-orange-100 shadow-card">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="w-13 h-13 rounded-2xl bg-orange-600 flex items-center justify-center text-white mx-auto shadow-md shadow-orange-600/30 mb-3 hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#26140e] tracking-tight">
            Reset Your Password
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Choose your preferred recovery method to restore access to Home Plate
          </p>
        </div>

        {/* Method Switcher */}
        <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMethod("email");
              setIsSubmitted(false);
            }}
            className={`flex-1 py-2 rounded-lg transition ${
              method === "email" ? "bg-white text-orange-700 shadow-sm" : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Email Recovery Link
          </button>
          <button
            type="button"
            onClick={() => {
              setMethod("phone");
              setIsSubmitted(false);
            }}
            className={`flex-1 py-2 rounded-lg transition ${
              method === "phone" ? "bg-white text-orange-700 shadow-sm" : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Mobile SMS OTP
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-stone-900">
                {method === "email" ? "Reset Link Dispatched" : "SMS Code Dispatched"}
              </h2>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                {method === "email"
                  ? `We sent password reset instructions to ${email}. Follow the email link to proceed.`
                  : `We sent a 4-digit verification code to ${phone}. (Demo code: 1234)`}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/reset-password"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition shadow-md"
              >
                <span>Enter Reset Code & Choose New Password</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {method === "email" ? (
              <Input
                label="Account Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                leftIcon={<Mail className="w-4 h-4 text-stone-400" />}
              />
            ) : (
              <Input
                label="Registered Mobile Number"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                leftIcon={<Phone className="w-4 h-4 text-stone-400" />}
                helperText="We will send a 4-digit code to this number"
              />
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md shadow-orange-600/20"
            >
              Send Password Reset Code
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 font-semibold transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
