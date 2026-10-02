"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { UtensilsCrossed, Lock, Mail, User, Phone, ChefHat, ArrowRight } from "lucide-react";
import { UserRole } from "@/lib/supabase/types";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { success, error: toastError } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    const res = await register({
      fullName,
      email,
      phone,
      role,
      password,
    });
    setIsLoading(false);

    if (res.success) {
      success("Account Created!", "Welcome to Home Plate family.");
      if (role === "seller") {
        router.push("/become-a-seller");
      } else {
        router.push("/foods");
      }
    } else {
      setErrorMessage(res.error || "Registration failed");
      toastError("Signup Error", res.error || "Could not complete registration.");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/50 to-white">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-card">
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-600/30 mb-4">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-950">
            Create Your Account
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Join Home Plate to savor fresh home food or start your home kitchen
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === "customer"
                ? "bg-white text-emerald-800 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <User className="w-4 h-4 text-emerald-600" />
            <span>I want to Order Food</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("seller")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === "seller"
                ? "bg-white text-emerald-800 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <ChefHat className="w-4 h-4 text-emerald-600" />
            <span>I want to Cook & Sell</span>
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {errorMessage}
            </div>
          )}

          <Input
            label="Full Name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Radhika Sharma"
            leftIcon={<User className="w-4 h-4" />}
          />

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Phone Number"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            leftIcon={<Phone className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            leftIcon={<Lock className="w-4 h-4" />}
            helperText="Must be minimum 6 characters long"
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full py-3 mt-4"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {role === "seller" ? "Register & Set Up Kitchen" : "Create Customer Account"}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-700 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
