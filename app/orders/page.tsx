"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { store } from "@/lib/data/store";
import { useAuth } from "@/lib/context/AuthContext";
import { Order } from "@/lib/supabase/types";
import { formatPrice, formatDate, getStatusInfo } from "@/lib/utils";
import { Package, ArrowRight, Clock, MapPin, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function OrdersHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      try {
        const allOrders = await store.getOrders();
        // Show customer orders or all orders in demo mode
        const userOrders = user
          ? allOrders.filter((o) => o.customer_id === user.id || o.customer_id === "u0000000-0000-0000-0000-000000000001")
          : allOrders;
        setOrders(userOrders);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#fffdfa] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100/80 px-2.5 py-0.5 rounded-full">
              Order History
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26140e] mt-1">
            My Orders
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track active Hyderabad home deliveries and view past homemade orders
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-orange-100 space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-orange-100 p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-orange-100 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#26140e]">
                          {order.order_number}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.bgClass} ${statusInfo.colorClass}`}
                        >
                          {statusInfo.label}
                        </span>
                        {order.delivery_slot && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 capitalize">
                            {order.delivery_slot.replace(/_/g, " ")}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-base font-extrabold text-orange-600">
                        {formatPrice(order.total_amount)}
                      </p>
                      <span className="text-[11px] text-stone-500 uppercase font-semibold">
                        {order.payment_method === "razorpay" ? "Razorpay Paid" : "COD"}
                      </span>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="py-4 space-y-1.5 text-xs text-stone-600">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span className="font-medium text-stone-800">
                          {item.quantity}x {item.food_name}
                        </span>
                        <span className="font-semibold text-stone-900">{formatPrice(item.total_price)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      <span className="truncate max-w-sm">
                        {order.delivery_address?.address_line1}, {order.delivery_address?.city}
                      </span>
                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white font-bold text-xs transition shadow-sm"
                    >
                      <span>Track Order & Delivery OTP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-orange-100 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#26140e]">No Orders Yet</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Explore authentic homemade sweets, snacks, pickles, and podis crafted with love by Hyderabad home cooks.
            </p>
            <Link
              href="/foods"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/30 transition"
            >
              <span>Explore Foods</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
