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
  User,
  Phone,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ChefHat,
  Sparkles,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, sendOtp } = useAuth();
  const { success, error: toastError } = useToast();

  const [step, setStep] = useState<"form" | "otp">("form");

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // OTP Fields
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Real-time password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: "", color: "" };
    if (password.length < 6) return { label: "Too weak (minimum 6 characters)", color: "text-rose-600" };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { label: "Strong password", color: "text-emerald-600" };
    }
    return { label: "Moderate password", color: "text-amber-600" };
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!agreeTerms) {
      setErrorMessage("Please accept the Terms of Service & Privacy Policy.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!phone || phone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Advance to OTP Verification
    setIsLoading(true);
    const otpRes = await sendOtp(phone);
    setIsLoading(false);

    if (otpRes.success) {
      setStep("otp");
      success("Verification Code Sent!", "Use demo code: 1234");
    } else {
      setErrorMessage("Failed to send verification SMS.");
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (otp !== "1234" && otp !== "4321") {
      setErrorMessage("Invalid OTP. Please enter demo code: 1234");
      return;
    }

    setIsLoading(true);
    const res = await register({
      fullName,
      email,
      phone,
      role: "customer",
      password,
    });
    setIsLoading(false);

    if (res.success) {
      success("Welcome to Home Plate!", "Your customer account has been created.");
      router.push("/");
    } else {
      setErrorMessage(res.error || "Registration failed. Please try again.");
      toastError("Signup Error", res.error || "Could not complete registration.");
    }
  };

  const strength = getPasswordStrength();

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
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Join Home Plate Family</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#26140e] tracking-tight">
            Create Customer Account
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Discover homemade goodness delivered fresh across Hyderabad.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {errorMessage}
          </div>
        )}

        {step === "form" ? (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              leftIcon={<User className="w-4 h-4 text-stone-400" />}
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4 text-stone-400" />}
            />

            <Input
              label="Mobile Number"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              leftIcon={<Phone className="w-4 h-4 text-stone-400" />}
              helperText="Used for delivery order updates and OTP confirmation"
            />

            <div>
              <Input
                label="Create Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4 text-stone-400" />}
              />
              {strength.label && (
                <p className={`text-[11px] font-semibold mt-1 ${strength.color}`}>
                  {strength.label}
                </p>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4 text-stone-400" />}
            />

            {/* Terms acceptance */}
            <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-stone-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-xs text-stone-600 leading-snug">
                I agree to Home Plate&apos;s{" "}
                <Link href="/terms" className="text-orange-600 underline font-semibold">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-orange-600 underline font-semibold">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md shadow-orange-600/20"
            >
              Verify Mobile & Continue
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleOtpVerify} className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
              <p className="font-bold">Mobile Verification Code Sent</p>
              <p>We sent a 4-digit verification code to <strong>{phone}</strong>.</p>
              <p className="font-semibold text-orange-700">Demo Code: 1234</p>
            </div>

            <Input
              label="Enter 4-Digit OTP"
              type="text"
              maxLength={4}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="1234"
              className="text-center text-xl tracking-widest font-mono"
            />

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md"
            >
              Confirm & Complete Signup
              <CheckCircle2 className="w-4 h-4 ml-1.5" />
            </Button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="text-stone-500 hover:text-stone-800 font-medium"
              >
                &larr; Edit Details
              </button>
              <button
                type="button"
                onClick={() => success("New OTP Sent!", "Use demo code: 1234")}
                className="text-orange-600 hover:text-orange-700 font-semibold underline"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        {/* Home Cook Banner */}
        <div className="p-3.5 bg-orange-50/70 rounded-2xl border border-orange-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-orange-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-orange-950">Are you a Home Cook?</p>
              <p className="text-[11px] text-stone-600">Sell homemade food & earn directly</p>
            </div>
          </div>
          <Link
            href="/seller/register"
            className="px-3 py-1 bg-white hover:bg-orange-100 text-orange-700 text-xs font-bold rounded-lg border border-orange-200 transition"
          >
            Join as Cook &rarr;
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-stone-100">
          <p className="text-xs text-stone-600">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
