"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  UtensilsCrossed,
  ArrowRight,
  ShieldCheck,
  ChefHat,
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  Clock,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";

// Curated authentic homemade snacks promotional slides with actual photography
const HOMEMADE_SNACKS_SLIDES = [
  {
    id: 1,
    title: "Authentic Andhra Avakaya & Gongura Pickles",
    subtitle: "Sun-cured raw mango & cold-pressed sesame oil in small ceramic barni jars",
    category: "Traditional Pickles",
    cook: "Lakshmi Devi • Kukatpally Kitchen",
    badge: "Godavari Heritage Recipe",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Stone-Ground Kandi & Karivepaku Podi",
    subtitle: "Roasted lentils, fiery red chilies & fresh garden curry leaves ground on stone",
    category: "Authentic Podis",
    cook: "Anasuya Rao • Secunderabad Kitchen",
    badge: "100% Stone-Ground",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Handmade Bellam Gavvalu & Crunchy Murukulu",
    subtitle: "Golden-crisped savory rings and organic jaggery-coated traditional sea shells",
    category: "Crispy Savories",
    cook: "Radhika Reddy • Madhapur Kitchen",
    badge: "Desi Butter & Cold-Pressed Oil",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    title: "Pure Cow Ghee Sunnundalu & Mysore Pak",
    subtitle: "Melt-in-mouth roasted urad dal & pure desi cow ghee crafted with grandma love",
    category: "Desi Ghee Sweets",
    cook: "Padma Vani • Gachibowli Kitchen",
    badge: "Pure Gir Cow Desi Ghee",
    image: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=900&auto=format&fit=crop&q=80",
  },
];

interface WelcomeLoginScreenProps {
  initialMethod?: "phone" | "email";
}

