"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { store } from "@/lib/data/store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ChefHat, CheckCircle2, ShieldCheck, HeartHandshake, ArrowRight, Clock } from "lucide-react";

export default function BecomeASellerPage() {
  const router = useRouter();
  const { user, switchRole } = useAuth();
  const { success, error: toastError } = useToast();

  const [kitchenName, setKitchenName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Hyderabad");
  const [state, setState] = useState("Telangana");
  const [pincode, setPincode] = useState("500081");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 11001");
  const [fssaiNumber, setFssaiNumber] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.length < 20) {
      toastError("Bio too short", "Please write at least 20 characters about your culinary specialty.");
      return;
    }

    setIsLoading(true);
    try {
      await store.registerSeller({
        user_id: user?.id || `seller_user_${Date.now()}`,
        kitchen_name: kitchenName,
        description,
        address,
        city,
        state,
        pincode,
        phone,
        fssai_number: fssaiNumber || "PENDING_FSSAI",
      });

      // Switch role to seller
      switchRole("seller");
      setIsSubmitted(true);
      success("Application Submitted!", "Your kitchen is registered and awaiting admin review.");
    } catch {
      toastError("Submission Error", "Failed to submit seller registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {isSubmitted ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-card text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Status: Pending Admin Approval
              </span>
              <h1 className="text-3xl font-extrabold text-gray-950 mt-2">
                Application Received for {kitchenName}!
              </h1>
              <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Thank you for applying to become a Home Plate cook. Our quality inspection team will verify your kitchen details and activate your account within 24 hours.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 max-w-md mx-auto text-left text-xs text-gray-600 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <Clock className="w-4 h-4" />
                <span>What happens next:</span>
              </div>
              <p>1. Quality team conducts a telephone/video verification.</p>
              <p>2. FSSAI registration guidance is provided free of charge.</p>
              <p>3. Once approved, you can publish recipes to neighborhood foodies!</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/seller/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition"
              >
                <span>Go to Seller Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-card space-y-8">
            <div className="text-center max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-600/30">
                <ChefHat className="w-7 h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
                Register Your Home Kitchen
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Turn your passion for cooking into a rewarding home enterprise. Connect with food lovers across the city.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Admin verified onboarding</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct weekly bank payouts</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Kitchen / Brand Name"
                required
                value={kitchenName}
                onChange={(e) => setKitchenName(e.target.value)}
                placeholder="e.g. Ammamma’s Kitchen / Radhika’s Homestyle"
              />

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  About Your Culinary Specialty & Heritage
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us what you cook (e.g. Authentic Andhra avakaya, slow-braised curries, gluten-free millet rotis)..."
                  className="w-full text-xs p-3.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Phone Number"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 11001"
                />
                <Input
                  label="FSSAI Registration Number (Optional)"
                  value={fssaiNumber}
                  onChange={(e) => setFssaiNumber(e.target.value)}
                  placeholder="14-digit registration number"
                  helperText="Leave blank if you need assistance applying"
                />
              </div>

              <Input
                label="Home Kitchen Street Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat / Villa / Street, Locality"
              />

              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="City"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <Input
                  label="State"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
                <Input
                  label="Pincode"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full py-4 text-base"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Submit Kitchen Application for Review
                </Button>
                <p className="text-[11px] text-gray-400 text-center mt-2">
                  Admin approval is required before your food listings go live on Home Plate.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
