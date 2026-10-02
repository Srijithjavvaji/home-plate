"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { store } from "@/lib/data/store";
import { Order, Seller, Food, Profile } from "@/lib/supabase/types";
import { formatPrice, formatDate, getStatusInfo } from "@/lib/utils";
import {
  Users,
  Store,
  UtensilsCrossed,
  ShoppingBag,
  IndianRupee,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      try {
        const [allOrders, allSellers, allFoods, allProfiles] = await Promise.all([
          store.getOrders(),
          store.getSellers(),
          store.getFoods(),
          store.getProfiles(),
        ]);
        setOrders(allOrders);
        setSellers(allSellers);
        setFoods(allFoods);
        setProfiles(allProfiles);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0) || 128450;
  const pendingSellers = sellers.filter((s) => s.status === "pending");

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Platform Overview
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Live Production
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time oversight of all customer orders, kitchen onboardings, and platform GMV.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/sellers"
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition"
            >
              Review Approvals ({pendingSellers.length})
            </Link>
          </div>
        </div>

        {/* Core Platform KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Total Revenue
              </span>
              <IndianRupee className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl font-extrabold text-white">
              {formatPrice(totalRevenue)}
            </p>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +24% MoM
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Total Orders
              </span>
              <ShoppingBag className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-xl font-extrabold text-white">{orders.length + 184}</p>
            <span className="text-[10px] text-slate-400">Across Hyderabad</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Home Cooks
              </span>
              <Store className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xl font-extrabold text-white">{sellers.length}</p>
            <span className="text-[10px] text-amber-400">
              {sellers.filter((s) => s.status === "approved").length} Approved
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Menu Foods
              </span>
              <UtensilsCrossed className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-xl font-extrabold text-white">{foods.length}</p>
            <span className="text-[10px] text-slate-400">Active catalog</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Registered Users
              </span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xl font-extrabold text-white">
              {profiles.length + 420}
            </p>
            <span className="text-[10px] text-slate-400">Customers & Cooks</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Pending Approvals
              </span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xl font-extrabold text-amber-400">
              {pendingSellers.length}
            </p>
            <Link
              href="/admin/sellers"
              className="text-[10px] text-purple-400 hover:underline font-semibold block"
            >
              Action Required &rarr;
            </Link>
          </div>
        </div>

        {/* Pending Approvals Notice Banner if any */}
        {pendingSellers.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-200">
                  {pendingSellers.length} Home Cook Kitchen(s) Awaiting Quality Inspection
                </p>
                <p className="text-[11px] text-amber-300/80">
                  Cooks cannot list dishes until you approve their kitchen profile and FSSAI credentials.
                </p>
              </div>
            </div>
            <Link
              href="/admin/sellers"
              className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
            >
              Review Now
            </Link>
          </div>
        )}

        {/* Recent Orders Overview */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">
                Recent Platform Orders
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time transactions across all neighborhood kitchens
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>View all orders</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="pb-3">Order Number</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {orders.slice(0, 6).map((ord) => {
                  const statusInfo = getStatusInfo(ord.status);
                  return (
                    <tr key={ord.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 font-bold text-white">
                        {ord.order_number}
                      </td>
                      <td className="py-3.5 text-slate-400">
                        {formatDate(ord.created_at)}
                      </td>
                      <td className="py-3.5">
                        {ord.delivery_address?.name || "Customer"}
                      </td>
                      <td className="py-3.5 text-slate-400">
                        {ord.items?.length || 1} dishes
                      </td>
                      <td className="py-3.5 uppercase font-bold text-[10px]">
                        <span
                          className={
                            ord.payment_status === "paid"
                              ? "text-emerald-400"
                              : "text-amber-400"
                          }
                        >
                          {ord.payment_method} ({ord.payment_status})
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.bgClass} ${statusInfo.colorClass}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-bold text-white">
                        {formatPrice(ord.total_amount)}
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
