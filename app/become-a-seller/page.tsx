"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { store } from "@/lib/data/store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  ChefHat,
  CheckCircle2,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  Clock,
  Landmark,
  FileCheck2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function BecomeASellerPage() {
  const router = useRouter();
  const { user, switchRole } = useAuth();
  const { success, error: toastError } = useToast();

  // Basic Kitchen Info
  const [kitchenName, setKitchenName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Hyderabad");
  const [state, setState] = useState("Telangana");
  const [pincode, setPincode] = useState("500081");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 11001");
  const [fssaiNumber, setFssaiNumber] = useState("");

  // Bank Details for Weekly/Daily Direct Payouts
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  // Verification ID Details
  const [idType, setIdType] = useState<"pan" | "aadhaar" | "fssai">("pan");
  const [idNumber, setIdNumber] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (description.length < 20) {
      toastError("Bio too short", "Please write at least 20 characters about your culinary specialty.");
      return;
    }

    if (accountNumber && accountNumber !== confirmAccountNumber) {
      toastError("Account mismatch", "Bank account numbers do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const seller = await store.registerSeller({
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

      // Save Bank Details if entered
      if (accountHolderName && accountNumber && ifscCode) {
        await store.saveSellerBankDetails({
          seller_id: seller.id,
          account_holder_name: accountHolderName,
          account_number: accountNumber,
          ifsc_code: ifscCode.toUpperCase().trim(),
          bank_name: bankName || "Partner Bank",
          is_verified: true,
        });
      }

      // Record ID Verification document
      if (idNumber) {
        await store.uploadSellerDocument({
          seller_id: seller.id,
          doc_type: idType === "fssai" ? "fssai_cert" : "gov_id_front",
          file_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400",
          status: "pending",
        });
      }

      // Switch role to seller
      switchRole("seller");
      setIsSubmitted(true);
      success("Kitchen Application Submitted!", "Your home kitchen profile has been received for review.");
    } catch {
      toastError("Submission Error", "Failed to submit seller registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {isSubmitted ? (
          <div className="bg-white rounded-3xl border border-orange-100 p-8 sm:p-12 shadow-sm text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-800 bg-orange-100/70 px-3 py-1 rounded-full border border-orange-200">
                Status: Pending Admin Onboarding Verification
              </span>
              <h1 className="text-3xl font-extrabold text-[#26140e] mt-2">
                Application Received for {kitchenName}!
              </h1>
              <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Thank you for applying to become a Home Plate verified cook. Our Hyderabad food safety inspection team will verify your kitchen details and activate your listings within 24 hours.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200 max-w-md mx-auto text-left text-xs text-stone-700 space-y-2">
              <div className="flex items-center gap-2 text-orange-800 font-bold">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>Next Onboarding Milestones:</span>
              </div>
              <p>1. Quality and hygiene onboarding briefing with our culinary lead.</p>
              <p>2. FSSAI registration guidance and free legal assistance.</p>
              <p>3. Direct daily bank settlements enabled once KYC is verified.</p>
              <p>4. Publish traditional snacks, sweets, pickles, and podis to Hyderabad!</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/seller/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/30 transition"
              >
                <span>Go to Seller Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm transition"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-orange-100 p-8 sm:p-12 shadow-sm space-y-8">
            <div className="text-center max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-orange-600/30">
                <ChefHat className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100/80 px-2.5 py-0.5 rounded-full">
                Join Home Plate Hyderabad
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26140e] mt-2">
                Register Your Home Kitchen
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Turn your family recipes into a respected home food business. Connect directly with food lovers across Hyderabad.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-orange-50/50 border border-orange-200 text-xs text-stone-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Admin verified onboarding & food safety</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Direct daily/weekly bank payouts</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Kitchen Brand & Bio */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5 border-b border-orange-100 pb-2">
                  <ChefHat className="w-4 h-4 text-orange-600" />
                  <span>1. Kitchen Identity & Heritage</span>
                </h3>

                <Input
                  label="Kitchen / Brand Name"
                  required
                  value={kitchenName}
                  onChange={(e) => setKitchenName(e.target.value)}
                  placeholder="e.g. Ammamma's Kitchen / Sunitha's Godavari Pickles"
                />

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    About Your Culinary Specialty & Family Heritage
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us what you make (e.g. Traditional Andhra Avakaya, sun-dried Karapodi, Bellam Gavvalu, cold-pressed sesame sweets)..."
                    className="w-full text-xs p-3.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
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
                    helperText="Leave blank if you need free assistance applying"
                  />
                </div>

                <Input
                  label="Home Kitchen Street Address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Flat / Villa, Street, Locality (e.g. Jubilee Hills Road No 36)"
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
              </div>

              {/* Section 2: Direct Bank Settlement Details */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5 border-b border-orange-100 pb-2">
                  <Landmark className="w-4 h-4 text-orange-600" />
                  <span>2. Bank Details for Earnings Payouts</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Account Holder Name (As per Bank)"
                    required
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    placeholder="e.g. Smt. K. Sunitha Devi"
                  />
                  <Input
                    label="Bank Name"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. State Bank of India / HDFC Bank"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Bank Account Number"
                    type="password"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="e.g. 30129845761"
                  />
                  <Input
                    label="Confirm Account Number"
                    required
                    value={confirmAccountNumber}
                    onChange={(e) => setConfirmAccountNumber(e.target.value)}
                    placeholder="Re-enter Account Number"
                  />
                  <Input
                    label="IFSC Code"
                    required
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    placeholder="e.g. SBIN0020111"
                  />
                </div>
              </div>

              {/* Section 3: Identity & Compliance Verification */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5 border-b border-orange-100 pb-2">
                  <FileCheck2 className="w-4 h-4 text-orange-600" />
                  <span>3. KYC & Verification Document</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                      Identity Document Type
                    </label>
                    <select
                      value={idType}
                      onChange={(e) => setIdType(e.target.value as any)}
                      className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="pan">PAN Card (Primary for Payouts)</option>
                      <option value="aadhaar">Aadhaar Card</option>
                      <option value="fssai">FSSAI Certificate</option>
                    </select>
                  </div>
                  <Input
                    label="ID / Certificate Number"
                    required
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder={idType === "pan" ? "e.g. ABCDE1234F" : "e.g. 14-digit registration or ID number"}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-orange-100">
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full py-4 text-base bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-md shadow-orange-600/30"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Submit Kitchen Application for Review
                </Button>
                <p className="text-[11px] text-stone-400 text-center mt-2">
                  Admin approval is required before your food listings go live on Home Plate. Payouts are transferred automatically to your verified bank account.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
