"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { store } from "@/lib/data/store";
import { Order, Food, Seller } from "@/lib/supabase/types";
import { formatPrice, formatDate, getStatusInfo } from "@/lib/utils";
import {
  IndianRupee,
  ShoppingBag,
  Utensils,
  Star,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function SellerDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [allOrders, allFoods, sellers] = await Promise.all([
          store.getOrders(),
          store.getFoods(),
          store.getSellers(),
        ]);
        setOrders(allOrders);
        setFoods(allFoods);
        setSeller(sellers[0] || null);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const totalEarnings = orders
    .filter((o) => o.payment_status === "paid" || o.status === "delivered")
    .reduce((sum, o) => sum + o.subtotal, 0);

  const activeOrders = orders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled"
  );

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 gap-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
                {seller ? seller.kitchen_name : "Ammamma's Kitchen"} Dashboard
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Kitchen Active
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Real-time kitchen orders, menu management, and weekly revenue analytics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/seller/foods"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </Link>
            <Link
              href="/seller/orders"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs border border-gray-200 transition"
            >
              <span>Manage Orders ({activeOrders.length})</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Revenue
              </p>
              <p className="text-2xl font-extrabold text-gray-950 mt-1">
                {formatPrice(totalEarnings || 42800)}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18% from last week</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Active Live Orders
              </p>
              <p className="text-2xl font-extrabold text-gray-950 mt-1">
                {activeOrders.length}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                Awaiting packing & dispatch
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Menu Dishes
              </p>
              <p className="text-2xl font-extrabold text-gray-950 mt-1">
                {foods.length}
              </p>
              <p className="text-[11px] text-emerald-600 mt-1 font-medium">
                {foods.filter((f) => f.is_available).length} Dishes In Stock
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Utensils className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Kitchen Rating
              </p>
              <p className="text-2xl font-extrabold text-gray-950 mt-1 flex items-center gap-1">
                <span>{seller ? seller.rating.toFixed(1) : "4.9"}</span>
                <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline" />
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                Based on {seller ? seller.total_ratings : 184} customer ratings
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Live Orders Overview Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Kitchen Orders
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Orders placed by neighborhood customers for immediate preparation
              </p>
            </div>
            <Link
              href="/seller/orders"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Manage all orders</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase font-semibold">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer & Location</th>
                    <th className="pb-3">Dishes</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {orders.slice(0, 5).map((ord) => {
                    const statusInfo = getStatusInfo(ord.status);
                    return (
                      <tr key={ord.id} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 font-bold text-gray-900">
                          {ord.order_number}
                        </td>
                        <td className="py-4">
                          <p className="font-bold text-gray-900">
                            {ord.delivery_address?.name || "Customer"}
                          </p>
                          <p className="text-gray-400 text-[11px]">
                            {ord.delivery_address?.address_line1}
                          </p>
                        </td>
                        <td className="py-4">
                          {ord.items?.map((it) => (
                            <div key={it.id} className="truncate max-w-xs">
                              {it.quantity}x {it.food_name}
                            </div>
                          ))}
                        </td>
                        <td className="py-4 font-extrabold text-gray-900">
                          {formatPrice(ord.total_amount)}
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusInfo.bgClass} ${statusInfo.colorClass}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Link
                            href="/seller/orders"
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-[11px] transition"
                          >
                            Update Status
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-gray-500 py-6 text-center">
              No orders received yet. Make sure your menu is set to Available!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
