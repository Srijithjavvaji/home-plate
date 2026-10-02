"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { Order, OrderStatus } from "@/lib/supabase/types";
import { formatPrice, formatDate, getStatusInfo } from "@/lib/utils";
import { useToast } from "@/lib/context/ToastContext";
import { ShoppingBag, Search, Filter } from "lucide-react";

export default function AdminOrdersPage() {
  const { success } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const loadOrders = async () => {
    const list = await store.getOrders();
    setOrders(list);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await store.updateOrderStatus(orderId, status);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    success("Status Updated", `Order ${orderId} is now ${status}`);
  };

  const filtered = orders.filter((o) => {
    if (filterStatus !== "all" && o.status !== filterStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchNum = o.order_number.toLowerCase().includes(q);
      const matchCust = o.delivery_address?.name?.toLowerCase().includes(q);
      if (!matchNum && !matchCust) return false;
    }
    return true;
  });

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              Platform Orders Oversight
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Monitor customer order fulfillment, delivery statuses, and payment settlements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready_for_pickup">Ready for Pickup</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold bg-slate-900/80">
                  <th className="py-3.5 px-6">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer & Phone</th>
                  <th className="py-3.5 px-4">Dishes</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-6 text-right">Status Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {filtered.map((ord) => {
                  const statusInfo = getStatusInfo(ord.status);
                  return (
                    <tr key={ord.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-4 px-6">
                        <p className="font-bold text-white text-sm">
                          {ord.order_number}
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          {formatDate(ord.created_at)}
                        </p>
                      </td>

                      <td className="py-4 px-4">
                        <p className="text-white font-medium">
                          {ord.delivery_address?.name || "Customer"}
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          {ord.delivery_address?.phone}
                        </p>
                      </td>

                      <td className="py-4 px-4 text-slate-400">
                        {ord.items?.map((it) => (
                          <div key={it.id} className="truncate max-w-xs">
                            {it.quantity}x {it.food_name}
                          </div>
                        ))}
                      </td>

                      <td className="py-4 px-4 uppercase font-bold text-[10px]">
                        <span
                          className={
                            ord.payment_status === "paid"
                              ? "text-emerald-400"
                              : "text-amber-400"
                          }
                        >
                          {ord.payment_method} ({ord.payment_status})
                        </span>
                        {ord.razorpay_payment_id && (
                          <p className="font-mono text-slate-500 text-[9px] lowercase">
                            {ord.razorpay_payment_id}
                          </p>
                        )}
                      </td>

                      <td className="py-4 px-4 font-bold text-white text-sm">
                        {formatPrice(ord.total_amount)}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <select
                          value={ord.status}
                          onChange={(e) =>
                            handleStatusChange(ord.id, e.target.value as OrderStatus)
                          }
                          className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:border-purple-500"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready_for_pickup">Ready for Pickup</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
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
