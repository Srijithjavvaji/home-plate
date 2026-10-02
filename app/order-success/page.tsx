"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { store } from "@/lib/data/store";
import { Order } from "@/lib/supabase/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { CheckCircle2, Clock, MapPin, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (orderId) {
        const found = await store.getOrderById(orderId);
        setOrder(found);
      }
      setIsLoading(false);
    }
    fetchOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-card text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-600/20 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Payment & Order Confirmed
          </span>

          <h1 className="text-3xl font-extrabold text-gray-950 mt-3">
            Thank You For Ordering Homemade!
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-md mx-auto leading-relaxed">
            Your home cook has received your order and is beginning fresh preparation with wholesome ingredients.
          </p>

          {/* Key Order Info Banner */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-left">
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Order Number</p>
              <p className="text-xs font-extrabold text-gray-900 mt-0.5">
                {order?.order_number || "HP-20260930-101"}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Payment Mode</p>
              <p className="text-xs font-extrabold text-emerald-700 mt-0.5 uppercase">
                {order?.payment_method === "razorpay" ? "Razorpay (Paid)" : "Cash on Delivery"}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Estimated Delivery</p>
              <p className="text-xs font-extrabold text-gray-900 mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Within 45 mins</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={order ? `/orders/${order.id}` : "/orders"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Track Live Order Status</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/foods"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm border border-gray-200 transition"
            >
              <span>Explore More Dishes</span>
            </Link>
          </div>
        </div>

        {/* Order Items Breakdown */}
        {order && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
              Order Items Summary
            </h3>
            <div className="divide-y divide-gray-100">
              {order.items?.map((item) => (
                <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-gray-900">{item.food_name}</p>
                    <p className="text-gray-500 text-[11px]">
                      Qty: {item.quantity} x {formatPrice(item.unit_price)}
                    </p>
                  </div>
                  <span className="font-extrabold text-gray-950">
                    {formatPrice(item.total_price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm font-extrabold text-gray-950">
              <span>Total Paid</span>
              <span className="text-emerald-700 text-lg">
                {formatPrice(order.total_amount)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading order confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
