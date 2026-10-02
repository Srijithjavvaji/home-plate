"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { store } from "@/lib/data/store";
import { Seller } from "@/lib/supabase/types";
import { useToast } from "@/lib/context/ToastContext";
import { Check, X, ShieldCheck, MapPin, Phone, Star } from "lucide-react";

export default function AdminSellersPage() {
  const { success } = useToast();
  const [sellers, setSellers] = useState<Seller[]>([]);

  const loadSellers = async () => {
    const list = await store.getSellers();
    setSellers(list);
  };

  useEffect(() => {
    loadSellers();
  }, []);

  const handleStatusChange = async (sellerId: string, newStatus: Seller["status"]) => {
    await store.updateSellerStatus(sellerId, newStatus);
    setSellers((prev) =>
      prev.map((s) =>
        s.id === sellerId
          ? { ...s, status: newStatus, is_verified: newStatus === "approved" }
          : s
      )
    );
    success(
      newStatus === "approved"
        ? "Kitchen Approved!"
        : `Kitchen status updated to ${newStatus}`,
      "Seller menu listings updated accordingly."
    );
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              Seller & Kitchen Approvals
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Review new kitchen applications, verify hygiene & FSSAI licenses, and approve listings.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {sellers.map((seller) => (
            <div
              key={seller.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                  <Image
                    src={
                      seller.logo_url ||
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80"
                    }
                    alt={seller.kitchen_name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">
                      {seller.kitchen_name}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        seller.status === "approved"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : seller.status === "pending"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {seller.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{seller.address}, {seller.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{seller.phone}</span>
                    </div>
                    {seller.fssai_number && (
                      <span className="text-slate-500">
                        FSSAI: <strong className="text-slate-300">{seller.fssai_number}</strong>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 max-w-xl pt-1">
                    {seller.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                {seller.status !== "approved" && (
                  <button
                    onClick={() => handleStatusChange(seller.id, "approved")}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Kitchen</span>
                  </button>
                )}

                {seller.status !== "rejected" && (
                  <button
                    onClick={() => handleStatusChange(seller.id, "rejected")}
                    className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 hover:text-white text-rose-300 font-bold text-xs border border-rose-500/30 transition flex items-center gap-1.5"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
