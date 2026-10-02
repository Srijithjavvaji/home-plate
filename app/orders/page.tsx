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
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
            My Orders
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track active deliveries and view your past homemade meal orders
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 space-y-3">
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
                  className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-card transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-gray-950">
                          {order.order_number}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.bgClass} ${statusInfo.colorClass}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-base font-extrabold text-gray-950">
                        {formatPrice(order.total_amount)}
                      </p>
                      <span className="text-[11px] text-gray-500 uppercase font-semibold">
                        {order.payment_method === "razorpay" ? "Razorpay Paid" : "COD"}
                      </span>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="py-4 space-y-1.5 text-xs text-gray-600">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span className="font-medium text-gray-800">
                          {item.quantity}x {item.food_name}
                        </span>
                        <span>{formatPrice(item.total_price)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate max-w-sm">
                        {order.delivery_address?.address_line1}, {order.delivery_address?.city}
                      </span>
                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs transition shadow-sm"
                    >
                      <span>Track Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-md mx-auto">
            <ShoppingBag className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900">
              No orders yet
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              You haven&apos;t ordered any homemade dishes yet. Check out the authentic kitchens!
            </p>
            <Link
              href="/foods"
              className="mt-5 inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
            >
              Order Food Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
