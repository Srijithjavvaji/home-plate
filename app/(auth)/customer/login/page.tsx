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
  Lock,
  Mail,
  ArrowRight,
  Phone,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function CustomerLoginPage() {
  const router = useRouter();
  const { login, loginWithOtp, sendOtp, loginWithGoogle } = useAuth();
  const { success, error: toastError } = useToast();

  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      success("Welcome to Home Plate!", "Signed in successfully.");
      router.push("/");
    } else {
      setErrorMessage(res.error || "Invalid email or password.");
      toastError("Login Failed", res.error || "Please check your credentials.");
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
      setOtpCooldown(30);
      success("OTP Sent!", "Use demo code: 1234");
    } else {
      setErrorMessage(res.error || "Failed to send OTP.");
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const res = await loginWithOtp(phone, otp, "customer");
    setIsLoading(false);

    if (res.success) {
      success("Phone Verified!", "Signed in successfully.");
      router.push("/");
    } else {
      setErrorMessage(res.error || "Invalid OTP code.");
      toastError("Verification Failed", res.error || "Please check your OTP.");
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const res = await loginWithGoogle("customer");
    setIsLoading(false);
    if (res.success) {
      success("Google Sign-In Successful!");
      router.push("/");
    }
  };

  const fillCustomerDemo = async () => {
    setEmail("customer@homeplate.app");
    setPassword("password123");
    setIsLoading(true);
    const res = await login("customer@homeplate.app", "password123");
    setIsLoading(false);
    if (res.success) {
      success("Signed in as Customer (Rahul Sharma)");
      router.push("/");
    }
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fffdfa]">
      <div className="max-w-md w-full space-y-6 bg-white p-7 sm:p-9 rounded-3xl border border-orange-100 shadow-card">
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="w-13 h-13 rounded-2xl bg-orange-600 flex items-center justify-center text-white mx-auto shadow-md shadow-orange-600/30 mb-3 hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
          </Link>
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-100/70 w-fit mx-auto px-3 py-0.5 rounded-full mb-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-orange-600" />
            <span>Customer Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#26140e] tracking-tight">
            Customer Sign In
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Order authentic homemade pickles, podis, sweets & snacks across Hyderabad.
          </p>
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
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
              Sign In to Order
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>
        ) : (
          /* Method 2: Mobile Number & OTP */
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <Input
                label="Mobile Number"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                leftIcon={<Phone className="w-4 h-4 text-stone-400" />}
                helperText="Enter 10-digit Indian mobile number"
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
                  Verify & Sign In
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-xs text-stone-500 hover:text-orange-700 underline font-medium"
                  >
                    Resend OTP Code
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* Google Authentication */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-stone-500 font-medium">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* 1-Click Fast Customer Demo */}
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
          <p className="text-[11px] font-bold text-stone-600 mb-1.5 text-center">Fast Demo Testing:</p>
          <button
            type="button"
            onClick={fillCustomerDemo}
            className="w-full py-1.5 px-3 bg-white hover:bg-orange-50 border border-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition flex items-center justify-between"
          >
            <span>Customer (Rahul Sharma)</span>
            <span className="text-[10px] text-orange-600 font-bold">1-Click Sign In &rarr;</span>
          </button>
        </div>

        {/* Footer Links */}
        <div className="text-center pt-2 space-y-2 border-t border-stone-100">
          <p className="text-xs text-stone-600">
            Don&apos;t have a customer account?{" "}
            <Link href="/register" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">
              Sign up here
            </Link>
          </p>
          <p className="text-xs text-stone-500">
            Are you a home cook?{" "}
            <Link href="/seller/login" className="font-semibold text-stone-700 hover:text-orange-700 hover:underline">
              Sign in as a Seller &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
