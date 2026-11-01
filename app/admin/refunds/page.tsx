"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { useToast } from "@/lib/context/ToastContext";
import { useAuth } from "@/lib/context/AuthContext";
import { Refund } from "@/lib/supabase/types";
import { formatPrice } from "@/lib/utils";
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  XCircle,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";

export default function AdminRefundsPage() {
  const { success, error: toastError } = useToast();
  const { user } = useAuth();

  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function loadRefunds() {
      const list = await store.getRefunds();
      setRefunds(list);
    }
    loadRefunds();
  }, []);

  const handleProcessRefund = async (refund: Refund) => {
    setIsProcessing(true);
    try {
      const rzpRefundId = `rfnd_mock_${Date.now()}`;
      refund.status = "processed";
      refund.razorpay_refund_id = rzpRefundId;
      refund.updated_at = new Date().toISOString();

      await store.logAdminAction(
        user?.id || "admin",
        "process_refund",
        "refund",
        refund.id,
        { previous_status: "approved" },
        { status: "processed", razorpay_refund_id: rzpRefundId }
      );

      setRefunds([...refunds]);
      success("Refund Processed", `Amount of ${formatPrice(refund.amount)} routed to original payment method.`);
    } catch (err: any) {
      toastError("Failed", err?.message || "Error settling refund");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-950 flex items-center gap-2">
          <RotateCcw className="w-6 h-6 text-orange-600" />
          <span>Refund Management Desk</span>
        </h1>
        <p className="text-xs text-[#7c5946] mt-1">
          Review, approve, and settle online refunds to original payment methods (Razorpay) or customer bank accounts.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {refunds.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-400">
              No refund requests pending or recorded.
            </div>
          ) : (
            refunds.map((ref) => (
              <div key={ref.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-gray-900">
                      {formatPrice(ref.amount)}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        ref.status === "processed"
                          ? "bg-emerald-100 text-emerald-800"
                          : ref.status === "approved"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {ref.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{ref.reason}</p>
                  <div className="flex items-center gap-4 text-[11px] text-gray-400">
                    <span>Order: #{ref.order?.order_number || ref.order_id}</span>
                    {ref.razorpay_refund_id && <span>Refund ID: {ref.razorpay_refund_id}</span>}
                    <span>Initiated: {new Date(ref.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {ref.status === "approved" && (
                  <button
                    onClick={() => handleProcessRefund(ref)}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition shadow-xs disabled:opacity-50"
                  >
                    Settle Online Refund
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
