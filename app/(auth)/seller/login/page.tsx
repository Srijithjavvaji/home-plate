"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  ChefHat,
  Lock,
  Mail,
  ArrowRight,
  Phone,
  ShieldCheck,
  Clock,
  AlertCircle,
  HelpCircle,
  UtensilsCrossed,
} from "lucide-react";

export default function SellerLoginPage() {
  const router = useRouter();
  const { login, loginWithOtp, sendOtp } = useAuth();
  const { success, error: toastError } = useToast();

  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      success("Welcome Cook Partner!", "Signed in successfully.");
      router.push(res.redirectTo || "/seller/dashboard");
    } else {
      setErrorMessage(res.error || "Invalid seller email or password.");
      toastError("Login Failed", res.error || "Please check your seller credentials.");
    }
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);
    const res = await sendOtp(phone);
    setIsLoading(false);
    if (res.success) {
      setOtpSent(true);
      success("OTP Sent!", "Use demo code: 1234");
    } else {
      setErrorMessage(res.error || "Failed to send OTP.");
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const res = await loginWithOtp(phone, otp, "seller");
    setIsLoading(false);

    if (res.success) {
      success("Seller Verified!", "Signed in successfully.");
      router.push(res.redirectTo || "/seller/dashboard");
    } else {
      setErrorMessage(res.error || "Invalid OTP code.");
      toastError("Verification Failed", res.error || "Please check your OTP.");
    }
  };

  const quickSellerLogin = async (demoEmail: string, title: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setIsLoading(true);
    const res = await login(demoEmail, "password123");
    setIsLoading(false);
    if (res.success) {
      success(`Signed in as ${title}`);
      router.push(res.redirectTo || "/seller/dashboard");
    }
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fffdfa]">
      <div className="max-w-md w-full space-y-6 bg-white p-7 sm:p-9 rounded-3xl border border-orange-100 shadow-card">
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="w-13 h-13 rounded-2xl bg-orange-600 flex items-center justify-center text-white mx-auto shadow-md shadow-orange-600/30 mb-3 hover:scale-105 transition-transform">
              <ChefHat className="w-7 h-7" />
            </div>
          </Link>
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-100/70 w-fit mx-auto px-3 py-0.5 rounded-full mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
            <span>Home Cook & Seller Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#26140e] tracking-tight">
            Seller Login
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Access your kitchen orders, daily batch menu, and weekly earnings.
          </p>
        </div>

        {/* Status Redirection Explanatory Notice */}
        <div className="p-3.5 bg-orange-50/70 rounded-2xl border border-orange-200/80 text-[11px] text-stone-700 space-y-1">
          <p className="font-bold text-orange-900 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-orange-600" />
            <span>Automatic Status-Based Redirection:</span>
          </p>
          <p>• <strong>Approved Cook:</strong> Seller Kitchen Dashboard</p>
          <p>• <strong>Pending Verification:</strong> Application Status Tracker</p>
          <p>• <strong>FSSAI Pending:</strong> Document Verification Center</p>
          <p>• <strong>Needs Revision:</strong> Rejection Details & Resubmission</p>
        </div>

        {/* Auth Method Switcher: Password vs OTP */}
        <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMethod("password");
              setErrorMessage("");
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              authMethod === "password"
                ? "bg-white text-orange-700 shadow-sm"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Email & Password
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod("otp");
              setErrorMessage("");
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              authMethod === "otp"
                ? "bg-white text-orange-700 shadow-sm"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Mobile Number & OTP
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {errorMessage}
          </div>
        )}

        {/* Method 1: Email & Password */}
        {authMethod === "password" ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Registered Seller Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seller@homeplate.app"
              leftIcon={<Mail className="w-4 h-4 text-stone-400" />}
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline"
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
                leftIcon={<Lock className="w-4 h-4 text-stone-400" />}
              />
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md shadow-orange-600/20"
            >
              Access Kitchen Dashboard
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>
        ) : (
          /* Method 2: Mobile Number & OTP */
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <Input
                label="Registered Mobile Number"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876511001"
                leftIcon={<Phone className="w-4 h-4 text-stone-400" />}
                helperText="Enter 10-digit registered mobile number"
              />
              {!otpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading || !phone}
                  className="mt-2 w-full py-2 bg-stone-100 hover:bg-orange-50 text-orange-700 font-bold text-xs rounded-xl border border-orange-200 transition"
                >
                  Send Verification OTP
                </button>
              )}
            </div>

            {otpSent && (
              <div className="space-y-3 pt-1">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                  <span className="font-bold">Demo OTP:</span> Use <strong>1234</strong> to sign in.
                </div>
                <Input
                  label="Enter 4-Digit OTP"
                  type="text"
                  maxLength={4}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="1234"
                  className="text-center text-lg tracking-widest font-mono"
                />
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md"
                >
                  Verify & Continue
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            )}
          </form>
        )}

        {/* 1-Click Test Seller Accounts */}
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1.5">
          <p className="text-[11px] font-bold text-stone-600 text-center">Test Cook Verification Lifecycle:</p>
          <div className="grid grid-cols-1 gap-1">
            <button
              type="button"
              onClick={() => quickSellerLogin("seller@homeplate.app", "Approved Cook (Lakshmi Devi)")}
              className="w-full py-1.5 px-2.5 bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[11px] font-semibold transition flex items-center justify-between"
            >
              <span>1. Approved Seller (Direct Dashboard)</span>
              <span className="text-[10px] font-bold text-emerald-600">&rarr;</span>
            </button>
            <button
              type="button"
              onClick={() => quickSellerLogin("seller.pending@homeplate.app", "Pending Cook (Radhika Reddy)")}
              className="w-full py-1.5 px-2.5 bg-white hover:bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-[11px] font-semibold transition flex items-center justify-between"
            >
              <span>2. Pending FSSAI (Status Tracker)</span>
              <span className="text-[10px] font-bold text-amber-600">&rarr;</span>
            </button>
            <button
              type="button"
              onClick={() => quickSellerLogin("seller.rejected@homeplate.app", "Rejected Cook (Sujatha Rao)")}
              className="w-full py-1.5 px-2.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-[11px] font-semibold transition flex items-center justify-between"
            >
              <span>3. Rejected / Action Needed (Revision)</span>
              <span className="text-[10px] font-bold text-rose-600">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center pt-2 space-y-2 border-t border-stone-100">
          <p className="text-xs text-stone-600">
            Want to start selling homemade food?{" "}
            <Link href="/seller/register" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">
              Apply as a Home Cook &rarr;
            </Link>
          </p>
          <p className="text-xs text-stone-500">
            Are you a customer?{" "}
            <Link href="/customer/login" className="font-semibold text-stone-700 hover:text-orange-700 hover:underline">
              Go to Customer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
