"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/Button";
import {
  ChefHat,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Upload,
  ArrowRight,
  PhoneCall,
  ShieldCheck,
  RotateCcw,
  HelpCircle,
  XCircle,
} from "lucide-react";

function SellerApplicationStatusContent() {
  const searchParams = useSearchParams();
  const queryStatus = searchParams.get("status");

  const { user, seller } = useAuth();

  // Active status preference: query param overrides context for demo testing
  const [activeStatus, setActiveStatus] = useState<"pending" | "fssai_pending" | "approved" | "rejected" | "suspended">(
    (queryStatus as any) || (seller?.status as any) || "pending"
  );

  return (
    <div className="min-h-screen bg-[#fffdfa] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="w-13 h-13 rounded-2xl bg-orange-600 flex items-center justify-center text-white mx-auto shadow-md shadow-orange-600/30 mb-3">
            <ChefHat className="w-7 h-7" />
          </div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-orange-800 bg-orange-100 px-3 py-0.5 rounded-full">
            Home Plate Partner Onboarding
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26140e]">
            Seller Application Status
          </h1>
          <p className="text-xs text-stone-500">
            Track your home kitchen onboarding and FSSAI food safety verification
          </p>
        </div>

        {/* 4-Stage Progress Tracker */}
        <div className="bg-white rounded-3xl border border-orange-100 p-6 shadow-card space-y-4">
          <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Onboarding Milestones
          </h2>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-stone-900">1. Kitchen Registration Submitted</p>
                <p className="text-[11px] text-stone-500">Basic kitchen details, menu specialties, and address registered.</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Completed</span>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                activeStatus === "approved"
                  ? "bg-emerald-100 text-emerald-600"
                  : activeStatus === "rejected"
                  ? "bg-rose-100 text-rose-600"
                  : "bg-amber-100 text-amber-600"
              }`}>
                {activeStatus === "approved" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : activeStatus === "rejected" ? (
                  <XCircle className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-stone-900">2. FSSAI & Document Verification</p>
                <p className="text-[11px] text-stone-500">Audit of 14-digit FSSAI certificate and government ID proofs.</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                activeStatus === "approved"
                  ? "bg-emerald-50 text-emerald-700"
                  : activeStatus === "rejected"
                  ? "bg-rose-50 text-rose-700"
                  : "bg-amber-50 text-amber-700"
              }`}>
                {activeStatus === "approved"
                  ? "Verified"
                  : activeStatus === "rejected"
                  ? "Action Required"
                  : "Under Review"}
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                activeStatus === "approved" ? "bg-emerald-100 text-emerald-600" : "bg-stone-100 text-stone-400"
              }`}>
                {activeStatus === "approved" ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-stone-900">3. Kitchen Hygiene & Sample Taste Audit</p>
                <p className="text-[11px] text-stone-500">Quality briefing with Home Plate culinary safety supervisor.</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                activeStatus === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"
              }`}>
                {activeStatus === "approved" ? "Approved" : "Upcoming"}
              </span>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                activeStatus === "approved" ? "bg-emerald-100 text-emerald-600" : "bg-stone-100 text-stone-400"
              }`}>
                <ChefHat className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-stone-900">4. Live on Home Plate Hyderabad</p>
                <p className="text-[11px] text-stone-500">Accept customer orders, dispatch batches, receive payouts.</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                activeStatus === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"
              }`}>
                {activeStatus === "approved" ? "Active" : "Locked"}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Status Card */}
        {activeStatus === "pending" && (
          <div className="bg-white rounded-3xl border border-amber-200 p-6 sm:p-8 shadow-card text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                Status: Application Under Review
              </span>
              <h3 className="text-xl font-bold text-stone-900 mt-2">
                Your Kitchen Application is Being Audited
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Thank you for applying to sell with Home Plate. Our Hyderabad culinary onboarding lead is verifying your kitchen address and hygiene declaration. Average review turnaround is <strong>within 24 hours</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs text-stone-700 space-y-1.5">
              <p className="font-bold text-stone-900">Registered Kitchen Summary:</p>
              <p>• <strong>Kitchen:</strong> {seller?.kitchen_name || "Lakshmi's Traditional Flavors"}</p>
              <p>• <strong>Location:</strong> Hyderabad, Telangana</p>
              <p>• <strong>FSSAI Number:</strong> {seller?.fssai_number || "23623032000145"}</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/seller/verification"
                className="py-2.5 px-5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                View Verification Checklist
              </Link>
              <a
                href="https://wa.me/919876500001?text=Hello%20Home%20Plate%20Support"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition"
              >
                WhatsApp Onboarding Support
              </a>
            </div>
          </div>
        )}

        {activeStatus === "rejected" && (
          <div className="bg-white rounded-3xl border border-rose-200 p-6 sm:p-8 shadow-card text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
                Status: Application Requires Revision
              </span>
              <h3 className="text-xl font-bold text-stone-900 mt-2">
                Document Revision Needed
              </h3>
              <p className="text-xs text-rose-700 max-w-md mx-auto leading-relaxed">
                Our food safety compliance team found that your uploaded FSSAI certificate was expired or the kitchen address proof was blurred.
              </p>
            </div>

            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-left text-xs text-rose-900 space-y-1">
              <p className="font-bold">Required Actions to Get Approved:</p>
              <p>1. Upload a clear photograph of your 14-digit FSSAI Registration Certificate.</p>
              <p>2. Verify that your registered kitchen address matches your Aadhaar / Electricity bill proof.</p>
            </div>

            <div className="pt-2 flex justify-center">
              <Link
                href="/seller/verification"
                className="py-3 px-6 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Update Documents & Resubmit</span>
              </Link>
            </div>
          </div>
        )}

        {activeStatus === "suspended" && (
          <div className="bg-white rounded-3xl border border-stone-300 p-6 sm:p-8 shadow-card text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center mx-auto">
              <XCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-800 bg-stone-200 px-3 py-1 rounded-full">
                Status: Account Suspended
              </span>
              <h3 className="text-xl font-bold text-stone-900 mt-2">
                Kitchen Operations Temporarily Paused
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Your kitchen operations have been placed on hold due to a pending quality inquiry or fulfillment compliance review.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <a
                href="mailto:sellers@homeplate.app?subject=Seller%20Suspension%20Appeal"
                className="py-3 px-6 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition shadow-md"
              >
                Contact Partner Appeals Team
              </a>
            </div>
          </div>
        )}

        {activeStatus === "approved" && (
          <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-8 shadow-card text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Status: Verified & Approved Partner Cook
              </span>
              <h3 className="text-xl font-bold text-stone-900 mt-2">
                Congratulations! Your Kitchen is Live
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Your FSSAI credentials and kitchen standards have been verified by the Home Plate food safety committee. You can now manage menu listings and accept orders.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <Link
                href="/seller/dashboard"
                className="py-3 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/30 flex items-center gap-2"
              >
                <ChefHat className="w-4 h-4" />
                <span>Launch Kitchen Dashboard &rarr;</span>
              </Link>
            </div>
          </div>
        )}

        {/* Development Quick Switcher (Allows testing all 4 states) */}
        <div className="p-3 bg-stone-100 rounded-2xl border border-stone-200 text-center space-y-2">
          <p className="text-[11px] font-bold text-stone-600">Simulate Seller Lifecycle States:</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {[
              { id: "pending", label: "Under Review" },
              { id: "approved", label: "Approved (Active)" },
              { id: "rejected", label: "Action Needed (Rejected)" },
              { id: "suspended", label: "Suspended" },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setActiveStatus(st.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  activeStatus === st.id
                    ? "bg-orange-600 text-white shadow-sm"
                    : "bg-white text-stone-700 hover:bg-stone-200"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-stone-500 hover:text-stone-800 font-medium">
            &larr; Return to Home Plate Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}


export default function SellerApplicationStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fffdfa] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SellerApplicationStatusContent />
    </Suspense>
  );
}
