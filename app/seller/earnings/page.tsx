"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { Order } from "@/lib/supabase/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { IndianRupee, ArrowDownToLine, TrendingUp, CheckCircle2, ShieldCheck, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/context/ToastContext";

export default function SellerEarningsPage() {
  const { success } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function loadData() {
      const allOrders = await store.getOrders();
      setOrders(allOrders);
    }
    loadData();
  }, []);

  const grossSales = orders.reduce((sum, o) => sum + o.subtotal, 0) || 42800;
  const platformFee = grossSales * 0.15;
  const netEarnings = grossSales * 0.85;
  const pendingPayout = netEarnings * 0.35;

  const handleRequestPayout = () => {
    success("Payout Requested", `₹${Math.round(pendingPayout)} will be transferred to your verified bank account within 24 hours.`);
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-950">
              Kitchen Earnings & Payouts
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Transparent commission breakdown and direct bank settlement records.
            </p>
          </div>

          <Button onClick={handleRequestPayout} leftIcon={<ArrowDownToLine className="w-4 h-4" />}>
            Request Early Payout
          </Button>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Net Earnings (85%)
            </span>
            <p className="text-3xl font-black text-emerald-700">
              {formatPrice(netEarnings)}
            </p>
            <p className="text-[11px] text-gray-500">
              From {formatPrice(grossSales)} total gross kitchen sales
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Next Scheduled Payout
            </span>
            <p className="text-3xl font-black text-gray-950">
              {formatPrice(pendingPayout)}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold">
              Automatic transfer every Tuesday morning
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Platform Fee (15%)
            </span>
            <p className="text-3xl font-black text-gray-600">
              {formatPrice(platformFee)}
            </p>
            <p className="text-[11px] text-gray-400">
              Covers delivery riders, app hosting & packaging boxes
            </p>
          </div>
        </div>

        {/* Bank Account Verification Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-sm">
                  HDFC Bank Limited (A/C •••• 4821)
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified & Active</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                IFSC: HDFC0001234 • Account Holder: Lakshmi Devi
              </p>
            </div>
          </div>

          <span className="text-xs text-gray-400">
            Next settlement: <strong>Oct 6, 2026</strong>
          </span>
        </div>

        {/* Payout History / Completed Orders */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Order Earnings Breakdown
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase font-semibold">
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Gross Subtotal</th>
                  <th className="pb-3">Platform Fee (15%)</th>
                  <th className="pb-3 font-bold text-gray-900">Your Share (85%)</th>
                  <th className="pb-3 text-right">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {orders.map((ord) => {
                  const fee = ord.subtotal * 0.15;
                  const net = ord.subtotal * 0.85;
                  return (
                    <tr key={ord.id} className="hover:bg-gray-50/50">
                      <td className="py-3.5 font-bold text-gray-900">
                        {ord.order_number}
                      </td>
                      <td className="py-3.5 text-gray-500">
                        {formatDate(ord.created_at)}
                      </td>
                      <td className="py-3.5 text-gray-900">
                        {formatPrice(ord.subtotal)}
                      </td>
                      <td className="py-3.5 text-rose-600">
                        - {formatPrice(fee)}
                      </td>
                      <td className="py-3.5 font-extrabold text-emerald-700">
                        {formatPrice(net)}
                      </td>
                      <td className="py-3.5 text-right">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Deposited
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
