"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { Order, OrderStatus } from "@/lib/supabase/types";
import { formatPrice, formatDate, getStatusInfo } from "@/lib/utils";
import { useToast } from "@/lib/context/ToastContext";
import { Package, Clock, Check, X, MapPin, Phone, ChefHat, Bike } from "lucide-react";

export default function SellerOrdersPage() {
  const { success, error: toastError } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const allOrders = await store.getOrders();
      setOrders(allOrders);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await store.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      success("Order Status Updated", `Order is now ${newStatus.replace(/_/g, " ")}`);
    } catch {
      toastError("Failed to update status");
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-950">
            Kitchen Live Orders
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Accept incoming orders, update cooking progress, and hand off freshly packed meals to delivery riders.
          </p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-extrabold text-gray-950">
                        {order.order_number}
                      </span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.bgClass} ${statusInfo.colorClass}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Received on {formatDate(order.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-black text-gray-950">
                        {formatPrice(order.total_amount)}
                      </p>
                      <span className="text-[11px] text-gray-500 uppercase font-semibold">
                        {order.payment_method === "razorpay" ? "Razorpay Paid" : "Cash on Delivery"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body Grid: Dishes & Delivery Address */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Items */}
                  <div className="md:col-span-7 space-y-3">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Ordered Dishes
                    </h3>
                    <div className="divide-y divide-gray-100 rounded-2xl bg-gray-50/70 p-4 border border-gray-100">
                      {order.items?.map((it) => (
                        <div key={it.id} className="py-2 flex justify-between text-xs font-medium">
                          <span className="text-gray-900 font-bold">
                            {it.quantity}x {it.food_name}
                          </span>
                          <span className="text-gray-700">
                            {formatPrice(it.total_price)}
                          </span>
                        </div>
                      ))}
                    </div>
                    {order.notes && (
                      <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                        <strong>Customer Note:</strong> {order.notes}
                      </p>
                    )}
                  </div>

                  {/* Customer & Address */}
                  <div className="md:col-span-5 space-y-3">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Customer & Drop Location
                    </h3>
                    <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 text-xs text-gray-600 space-y-1.5">
                      <p className="font-bold text-gray-900 text-sm">
                        {order.delivery_address?.name || "Customer"}
                      </p>
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{order.delivery_address?.phone}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-gray-500 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          {order.delivery_address?.address_line1}, {order.delivery_address?.city} ({order.delivery_address?.pincode})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kitchen Status Actions */}
                <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-700">
                      Quick Status Transition:
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateStatus(order.id, e.target.value as OrderStatus)
                      }
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing in Kitchen</option>
                      <option value="ready_for_pickup">Ready for Pickup</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === "confirmed" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "preparing")}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center gap-1"
                      >
                        <ChefHat className="w-3.5 h-3.5" />
                        <span>Start Cooking</span>
                      </button>
                    )}

                    {order.status === "preparing" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "ready_for_pickup")}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition flex items-center gap-1"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Mark Packed & Ready</span>
                      </button>
                    )}

                    {order.status === "ready_for_pickup" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "out_for_delivery")}
                        className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition flex items-center gap-1"
                      >
                        <Bike className="w-3.5 h-3.5" />
                        <span>Hand Off to Rider</span>
                      </button>
                    )}

                    {order.status === "out_for_delivery" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "delivered")}
                        className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm Delivered</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
