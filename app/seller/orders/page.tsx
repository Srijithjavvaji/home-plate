"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { Order, OrderStatus } from "@/lib/supabase/types";
import { formatPrice, formatDate, getStatusInfo } from "@/lib/utils";
import { useToast } from "@/lib/context/ToastContext";
import {
  Package,
  Clock,
  Check,
  X,
  MapPin,
  Phone,
  ChefHat,
  Bike,
  ShieldCheck,
  Loader2,
  KeyRound,
} from "lucide-react";

export default function SellerOrdersPage() {
  const { success, error: toastError } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);

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

  const handleMarkReadyForPickup = async (orderId: string) => {
    setDispatchingId(orderId);
    try {
      // Trigger delivery dispatch API
      const res = await fetch("/api/delivery/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, status: "ready_for_pickup", delivery: data.delivery }
              : o
          )
        );
        success(
          "Delivery Dispatched",
          `Order marked ready! Tracking ID: ${data.tracking_id || "Assigned"}`
        );
      } else {
        // Fallback update in store
        await store.updateOrderStatus(orderId, "ready_for_pickup");
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: "ready_for_pickup" } : o))
        );
        success("Marked Ready for Pickup", "Order is packed and ready for courier pickup.");
      }
    } catch (err: any) {
      toastError(err.message || "Failed to initiate delivery dispatch");
    } finally {
      setDispatchingId(null);
    }
  };

  return (
    <div className="py-8 bg-[#fffdfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100/80 px-2.5 py-0.5 rounded-full">
              Kitchen Operations
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#26140e] mt-1">
            Kitchen Live Orders & Handshakes
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Accept incoming Hyderabad orders, advance cooking batches, and hand off packed homemade goods to courier partners.
          </p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const isDispatching = dispatchingId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-sm space-y-6"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-orange-100 gap-3">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-base font-extrabold text-[#26140e]">
                        {order.order_number}
                      </span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.bgClass} ${statusInfo.colorClass}`}
                      >
                        {statusInfo.label}
                      </span>
                      {order.delivery && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-orange-600" />
                          <span>{order.delivery.provider.toUpperCase()}: {order.delivery.status.replace(/_/g, " ")}</span>
                        </span>
                      )}
                      {order.delivery_slot && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 capitalize">
                          Slot: {order.delivery_slot.replace(/_/g, " ")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 mt-1">
                      Received on {formatDate(order.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-black text-orange-600">
                        {formatPrice(order.total_amount)}
                      </p>
                      <span className="text-[11px] text-stone-500 uppercase font-semibold">
                        {order.payment_method === "razorpay" ? "Razorpay Paid" : "Cash on Delivery"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body Grid: Dishes & Delivery Address */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Items */}
                  <div className="md:col-span-7 space-y-3">
                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Ordered Homemade Goods
                    </h3>
                    <div className="divide-y divide-orange-50 rounded-2xl bg-orange-50/40 p-4 border border-orange-100">
                      {order.items?.map((it) => (
                        <div key={it.id} className="py-2 flex justify-between text-xs font-medium">
                          <span className="text-stone-900 font-bold">
                            {it.quantity}x {it.food_name}
                          </span>
                          <span className="text-stone-700">
                            {formatPrice(it.total_price)}
                          </span>
                        </div>
                      ))}
                    </div>
                    {order.notes && (
                      <p className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                        <strong>Customer Note:</strong> {order.notes}
                      </p>
                    )}
                  </div>

                  {/* Customer & Address */}
                  <div className="md:col-span-5 space-y-3">
                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Customer & Drop Location
                    </h3>
                    <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-100 text-xs text-stone-600 space-y-1.5">
                      <p className="font-bold text-stone-900 text-sm">
                        {order.delivery_address?.name || "Customer"}
                      </p>
                      <div className="flex items-center gap-1.5 text-stone-700">
                        <Phone className="w-3.5 h-3.5 text-orange-600" />
                        <span>{order.delivery_address?.phone}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-stone-500 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                        <span>
                          {order.delivery_address?.address_line1}, {order.delivery_address?.city} ({order.delivery_address?.pincode})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kitchen Status Actions */}
                <div className="pt-4 border-t border-orange-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-700">
                      Kitchen Workflow Transition:
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateStatus(order.id, e.target.value as OrderStatus)
                      }
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Crafting in Kitchen</option>
                      <option value="ready_for_pickup">Ready for Pickup & Dispatch</option>
                      <option value="cancelled">Cancel Order</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {order.status === "confirmed" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "preparing")}
                        className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition flex items-center gap-1.5 shadow-sm shadow-orange-600/20"
                      >
                        <ChefHat className="w-3.5 h-3.5" />
                        <span>Start Preparing Batch</span>
                      </button>
                    )}

                    {order.status === "preparing" && (
                      <button
                        onClick={() => handleMarkReadyForPickup(order.id)}
                        disabled={isDispatching}
                        className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition flex items-center gap-1.5 shadow-sm shadow-orange-600/20 disabled:opacity-50"
                      >
                        {isDispatching ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Dispatching Delivery...</span>
                          </>
                        ) : (
                          <>
                            <Package className="w-3.5 h-3.5" />
                            <span>Mark Batch Ready & Pack</span>
                          </>
                        )}
                      </button>
                    )}

                    {order.status === "ready_for_pickup" && (
                      <div className="flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-1.5 rounded-xl text-xs">
                        <Bike className="w-4 h-4 text-orange-600 animate-pulse shrink-0" />
                        <span>
                          <strong>Courier Dispatched:</strong> Awaiting rider arrival at your kitchen.
                        </span>
                        {order.delivery?.tracking_id && (
                          <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-amber-200 font-bold">
                            {order.delivery.tracking_id}
                          </span>
                        )}
                      </div>
                    )}

                    {order.status === "out_for_delivery" && (
                      <div className="flex items-center gap-2 bg-orange-50 text-orange-900 border border-orange-200 px-3.5 py-1.5 rounded-xl text-xs">
                        <Bike className="w-4 h-4 text-orange-600 shrink-0" />
                        <span>
                          <strong>Out for Delivery:</strong> Courier is en route to customer doorstep.
                        </span>
                      </div>
                    )}

                    {order.status === "delivered" && (
                      <div className="flex items-center gap-2 bg-emerald-50 text-emerald-900 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          <strong>Delivered:</strong> Handshake OTP verified at doorstep.
                        </span>
                      </div>
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
