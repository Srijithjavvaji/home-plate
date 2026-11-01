"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { Button } from "@/components/ui/Button";
import {
  UtensilsCrossed,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  ChefHat,
  User,
  Phone,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Star,
  Eye,
  EyeOff,
  AlertCircle,
  FileCheck2,
  Award,
} from "lucide-react";
import { UserRole } from "@/lib/supabase/types";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as UserRole) || "customer";

  const { login, loginWithOtp, sendOtp, loginWithGoogle } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<"customer" | "seller" | "admin">(
    initialRole === "admin" ? "admin" : initialRole === "seller" ? "seller" : "customer"
  );
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");

  // Form Fields
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);

  // Admin Security Field
  const [securityPin, setSecurityPin] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle Standard Password Login
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!emailOrPhone.trim()) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);
    const res = await login(emailOrPhone.trim(), password);
    setIsLoading(false);

    if (res.success) {
      success("Welcome Back to Home Plate!", "Signed in successfully.");
      router.push(res.redirectTo || "/");
    } else {
      setErrorMessage(res.error || "Invalid login credentials. Please check your details.");
      toastError("Authentication Failed", res.error || "Please verify your credentials.");
    }
  };

  // Handle Send OTP
  const handleSendOtp = async () => {
    const rawDigits = phone.replace(/\D/g, "");
    if (rawDigits.length < 10) {
      setErrorMessage("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);
    const res = await sendOtp(phone);
    setIsLoading(false);

    if (res.success) {
      setOtpSent(true);
      setOtpCooldown(30);
      success("Verification Code Sent!", "Use demo OTP: 1234");
    } else {
      setErrorMessage(res.error || "Failed to dispatch SMS verification code.");
    }
  };

  // Handle Verify OTP Login
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!otp.trim()) {
      setErrorMessage("Please enter the 4-digit verification code.");
      return;
    }

    setIsLoading(true);
    const res = await loginWithOtp(phone, otp.trim(), activeTab);
    setIsLoading(false);

    if (res.success) {
      success("Mobile Verified!", "Welcome back to Home Plate.");
      router.push(res.redirectTo || "/");
    } else {
      setErrorMessage(res.error || "Invalid OTP code. Please enter demo code 1234.");
      toastError("Verification Failed", res.error || "Please check your OTP.");
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const res = await loginWithGoogle(activeTab);
    setIsLoading(false);
    if (res.success) {
      success("Google Sign-In Successful!");
      router.push(res.redirectTo || "/");
    }
  };

  // Quick 1-Click Fast Credentials for Pairwise Testing
  const handleAutofill = async (demoEmail: string, roleTitle: string) => {
    setEmailOrPhone(demoEmail);
    setPassword("password123");
    setErrorMessage("");
    setIsLoading(true);
    const res = await login(demoEmail, "password123");
    setIsLoading(false);
    if (res.success) {
      success(`Signed in as ${roleTitle}`);
      router.push(res.redirectTo || "/");
    }
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-[#fffdfa]">
      {/* 2-Column Responsive Card: Left Food Photography + Right Modern Login Card */}
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-orange-100 shadow-xl shadow-orange-950/5 overflow-hidden">
        
        {/* Left Column: Authentic Homemade Food Showcase (Desktop & Tablet landscape) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 bg-gradient-to-br from-[#26140e] via-[#3d1e15] to-[#1a0c08] text-white relative overflow-hidden">
          {/* Subtle Background Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,88,12,0.18),transparent_55%)] pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-2.5">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-600/40 group-hover:scale-105 transition-transform duration-300">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  HOME<span className="text-orange-500">PLATE</span>
                </span>
                <p className="text-[9px] uppercase tracking-wider text-orange-200/80 font-bold leading-none">
                  Hyderabad, Telangana
                </p>
              </div>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-orange-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Homemade Goodness, Delivered with Love</span>
            </div>
          </div>

          {/* Center Homemade Food Showcase Card */}
          <div className="relative z-10 my-4 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80"
                alt="Traditional Andhra & Telangana Homemade Pickles and Sweets"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-0.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>100% Verified Home Kitchens</span>
                </div>
                <p className="text-sm font-bold text-white leading-snug">
                  Avakaya, Gongura Pickles & Ghee Sweets
                </p>
                <div className="flex items-center gap-1 mt-1 text-amber-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                  <span className="text-[11px] text-white/90 ml-1 font-semibold">4.9 / 5 (3,400+ orders)</span>
                </div>
              </div>
            </div>

            {/* Authentic Customer Testimonial */}
            <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-xs text-orange-100/90 leading-relaxed italic">
              &ldquo;The taste of Bellam Sunnundalu and Mango Avakaya brings tears of joy. It tastes exactly like my grandmother’s kitchen in Guntur.&rdquo;
              <p className="not-italic text-[10px] font-bold text-orange-400 mt-1.5">
                — Sravanthi K., Jubilee Hills, Hyderabad
              </p>
            </div>
          </div>

          {/* Bottom Trust Badges */}
          <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-orange-200/80">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
              <span>FSSAI Compliant</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <HeartHandshake className="w-3.5 h-3.5 text-orange-400" />
              <span>Direct Cook Settlements</span>
            </span>
          </div>
        </div>

        {/* Right Column: Modern Login Card & Form */}
        <div className="lg:col-span-7 p-6 sm:p-9 flex flex-col justify-center space-y-5">
          {/* Brand Header */}
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-1.5 lg:hidden">
              <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-600/30">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#26140e]">
                HOME<span className="text-orange-600">PLATE</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26140e] tracking-tight">
              Welcome Back to Home Plate
            </h1>
            <p className="text-xs text-stone-500">
              Discover homemade goodness or share your homemade creations.
            </p>
          </div>

          {/* 3 Distinguishable Role Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveTab("customer");
                setErrorMessage("");
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all ${
                activeTab === "customer"
                  ? "bg-white text-orange-700 shadow-sm border border-orange-200"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <User className="w-3.5 h-3.5 text-orange-600" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("seller");
                setErrorMessage("");
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all ${
                activeTab === "seller"
                  ? "bg-white text-orange-700 shadow-sm border border-orange-200"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <ChefHat className="w-3.5 h-3.5 text-orange-600" />
              <span>Home Cook</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("admin");
                setErrorMessage("");
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all ${
                activeTab === "admin"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin</span>
            </button>
          </div>

          {/* FSSAI Verification Status Banner for Sellers */}
          {activeTab === "seller" && (
            <div className="p-3.5 bg-orange-50/80 rounded-2xl border border-orange-200/90 text-[11px] text-stone-700 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-orange-950 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-orange-600" />
                  <span>FSSAI Food Safety Gateway:</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-800 border border-orange-200">
                  Required
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-snug">
                Only fully verified and admin-approved home cooks can list foods. Pending, rejected, or suspended sellers will be directed to their status tracking portal.
              </p>
            </div>
          )}

          {/* Admin Security Banner */}
          {activeTab === "admin" && (
            <div className="p-3.5 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 text-[11px] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Restricted Security Portal</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                  256-Bit SSL
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Authorized operations personnel and food safety inspectors only. Public registration is disabled.
              </p>
            </div>
          )}

          {/* Method Switcher: Password vs Mobile OTP (Customer and Seller only) */}
          {activeTab !== "admin" && (
            <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("password");
                  setErrorMessage("");
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  authMethod === "password"
                    ? "bg-white text-orange-700 shadow-sm font-bold"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("otp");
                  setErrorMessage("");
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  authMethod === "otp"
                    ? "bg-white text-orange-700 shadow-sm font-bold"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Mobile OTP Login
              </button>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Method 1: Email/Mobile & Password */}
          {authMethod === "password" || activeTab === "admin" ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {activeTab === "customer"
                    ? "Email Address"
                    : activeTab === "seller"
                    ? "Registered Seller Email or Phone"
                    : "Administrator Email"}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type={activeTab === "seller" ? "text" : "email"}
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder={
                      activeTab === "customer"
                        ? "customer@homeplate.app"
                        : activeTab === "seller"
                        ? "seller@homeplate.app or 98765 11001"
                        : "admin@homeplate.app"
                    }
                    className="w-full bg-[#fffdfa] border border-orange-200/90 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">Password</label>
                  {activeTab !== "admin" && (
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#fffdfa] border border-orange-200/90 rounded-xl pl-10 pr-10 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 p-0.5"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {activeTab === "admin" && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    2FA Security Token / PIN (Optional for Demo)
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={securityPin}
                      onChange={(e) => setSecurityPin(e.target.value)}
                      placeholder="Default: 9999"
                      className="w-full bg-[#fffdfa] border border-orange-200/90 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 font-mono"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md shadow-orange-600/20 transition-all"
              >
                {activeTab === "customer"
                  ? "Sign In to Order"
                  : activeTab === "seller"
                  ? "Sign In to Kitchen Dashboard"
                  : "Authenticate Admin Session"}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>
          ) : (
            /* Method 2: Mobile Number & OTP (Customer & Seller) */
            <form onSubmit={handleOtpSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  10-Digit Registered Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 22001"
                    className="w-full bg-[#fffdfa] border border-orange-200/90 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                </div>
                {!otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading || !phone}
                    className="mt-2 w-full py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs rounded-xl border border-orange-200 transition"
                  >
                    Send 4-Digit Verification OTP
                  </button>
                )}
              </div>

              {otpSent && (
                <div className="space-y-3 pt-1">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                    <span>
                      <span className="font-bold">Demo OTP:</span> Use <strong>1234</strong>
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold">Valid 10 mins</span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1 text-center">
                      Enter 4-Digit Code
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="1234"
                      className="w-full text-center text-xl tracking-widest font-mono py-2.5 rounded-xl border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-white"
                    />
                  </div>
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

          {/* Google Sign In for Customers */}
          {activeTab === "customer" && (
            <>
              <div className="relative my-2">
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
            </>
          )}

          {/* Quick Development Autofill Switcher for Verification Testing */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-600">
              <span>Test Account Autofill:</span>
              <span className="text-[10px] text-orange-600">Click to autofill & verify</span>
            </div>

            {activeTab === "customer" && (
              <button
                type="button"
                onClick={() => handleAutofill("customer@homeplate.app", "Customer (Rahul Sharma)")}
                className="w-full py-1.5 px-2.5 bg-white hover:bg-orange-50 border border-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition flex items-center justify-between"
              >
                <span>Customer: customer@homeplate.app</span>
                <span className="text-[10px] text-orange-600 font-bold">&rarr;</span>
              </button>
            )}

            {activeTab === "seller" && (
              <div className="grid grid-cols-1 gap-1">
                <button
                  type="button"
                  onClick={() => handleAutofill("seller@homeplate.app", "Approved Cook (Lakshmi Devi)")}
                  className="w-full py-1.5 px-2.5 bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[11px] font-semibold transition flex items-center justify-between"
                >
                  <span>1. Approved Seller (Lakshmi Devi &rarr; Dashboard)</span>
                  <span className="text-[10px] font-bold text-emerald-600">&rarr;</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAutofill("seller.pending@homeplate.app", "Pending Cook (Radhika Reddy)")}
                  className="w-full py-1.5 px-2.5 bg-white hover:bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-[11px] font-semibold transition flex items-center justify-between"
                >
                  <span>2. Pending Verification (Radhika Reddy &rarr; Status Tracker)</span>
                  <span className="text-[10px] font-bold text-amber-600">&rarr;</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAutofill("seller.rejected@homeplate.app", "Rejected Cook (Sujatha Rao)")}
                  className="w-full py-1.5 px-2.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-[11px] font-semibold transition flex items-center justify-between"
                >
                  <span>3. Action Needed / Rejected (Sujatha Rao &rarr; Revision Info)</span>
                  <span className="text-[10px] font-bold text-rose-600">&rarr;</span>
                </button>
              </div>
            )}

            {activeTab === "admin" && (
              <button
                type="button"
                onClick={() => handleAutofill("admin@homeplate.app", "Platform Administrator")}
                className="w-full py-1.5 px-2.5 bg-slate-900 hover:bg-slate-800 text-slate-100 rounded-lg text-xs font-semibold transition flex items-center justify-between"
              >
                <span>admin@homeplate.app (Admin Desk &rarr; /admin)</span>
                <span className="text-[10px] text-amber-400 font-bold">&rarr;</span>
              </button>
            )}
          </div>

          {/* Registration Links */}
          <div className="text-center pt-2 space-y-1.5 border-t border-stone-100">
            {activeTab === "customer" && (
              <p className="text-xs text-stone-600">
                New to Home Plate?{" "}
                <Link href="/register" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">
                  Create customer account
                </Link>
              </p>
            )}

            {activeTab === "seller" && (
              <p className="text-xs text-stone-600">
                Want to sell your homemade food?{" "}
                <Link href="/seller/register" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">
                  Register as a Home Cook &rarr;
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[92vh] flex items-center justify-center bg-[#fffdfa]">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
