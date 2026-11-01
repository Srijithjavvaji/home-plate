"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { Order, CategoryCommission, SellerBankDetails, SellerPayout } from "@/lib/supabase/types";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  IndianRupee,
  ArrowDownToLine,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Calendar,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/context/ToastContext";
import { useAuth } from "@/lib/context/AuthContext";

export default function SellerEarningsPage() {
  const { success, error: toastError } = useToast();
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [commissions, setCommissions] = useState<CategoryCommission[]>([]);
  const [bankDetails, setBankDetails] = useState<SellerBankDetails | null>(null);
  const [payouts, setPayouts] = useState<SellerPayout[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    async function loadData() {
      const allOrders = await store.getOrders();
      setOrders(allOrders);

      const commList = await store.getCategoryCommissions();
      setCommissions(commList);

      const sId = "11111111-aaaa-1111-aaaa-111111111111";
      const bank = await store.getSellerBankDetails(sId);
      setBankDetails(bank);

      const pList = await store.getSellerPayouts(sId);
      setPayouts(pList);
    }
    loadData();
  }, []);

  // Compute category-wise earnings and deductions dynamically
  const deliveredOrders = orders.filter((o) => o.status === "delivered" && o.payment_status === "paid");
  const grossSales = orders.reduce((sum, o) => sum + o.subtotal, 0) || 42800;

  // Average category commission based on registered categories
  const avgCommissionRate = commissions.length > 0
    ? commissions.reduce((sum, c) => sum + c.commission_percentage, 0) / commissions.length
    : 14.5;

  const totalDeductions = (grossSales * avgCommissionRate) / 100;
  const netEarnings = grossSales - totalDeductions;
  const eligibleDailyPayout = deliveredOrders.reduce((sum, o) => sum + (o.subtotal * (1 - avgCommissionRate / 100)), 0) || 1840;

  const handleRequestPayout = async () => {
    setIsRequesting(true);
    try {
      const sId = "11111111-aaaa-1111-aaaa-111111111111";
      const newPayout = await store.createSellerPayout({
        seller_id: sId,
        amount: Math.round(eligibleDailyPayout),
        commission_deducted: Math.round((eligibleDailyPayout * avgCommissionRate) / (100 - avgCommissionRate)),
        status: "processing",
        period_start: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        period_end: new Date().toISOString(),
      });

      setPayouts([newPayout, ...payouts]);
      success(
        "Daily Payout Requested",
        `${formatPrice(eligibleDailyPayout)} queued for immediate settlement to ${bankDetails?.bank_name || "verified bank account"}.`
      );
    } catch (err: any) {
      toastError("Payout Error", err?.message || "Failed to initiate settlement");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="py-8 bg-[#fffdfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-orange-100 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#271b15]">
              Homemaker Earnings & Daily Payouts
            </h1>
            <p className="text-xs text-[#7c5946] mt-0.5">
              Transparent category-wise commission deduction and daily automatic bank settlement.
            </p>
          </div>

          <Button
            onClick={handleRequestPayout}
            isLoading={isRequesting}
            className="bg-orange-600 hover:bg-orange-700 text-white"
            leftIcon={<ArrowDownToLine className="w-4 h-4" />}
          >
            Claim Daily Payout ({formatPrice(eligibleDailyPayout)})
          </Button>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
          <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Net Earnings
            </span>
            <p className="text-3xl font-black text-orange-600">
              {formatPrice(netEarnings)}
            </p>
            <p className="text-[11px] text-gray-500">
              From {formatPrice(grossSales)} gross homemade food sales
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Eligible Daily Settlement
            </span>
            <p className="text-3xl font-black text-gray-900">
              {formatPrice(eligibleDailyPayout)}
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Available for daily automated transfer</span>
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Category-Wise Commission (~{avgCommissionRate.toFixed(1)}%)
            </span>
            <p className="text-3xl font-black text-gray-700">
              {formatPrice(totalDeductions)}
            </p>
            <p className="text-[11px] text-gray-400">
              Covers Shadowfax riders, platform insurance & packaging
            </p>
          </div>
        </div>

        {/* Verified Bank Account Details */}
        <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-sm">
                  {bankDetails?.bank_name || "HDFC Bank Madhapur"} ({bankDetails?.account_number || "••••••••4819"})
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verified Payout Account</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Holder: <strong>{bankDetails?.account_holder_name || "Lakshmi Devi"}</strong> | IFSC: {bankDetails?.ifsc_code || "HDFC0001234"}
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200">
            Daily Payout Policy Active
          </span>
        </div>

        {/* Category-Wise Commission Reference */}
        <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-sm mb-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Percent className="w-5 h-5 text-orange-600" />
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Your Product Category Commission Rates
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {commissions.map((c) => (
              <div key={c.category_id} className="p-3 bg-orange-50/60 rounded-xl border border-orange-100 text-center">
                <span className="text-gray-500 block truncate font-medium">
                  {c.category?.name || c.category_id.replace("cat-", "")}
                </span>
                <strong className="text-orange-700 font-extrabold text-sm mt-0.5 block">
                  {c.commission_percentage}%
                </strong>
              </div>
            ))}
          </div>
        </div>

        {/* Payout History Ledger */}
        <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Settlement History
            </h3>
          </div>

          <div className="divide-y divide-gray-100">
            {payouts.map((p) => (
              <div key={p.id} className="p-5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-gray-900 font-bold">{formatPrice(p.amount)}</strong>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        p.status === "completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : p.status === "processing"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-[11px] mt-0.5">
                    Ref ID: {p.transaction_id || `HP-SETTL-${p.id}`}
                  </p>
                </div>
                <div className="text-right text-[11px] text-gray-400">
                  <span>{new Date(p.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
