"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  ShieldCheck,
  CheckCircle2,
  Upload,
  FileText,
  Camera,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ChefHat,
  Sparkles,
} from "lucide-react";

export default function SellerVerificationPage() {
  const router = useRouter();
  const { seller } = useAuth();
  const { success, error: toastError } = useToast();

  const [fssaiCertUploaded, setFssaiCertUploaded] = useState(true);
  const [govIdUploaded, setGovIdUploaded] = useState(true);
  const [kitchenPhotosUploaded, setKitchenPhotosUploaded] = useState(true);

  // Hygiene Checklist
  const [chkWater, setChkWater] = useState(true);
  const [chkPackaging, setChkPackaging] = useState(true);
  const [chkStorage, setChkStorage] = useState(true);
  const [chkLabel, setChkLabel] = useState(true);
  const [chkSanitation, setChkSanitation] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitVerification = () => {
    if (!chkWater || !chkPackaging || !chkStorage || !chkLabel || !chkSanitation) {
      toastError("Incomplete Checklist", "Please check all hygiene requirements.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      success("Verification Submitted!", "Our Hyderabad food safety team will review your proofs.");
      router.push("/seller/application-status");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-13 h-13 rounded-2xl bg-orange-600 flex items-center justify-center text-white mx-auto shadow-md shadow-orange-600/30 mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-orange-800 bg-orange-100 px-3 py-0.5 rounded-full">
            FSSAI Food Safety Compliance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26140e]">
            Kitchen Verification Workflow
          </h1>
          <p className="text-xs text-stone-500">
            Upload document proofs and complete the Hyderabad home food safety checklist
          </p>
        </div>

        {/* Section 1: Document Upload Proofs */}
        <div className="bg-white rounded-3xl border border-orange-100 p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-[#26140e] flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-600" />
            <span>1. Required Document Proofs</span>
          </h2>

          <div className="space-y-3">
            {/* FSSAI Certificate */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">FSSAI Registration Certificate / Form A</p>
                  <p className="text-[11px] text-stone-500">14-digit certificate or acknowledgement PDF/photo</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Uploaded</span>
              </span>
            </div>

            {/* Government ID Proof */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Cook Identity Proof (Aadhaar / PAN)</p>
                  <p className="text-[11px] text-stone-500">Front and back photograph of government ID</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Uploaded</span>
              </span>
            </div>

            {/* Kitchen Photographs */}
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Kitchen & Preparation Area Photographs</p>
                  <p className="text-[11px] text-stone-500">Clear photos of stove, storage, and food packaging area</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Uploaded</span>
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Hyderabad Home Food Safety Hygiene Checklist */}
        <div className="bg-white rounded-3xl border border-orange-100 p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-[#26140e] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-orange-600" />
            <span>2. Home Kitchen Hygiene & Quality Declaration</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 rounded-xl border border-stone-100 hover:bg-orange-50/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={chkWater}
                onChange={(e) => setChkWater(e.target.checked)}
                className="mt-1 rounded border-stone-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-xs text-stone-700 leading-snug">
                <strong>Pure Drinking Water:</strong> Only RO / filtered water is used for all food preparation, cooking, and utensil sanitization.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-stone-100 hover:bg-orange-50/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={chkPackaging}
                onChange={(e) => setChkPackaging(e.target.checked)}
                className="mt-1 rounded border-stone-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-xs text-stone-700 leading-snug">
                <strong>Airtight Food-Grade Packaging:</strong> All sweets, pickles, and snacks are sealed in food-grade pouches or sanitized glass containers.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-stone-100 hover:bg-orange-50/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={chkStorage}
                onChange={(e) => setChkStorage(e.target.checked)}
                className="mt-1 rounded border-stone-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-xs text-stone-700 leading-snug">
                <strong>Dry & Pest-Free Storage:</strong> Ingredients, flours, oils, and spices are stored off the ground in tightly closed pest-resistant containers.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-stone-100 hover:bg-orange-50/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={chkLabel}
                onChange={(e) => setChkLabel(e.target.checked)}
                className="mt-1 rounded border-stone-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-xs text-stone-700 leading-snug">
                <strong>Accurate Food Labelling:</strong> Every dispatch item will carry a clear batch date, Veg/Non-Veg indicator, and Best Before guidance.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-stone-100 hover:bg-orange-50/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={chkSanitation}
                onChange={(e) => setChkSanitation(e.target.checked)}
                className="mt-1 rounded border-stone-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-xs text-stone-700 leading-snug">
                <strong>Personal Hygiene Standards:</strong> Hairnets, clean cooking aprons, and sanitized hands are maintained during all batch preparation.
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <Link
              href="/seller/application-status"
              className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Status</span>
            </Link>

            <Button
              type="button"
              onClick={handleSubmitVerification}
              isLoading={isLoading}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md shadow-orange-600/20"
            >
              Submit for Admin Audit
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