export const WelcomeLoginScreen: React.FC<WelcomeLoginScreenProps> = ({
  initialMethod = "phone",
}) => {
  const router = useRouter();
  const { login, loginWithOtp, sendOtp, loginWithGoogle } = useAuth();
  const { success, error: toastError } = useToast();

  // Mode: "phone" | "otp" | "email"
  const [mode, setMode] = useState<"phone" | "otp" | "email">(initialMethod);

  // Form Fields
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // State & Loading
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto advance carousel every 5.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HOMEMADE_SNACKS_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // OTP Countdown Timer
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  // Handle Phone Submit & Request OTP
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const digits = phoneNumber.replace(/\D/g, "");
    if (digits.length < 10) {
      setErrorMessage("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setIsLoading(true);
    const res = await sendOtp("+91" + digits.slice(-10));
    setIsLoading(false);

    if (res.success) {
      setMode("otp");
      setOtpCountdown(30);
      success("Verification Code Sent!", "Use demo OTP: 1234 to log in instantly.");
    } else {
      setErrorMessage(res.error || "Could not dispatch verification SMS. Please try again.");
    }
  };

  // Handle OTP Verification & Automatic Role Redirection
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!otpCode.trim()) {
      setErrorMessage("Please enter the 4-digit verification code.");
      return;
    }

    setIsLoading(true);
    const res = await loginWithOtp(phoneNumber, otpCode.trim());
    setIsLoading(false);

    if (res.success) {
      success("Welcome to Home Plate!", "Signed in successfully.");
      router.push(res.redirectTo || "/");
    } else {
      setErrorMessage(res.error || "Invalid OTP code. Please enter demo code 1234.");
      toastError("Authentication Failed", "Please use verification code 1234.");
    }
  };

  // Handle Email & Password Login
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);
    const res = await login(email.trim(), password);
    setIsLoading(false);

    if (res.success) {
      success("Welcome Back to Home Plate!", "Signed in successfully.");
      router.push(res.redirectTo || "/");
    } else {
      setErrorMessage(res.error || "Invalid credentials. Please verify your email and password.");
      toastError("Login Failed", res.error || "Please check your credentials.");
    }
  };

  // Handle Google Login
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const res = await loginWithGoogle();
    setIsLoading(false);
    if (res.success) {
      success("Welcome to Home Plate!", "Signed in via Google.");
      router.push(res.redirectTo || "/");
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-[#fafafa] flex items-center justify-center py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      {/* Main Responsive Two-Column Card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: HOMEMADE SNACKS PROMOTIONAL CAROUSEL & FOOD PHOTOGRAPHY       */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 relative bg-stone-900 text-white min-h-[320px] sm:min-h-[420px] lg:min-h-[580px] flex flex-col justify-between overflow-hidden">
          {/* Active Carousel Background Image */}
          {HOMEMADE_SNACKS_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={"absolute inset-0 transition-opacity duration-1000 ease-in-out " + (
                idx === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
              )}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={idx === 0}
                className="object-cover transition-transform duration-7000 ease-linear"
              />
              {/* Gradient Overlays for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
            </div>
          ))}

          {/* Top Bar inside Promotional Showcase */}
          <div className="relative z-10 p-5 sm:p-7 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
              <span className="w-2 h-2 rounded-full bg-[#e23744] animate-pulse" />
              <span className="text-[11px] font-poppins font-medium text-white tracking-wide">
                100% Homemade Snacks
              </span>
            </div>

            <span className="text-xs font-poppins font-medium text-white/80 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              {currentSlide + 1} / {HOMEMADE_SNACKS_SLIDES.length}
            </span>
          </div>

          {/* Bottom Content inside Promotional Showcase */}
          <div className="relative z-10 p-5 sm:p-8 space-y-3">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-[#e23744] text-white px-2.5 py-0.5 rounded-md shadow-xs">
              {HOMEMADE_SNACKS_SLIDES[currentSlide].category}
            </span>

            <h3 className="text-xl sm:text-2xl font-poppins font-semibold text-white tracking-tight leading-snug">
              {HOMEMADE_SNACKS_SLIDES[currentSlide].title}
            </h3>

            <p className="text-xs sm:text-sm font-lato text-gray-200 line-clamp-2 leading-relaxed">
              {HOMEMADE_SNACKS_SLIDES[currentSlide].subtitle}
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-white/15 text-[11px] text-gray-300">
              <span className="font-medium text-white flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5 text-[#e23744]" />
                {HOMEMADE_SNACKS_SLIDES[currentSlide].cook}
              </span>
              <span className="hidden sm:inline-block text-amber-300 font-semibold">
                {HOMEMADE_SNACKS_SLIDES[currentSlide].badge}
              </span>
            </div>

            {/* Carousel Navigation Indicators */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5">
                {HOMEMADE_SNACKS_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    aria-label={"Go to slide " + (i + 1)}
                    className={"h-1.5 rounded-full transition-all duration-300 " + (
                      i === currentSlide ? "w-6 bg-[#e23744]" : "w-1.5 bg-white/40 hover:bg-white/80"
                    )}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setCurrentSlide((prev) => (prev - 1 + HOMEMADE_SNACKS_SLIDES.length) % HOMEMADE_SNACKS_SLIDES.length)
                  }
                  aria-label="Previous Slide"
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition text-white border border-white/10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % HOMEMADE_SNACKS_SLIDES.length)}
                  aria-label="Next Slide"
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition text-white border border-white/10"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: LOGIN & SIGNUP PANEL (ZOMATO-INSPIRED RED & WHITE)         */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-center">
          {/* Brand Logo & Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#e23744] flex items-center justify-center text-white shadow-md shadow-[#e23744]/25">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#1c1c1c] font-poppins">
                HOME<span className="text-[#e23744]">PLATE</span>
              </span>
              <p className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold leading-none">
                Homemade Goodness
              </p>
            </div>
          </div>

          {/* Main Title & Subtitle Required in Spec */}
          <div className="mt-5 space-y-1">
            <h1 className="text-2xl sm:text-3xl font-poppins font-semibold text-[#1c1c1c] tracking-tight leading-tight">
              DISCOVER THE TASTE OF HOMEMADE
            </h1>
            <p className="text-sm font-lato text-gray-500 font-normal">
              Homemade goodness, delivered to your doorstep.
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-lato text-red-700 flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ======================================================================= */}
          {/* MODE 1: PHONE NUMBER LOGIN (DEFAULT)                                     */}
          {/* ======================================================================= */}
          {mode === "phone" && (
            <form onSubmit={handlePhoneSubmit} className="mt-6 space-y-4">
              {/* Phone Input with +91 Country Selector */}
              <div>
                <label className="block text-xs font-poppins font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative flex items-center rounded-xl border border-gray-300 focus-within:border-[#e23744] focus-within:ring-2 focus-within:ring-[#e23744]/20 transition-all bg-white overflow-hidden shadow-xs">
                  {/* India +91 prefix indicator */}
                  <div className="flex items-center gap-1.5 px-3 py-3 bg-gray-50 border-r border-gray-200 select-none text-xs font-poppins font-semibold text-gray-800">
                    <span className="text-sm">🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    id="welcome-phone-input"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full px-3.5 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none font-lato"
                    autoFocus
                  />
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-lato text-gray-600 select-none">
                  <input
                    type="checkbox"
                    id="welcome-remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#e23744] focus:ring-[#e23744] border-gray-300 cursor-pointer"
                  />
                  <span>Remember me on this device</span>
                </label>
              </div>

              {/* Prominent Red Continue Button */}
              <button
                type="submit"
                id="welcome-continue-btn"
                disabled={isLoading || phoneNumber.replace(/\D/g, "").length < 10}
                className="w-full py-3.5 px-4 rounded-xl bg-[#e23744] hover:bg-[#cb202d] text-white font-poppins font-medium text-sm shadow-md shadow-[#e23744]/25 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Sending Code...</span>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Divider: "or" */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-gray-400 font-lato font-normal">or</span>
                </div>
              </div>

              {/* Alternative Auth Buttons: Google & Email */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  id="welcome-google-btn"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-poppins font-medium text-xs transition flex items-center justify-center gap-3 shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  id="welcome-email-toggle-btn"
                  onClick={() => setMode("email")}
                  className="w-full py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-poppins font-medium text-xs transition flex items-center justify-center gap-2.5 shadow-xs"
                >
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>Continue with Email</span>
                </button>
              </div>

              {/* Terms & Privacy Links */}
              <p className="text-[11px] font-lato text-gray-400 text-center pt-2 leading-relaxed">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="text-gray-700 underline hover:text-[#e23744] transition">
                  Terms of Service
                </Link>{" "}
                &{" "}
                <Link href="/privacy" className="text-gray-700 underline hover:text-[#e23744] transition">
                  Privacy Policy
                </Link>
              </p>

              {/* Guest Explore Link */}
              <div className="pt-3 border-t border-gray-100 text-center">
                <Link
                  href="/foods"
                  id="welcome-guest-explore-btn"
                  className="text-xs font-poppins font-medium text-gray-600 hover:text-[#e23744] transition inline-flex items-center gap-1.5"
                >
                  <span>Browse homemade snacks as Guest</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </form>
          )}

          {/* ======================================================================= */}
          {/* MODE 2: OTP VERIFICATION                                                */}
          {/* ======================================================================= */}
          {mode === "otp" && (
            <form onSubmit={handleOtpVerify} className="mt-6 space-y-4">
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200/80 text-xs text-orange-950 flex items-center justify-between">
                <div>
                  <p className="font-semibold">Code sent to +91 {phoneNumber}</p>
                  <p className="text-[11px] text-orange-700">Demo verification code: 1234</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMode("phone")}
                  className="text-[11px] font-bold text-[#e23744] hover:underline"
                >
                  Edit Number
                </button>
              </div>

              <div>
                <label className="block text-xs font-poppins font-medium text-gray-700 mb-1.5">
                  Enter 4-Digit Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="1 2 3 4"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#e23744] focus:ring-2 focus:ring-[#e23744]/20 text-center tracking-widest text-lg font-bold font-poppins focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Resend OTP */}
              <div className="flex items-center justify-between text-xs font-lato">
                <span className="text-gray-500">Didn't receive code?</span>
                {otpCountdown > 0 ? (
                  <span className="text-gray-400">Resend in {otpCountdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      setOtpCountdown(30);
                      await sendOtp("+91" + phoneNumber);
                      success("Code Resent!", "Use demo OTP: 1234");
                    }}
                    className="text-[#e23744] font-semibold hover:underline"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading || otpCode.length < 4}
                className="w-full py-3.5 px-4 rounded-xl bg-[#e23744] hover:bg-[#cb202d] text-white font-poppins font-medium text-sm shadow-md shadow-[#e23744]/25 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMode("phone")}
                className="w-full py-2.5 text-xs font-poppins font-medium text-gray-600 hover:text-gray-900 transition text-center"
              >
                ← Back to Phone Number
              </button>
            </form>
          )}

          {/* ======================================================================= */}
          {/* MODE 3: EMAIL / PASSWORD LOGIN                                          */}
          {/* ======================================================================= */}
          {mode === "email" && (
            <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-poppins font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-[#e23744] focus:ring-2 focus:ring-[#e23744]/20 focus:outline-none font-lato"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-poppins font-medium text-gray-700">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-lato text-[#e23744] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-gray-300 focus:border-[#e23744] focus:ring-2 focus:ring-[#e23744]/20 focus:outline-none font-lato"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-lato text-gray-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#e23744] focus:ring-[#e23744] border-gray-300 cursor-pointer"
                  />
                  <span>Remember me on this device</span>
                </label>
              </div>

              {/* Prominent Red Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#e23744] hover:bg-[#cb202d] text-white font-poppins font-medium text-sm shadow-md shadow-[#e23744]/25 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <span>Signing In...</span> : <span>Sign In</span>}
              </button>

              {/* Switch back to Phone Number */}
              <div className="text-center pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => setMode("phone")}
                  className="text-xs font-poppins font-medium text-[#e23744] hover:underline"
                >
                  ← Use Phone Number OTP instead
                </button>

                <p className="text-xs font-lato text-gray-500">
                  New to Home Plate?{" "}
                  <Link href="/register" className="font-semibold text-gray-900 hover:text-[#e23744] underline">
                    Create Customer Account
                  </Link>
                </p>
              </div>
            </form>
          )}

          {/* Trust Footnotes */}
          <div className="mt-8 pt-5 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-[#e23744]" />
              <span className="text-[10px] font-poppins font-medium text-gray-700 mt-1">FSSAI Kitchens</span>
            </div>
            <div className="flex flex-col items-center">
              <Sparkles className="w-4 h-4 text-[#e23744]" />
              <span className="text-[10px] font-poppins font-medium text-gray-700 mt-1">Zero Chemicals</span>
            </div>
            <div className="flex flex-col items-center">
              <HeartHandshake className="w-4 h-4 text-[#e23744]" />
              <span className="text-[10px] font-poppins font-medium text-gray-700 mt-1">Hyperlocal Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
