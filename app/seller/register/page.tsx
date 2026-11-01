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
  Building,
  MapPin,
  Landmark,
  FileText,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Upload,
} from "lucide-react";

export default function SellerRegisterPage() {
  const router = useRouter();
  const { user, switchRole } = useAuth();
  const { success, error: toastError } = useToast();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Cook & Kitchen Info
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 11001");
  const [kitchenName, setKitchenName] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("Madhapur / HITEC City");
  const [pincode, setPincode] = useState("500081");
  const [specialties, setSpecialties] = useState<string[]>(["Traditional Sweets", "Pickles"]);

  // Step 2: FSSAI Compliance
  const [fssaiStatus, setFssaiStatus] = useState<"have_reg" | "have_ack" | "need_help">("have_reg");
  const [fssaiNumber, setFssaiNumber] = useState("");
  const [fssaiExpiry, setFssaiExpiry] = useState("2027-12-31");
  const [declarationCleanWater, setDeclarationCleanWater] = useState(true);
  const [declarationPackaging, setDeclarationPackaging] = useState(true);

  // Step 3: Identity & Bank Details for Payouts
  const [idType, setIdType] = useState<"aadhaar" | "pan">("aadhaar");
  const [idNumber, setIdNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const toggleSpecialty = (item: string) => {
    if (specialties.includes(item)) {
      setSpecialties(specialties.filter((s) => s !== item));
    } else {
      setSpecialties([...specialties, item]);
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kitchenName.trim()) {
      toastError("Kitchen Name Required", "Please provide your home kitchen brand name.");
      return;
    }
    if (bio.length < 20) {
      toastError("Bio too short", "Please write at least 20 characters describing your cooking heritage.");
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fssaiStatus === "have_reg" && (!fssaiNumber || fssaiNumber.length < 8)) {
      toastError("FSSAI Number Required", "Please enter your 14-digit FSSAI registration or acknowledgement number.");
      return;
    }
    setStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accountNumber && accountNumber !== confirmAccountNumber) {
      toastError("Account Mismatch", "Bank account numbers do not match.");
      return;
    }
    setStep(4);
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    try {
      const newSeller = await store.registerSeller({
        user_id: user?.id || `seller_${Date.now()}`,
        kitchen_name: kitchenName,
        description: bio,
        address: `${address}, ${area}`,
        city: "Hyderabad",
        state: "Telangana",
        pincode,
        phone,
        fssai_number: fssaiNumber || "PENDING_FSSAI_VERIFICATION",
      });

      // Save Bank Details
      if (accountHolderName && accountNumber && ifscCode) {
        await store.saveSellerBankDetails({
          seller_id: newSeller.id,
          account_holder_name: accountHolderName,
          account_number: accountNumber,
          ifsc_code: ifscCode.toUpperCase().trim(),
          bank_name: bankName || "HDFC Bank Hyderabad",
          is_verified: true,
        });
      }

      // Record ID Document
      if (idNumber) {
        await store.uploadSellerDocument({
          seller_id: newSeller.id,
          doc_type: idType === "pan" ? "gov_id_front" : "fssai_cert",
          file_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400",
          status: "pending",
        });
      }

      // Switch context to seller role
      switchRole("seller");
      success("Home Kitchen Registered!", "Proceed to FSSAI verification checklist.");
      router.push("/seller/verification");
    } catch {
      toastError("Registration Failed", "Could not complete seller onboarding. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center text-white mx-auto shadow-md shadow-orange-600/30">
            <ChefHat className="w-7 h-7" />
          </div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-orange-800 bg-orange-100/80 px-3 py-1 rounded-full border border-orange-200">
            Home Plate Hyderabad • Partner Kitchen Onboarding
          </span>
          <h1 className="text-3xl font-extrabold text-[#26140e] tracking-tight">
            Register Your Home Kitchen
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
            Share your authentic homemade creations with thousands of food lovers across Hyderabad. Direct weekly payouts, zero upfront fees.
          </p>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
          <div className={`p-2.5 rounded-xl border transition ${step >= 1 ? "bg-orange-50 border-orange-300 text-orange-800" : "bg-stone-50 border-stone-200 text-stone-400"}`}>
            1. Kitchen Info
          </div>
          <div className={`p-2.5 rounded-xl border transition ${step >= 2 ? "bg-orange-50 border-orange-300 text-orange-800" : "bg-stone-50 border-stone-200 text-stone-400"}`}>
            2. FSSAI Details
          </div>
          <div className={`p-2.5 rounded-xl border transition ${step >= 3 ? "bg-orange-50 border-orange-300 text-orange-800" : "bg-stone-50 border-stone-200 text-stone-400"}`}>
            3. Bank & Payouts
          </div>
          <div className={`p-2.5 rounded-xl border transition ${step >= 4 ? "bg-orange-50 border-orange-300 text-orange-800" : "bg-stone-50 border-stone-200 text-stone-400"}`}>
            4. Review & Submit
          </div>
        </div>

        {/* Multi-Step Container */}
        <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-10 shadow-card">
          {/* STEP 1: Kitchen Profile */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-5">
              <h2 className="text-lg font-bold text-[#26140e] flex items-center gap-2">
                <Building className="w-5 h-5 text-orange-600" />
                <span>Step 1: Home Cook & Kitchen Identity</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Cook Full Name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Lakshmi Devi"
                />
                <Input
                  label="Kitchen Brand Name"
                  required
                  value={kitchenName}
                  onChange={(e) => setKitchenName(e.target.value)}
                  placeholder="e.g. Lakshmi's Traditional Flavors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cook@example.com"
                />
                <Input
                  label="Mobile Number (WhatsApp)"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 11001"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Kitchen Bio & Story (Minimum 20 characters)
                </label>
                <textarea
                  required
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share how long you have been preparing authentic recipes, family heritage, and special spices..."
                  className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Kitchen Street Address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Flat 302, Sai Nilayam, Road No. 12"
                  />
                </div>
                <Input
                  label="Pincode (Hyderabad)"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="500081"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Select Your Homemade Specialties
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Traditional Sweets",
                    "Pickles (Avakaya, Gongura)",
                    "Homemade Podis",
                    "Savory Snacks & Murukku",
                    "Healthy Millets",
                    "Festival Specials",
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => toggleSpecialty(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        specialties.includes(cat)
                          ? "bg-orange-600 text-white border-orange-600"
                          : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-orange-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-stone-100">
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-6 rounded-xl">
                  Next: FSSAI Compliance &rarr;
                </Button>
              </div>
            </form>
          )}

          {/* STEP 2: FSSAI Compliance */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-5">
              <h2 className="text-lg font-bold text-[#26140e] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-600" />
                <span>Step 2: Food Safety & FSSAI Standards</span>
              </h2>

              <p className="text-xs text-stone-600">
                Under FSSAI food safety regulations, every home cook selling packaged or cooked food must possess a 14-digit FSSAI Registration or Application Acknowledgement.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "have_reg", title: "Have 14-Digit FSSAI", desc: "Already registered" },
                  { id: "have_ack", title: "Have Acknowledgement", desc: "Applied & awaiting number" },
                  { id: "need_help", title: "Need Free Assistance", desc: "Home Plate will help apply" },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setFssaiStatus(opt.id as any)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition text-left ${
                      fssaiStatus === opt.id
                        ? "bg-orange-50 border-orange-400 text-orange-900 shadow-sm"
                        : "bg-white border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <p className="text-xs font-bold">{opt.title}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">{opt.desc}</p>
                  </div>
                ))}
              </div>

              {fssaiStatus !== "need_help" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <Input
                    label="14-Digit FSSAI / Acknowledgement Number"
                    required
                    value={fssaiNumber}
                    onChange={(e) => setFssaiNumber(e.target.value)}
                    placeholder="e.g. 23623032000145"
                  />
                  <Input
                    label="Certificate Expiry Date"
                    type="date"
                    required
                    value={fssaiExpiry}
                    onChange={(e) => setFssaiExpiry(e.target.value)}
                  />
                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                  <span className="font-bold">Home Plate FSSAI Support:</span> Our team will assist you with filling Form A for FSSAI registration within 24 hours of completing this signup.
                </div>
              )}

              <div className="space-y-2 pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={declarationCleanWater}
                    onChange={(e) => setDeclarationCleanWater(e.target.checked)}
                    className="mt-0.5 rounded border-stone-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-xs text-stone-700">
                    I declare that all food items are prepared using 100% RO/purified drinking water in a clean, hygienic kitchen.
                  </span>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={declarationPackaging}
                    onChange={(e) => setDeclarationPackaging(e.target.checked)}
                    className="mt-0.5 rounded border-stone-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-xs text-stone-700">
                    I declare that all packaged sweets, pickles, and snacks will be sealed in food-grade airtight containers.
                  </span>
                </label>
              </div>

              <div className="flex justify-between pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900"
                >
                  &larr; Back
                </button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-6 rounded-xl">
                  Next: Bank Payouts &rarr;
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: Bank Details */}
          {step === 3 && (
            <form onSubmit={handleStep3Submit} className="space-y-5">
              <h2 className="text-lg font-bold text-[#26140e] flex items-center gap-2">
                <Landmark className="w-5 h-5 text-orange-600" />
                <span>Step 3: Bank Account for Direct Payouts</span>
              </h2>

              <p className="text-xs text-stone-600">
                Home Plate processes direct bank settlements every Tuesday for all dispatched orders. Zero commission deducted on your first 100 orders!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Beneficiary Account Holder Name"
                  required
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  placeholder="As per bank passbook"
                />
                <Input
                  label="Bank Name"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. State Bank of India, HDFC"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Bank Account Number"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="00000000000"
                />
                <Input
                  label="Confirm Bank Account Number"
                  required
                  value={confirmAccountNumber}
                  onChange={(e) => setConfirmAccountNumber(e.target.value)}
                  placeholder="00000000000"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="IFSC Code"
                  required
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  placeholder="HDFC0001234"
                />
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Identity Document Type
                  </label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white"
                  >
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="pan">PAN Card</option>
                  </select>
                </div>
              </div>

              <Input
                label="Government ID Number"
                required
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="XXXX-XXXX-XXXX"
              />

              <div className="flex justify-between pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900"
                >
                  &larr; Back
                </button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-6 rounded-xl">
                  Next: Review & Submit &rarr;
                </Button>
              </div>
            </form>
          )}

          {/* STEP 4: Review & Final Submission */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-[#26140e] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-orange-600" />
                <span>Step 4: Review Your Kitchen Details</span>
              </h2>

              <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200 space-y-3 text-xs text-stone-800">
                <div className="flex justify-between">
                  <span className="text-stone-500">Cook Name:</span>
                  <span className="font-bold">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Kitchen Name:</span>
                  <span className="font-bold">{kitchenName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Address:</span>
                  <span className="font-bold">{address}, {pincode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">FSSAI Status:</span>
                  <span className="font-bold">{fssaiNumber || "Form A Assistance Requested"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Payout Bank:</span>
                  <span className="font-bold">{bankName} ({ifscCode})</span>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600">
                By submitting this application, you agree to uphold Home Plate&apos;s food safety standards, hygiene checklist, and partner cook charter. You will be routed to the FSSAI verification checklist to complete document proofs.
              </div>

              <div className="flex justify-between pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900"
                >
                  &larr; Back
                </button>
                <Button
                  type="button"
                  onClick={handleFinalSubmit}
                  isLoading={isLoading}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-xl shadow-md shadow-orange-600/30"
                >
                  Submit Kitchen Application
                  <CheckCircle2 className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
