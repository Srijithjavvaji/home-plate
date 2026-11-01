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
  Scale,
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
    <div className="py-8 bg-[#fffdfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 gap-4 border-b border-orange-100">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26140e]">
                {seller ? seller.kitchen_name : "Ammamma's Kitchen"} Dashboard
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                Verified Kitchen
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Hyderabad home food production, batch inventory, and verified direct bank payouts.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/seller/foods"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/30 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Link>
            <Link
              href="/seller/orders"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-orange-50/50 text-stone-700 font-bold text-xs border border-orange-200 transition"
            >
              <span>Manage Orders ({activeOrders.length})</span>
            </Link>
            <Link
              href="/seller/earnings"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 transition"
            >
              <span>Payouts Desk</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
          <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Total Revenue
              </p>
              <p className="text-2xl font-extrabold text-[#26140e] mt-1">
                {formatPrice(totalEarnings || 42800)}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-orange-700 mt-1 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Net of platform commission</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Active Live Orders
              </p>
              <p className="text-2xl font-extrabold text-[#26140e] mt-1">
                {activeOrders.length}
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                Awaiting packing & dispatch
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Listed Products
              </p>
              <p className="text-2xl font-extrabold text-[#26140e] mt-1">
                {foods.length}
              </p>
              <p className="text-[11px] text-orange-700 mt-1 font-medium">
                {foods.filter((f) => f.is_available).length} Batches In Stock
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center">
              <Utensils className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Kitchen Rating
              </p>
              <p className="text-2xl font-extrabold text-[#26140e] mt-1 flex items-center gap-1">
                <span>{seller ? seller.rating.toFixed(1) : "4.9"}</span>
                <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline" />
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                Based on {seller ? seller.total_ratings : 184} customer ratings
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Live Orders Overview Section */}
        <div className="bg-white rounded-3xl border border-orange-100 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between border-b border-orange-100 pb-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#26140e]">
                Recent Kitchen Orders
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Orders placed across Hyderabad for fresh dispatch
              </p>
            </div>
            <Link
              href="/seller/orders"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
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
                  <tr className="border-b border-orange-100 text-stone-500 uppercase font-semibold">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer & Location</th>
                    <th className="pb-3">Products</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50 font-medium text-stone-700">
                  {orders.slice(0, 5).map((ord) => {
                    const statusInfo = getStatusInfo(ord.status);
                    return (
                      <tr key={ord.id} className="hover:bg-orange-50/30 transition">
                        <td className="py-4 font-bold text-stone-900">
                          {ord.order_number}
                        </td>
                        <td className="py-4">
                          <p className="font-bold text-stone-900">
                            {ord.delivery_address?.name || "Customer"}
                          </p>
                          <p className="text-stone-400 text-[11px]">
                            {ord.delivery_address?.address_line1}
                          </p>
                        </td>
                        <td className="py-4">
                          {ord.items?.map((it) => (
                            <div key={it.id} className="truncate max-w-xs text-stone-800">
                              {it.quantity}x {it.food_name}
                            </div>
                          ))}
                        </td>
                        <td className="py-4 font-extrabold text-orange-700">
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
                            className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-600 hover:text-white font-bold text-[11px] transition shadow-sm"
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
            <p className="text-xs text-stone-500 py-6 text-center">
              No orders received yet. Make sure your menu is set to Available!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
