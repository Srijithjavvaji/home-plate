"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { Delivery, DeliveryStatus } from "@/lib/supabase/types";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/lib/context/ToastContext";
import {
  Bike,
  Search,
  Filter,
  RefreshCw,
  MapPin,
  Store,
  Phone,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Eye,
} from "lucide-react";

export default function AdminDeliveriesPage() {
  const { success, error: toastError } = useToast();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  const loadDeliveries = async () => {
    setIsRefreshing(true);
    try {
      const list = await store.getDeliveries();
      setDeliveries(list);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const handleLiveSync = async (deliveryId: string) => {
    try {
      const res = await fetch(`/api/delivery/status?delivery_id=${encodeURIComponent(deliveryId)}`);
      const data = await res.json();
      if (res.ok && data.delivery) {
        setDeliveries((prev) =>
          prev.map((d) => (d.id === deliveryId ? data.delivery : d))
        );
        success("Logistics Synced", `Latest status from ${data.provider.toUpperCase()} synced.`);
      } else {
        toastError(data.error || "Failed to sync status");
      }
    } catch {
      toastError("Network error syncing delivery status");
    }
  };

  const handleCancelDelivery = async (deliveryId: string) => {
    const reason = prompt("Enter cancellation reason for logistics partner:");
    if (!reason) return;

    try {
      const res = await fetch("/api/delivery/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delivery_id: deliveryId, reason }),
      });
      const data = await res.json();
      if (res.ok) {
        success("Delivery Cancelled", "Logistics dispatch has been cancelled.");
        loadDeliveries();
      } else {
        toastError(data.error || "Cancellation failed");
      }
    } catch {
      toastError("Failed to cancel delivery");
    }
  };

  // Filter deliveries according to status & search query
  const filtered = deliveries.filter((d) => {
    if (filterStatus !== "all" && d.status !== filterStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTrack = d.tracking_id?.toLowerCase().includes(q);
      const matchOrder = d.order?.order_number?.toLowerCase().includes(q);
      const matchRider = d.rider_name?.toLowerCase().includes(q);
      const matchDrop = d.drop_address?.toLowerCase().includes(q);
      if (!matchTrack && !matchOrder && !matchRider && !matchDrop) return false;
    }
    return true;
  });

  // Calculate statistics
  const totalCount = deliveries.length;
  const activeCount = deliveries.filter(
    (d) =>
      d.status === "requested" ||
      d.status === "assigned" ||
      d.status === "arrived_pickup" ||
      d.status === "picked_up" ||
      d.status === "out_for_delivery" ||
      d.status === "arrived_customer"
  ).length;
  const deliveredCount = deliveries.filter((d) => d.status === "delivered").length;
  const failedCount = deliveries.filter(
    (d) => d.status === "failed" || d.status === "serviceability_failed" || d.status === "cancelled"
  ).length;

  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case "pending":
        return "bg-slate-800 text-slate-300 border-slate-700";
      case "serviceability_failed":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      case "requested":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "assigned":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "arrived_pickup":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
      case "picked_up":
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/40";
      case "out_for_delivery":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "arrived_customer":
        return "bg-teal-500/20 text-teal-300 border-teal-500/40";
      case "delivered":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "cancelled":
        return "bg-slate-700 text-slate-400 border-slate-600";
      case "failed":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Title & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">
                Logistics & Deliveries Oversight
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Partner: SHADOWFAX
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live tracking, rider allotment, fleet SLA verification, and dispatch management.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDeliveries}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Refresh Fleet Status</span>
            </button>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Dispatches</span>
              <Bike className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-2xl font-extrabold text-white mt-2">{totalCount}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Across all partners</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-400">Active In-Transit</span>
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-extrabold text-blue-400 mt-2">{activeCount}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Dispatched & on the road</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400">Delivered</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-400 mt-2">{deliveredCount}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Verified by courier partner</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-400">Exceptions / Failed</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-extrabold text-rose-400 mt-2">{failedCount}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Cancelled or unserviceable</p>
          </div>
        </div>

        {/* Filter Toolbar: 11 Status Filters */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-bold text-slate-300 mr-2">Filter by Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-purple-500 font-semibold"
            >
              <option value="all">All Statuses ({totalCount})</option>
              <option value="pending">1. Pending</option>
              <option value="serviceability_failed">2. Serviceability Failed</option>
              <option value="requested">3. Delivery Requested</option>
              <option value="assigned">4. Assigned</option>
              <option value="arrived_pickup">5. Arrived at Pickup</option>
              <option value="picked_up">6. Picked Up</option>
              <option value="out_for_delivery">7. Out for Delivery</option>
              <option value="arrived_customer">8. Arrived at Customer</option>
              <option value="delivered">9. Delivered</option>
              <option value="cancelled">10. Cancelled</option>
              <option value="failed">11. Failed</option>
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Order, Tracking ID, Rider..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-purple-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Deliveries Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold bg-slate-900/80">
                  <th className="py-3.5 px-6">Tracking & Order</th>
                  <th className="py-3.5 px-4">Provider & Status</th>
                  <th className="py-3.5 px-4">Pickup Point</th>
                  <th className="py-3.5 px-4">Drop Location</th>
                  <th className="py-3.5 px-4">Assigned Courier</th>
                  <th className="py-3.5 px-4">Dispatched At</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No deliveries found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((del) => {
                    const badgeClass = getStatusBadge(del.status);
                    return (
                      <tr key={del.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-4 px-6">
                          <p className="font-mono font-bold text-white text-sm">
                            {del.tracking_id || "Unassigned"}
                          </p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Order: {del.order?.order_number || del.order_id}
                          </p>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-bold text-[10px] uppercase text-emerald-400 block">
                            {del.provider}
                          </span>
                          <span
                            className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border mt-1 capitalize ${badgeClass}`}
                          >
                            {del.status.replace(/_/g, " ")}
                          </span>
                        </td>

                        <td className="py-4 px-4 max-w-[200px]">
                          <p className="truncate text-white text-[11px]">
                            {del.pickup_address}
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono">
                            PIN: {del.pickup_pincode}
                          </span>
                        </td>

                        <td className="py-4 px-4 max-w-[200px]">
                          <p className="truncate text-white text-[11px]">
                            {del.drop_address}
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono">
                            PIN: {del.drop_pincode}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          {del.rider_name ? (
                            <div>
                              <p className="font-bold text-purple-300 text-[11px]">
                                {del.rider_name}
                              </p>
                              {del.rider_phone && (
                                <p className="text-slate-400 text-[10px] flex items-center gap-1">
                                  <Phone className="w-2.5 h-2.5" />
                                  <span>{del.rider_phone}</span>
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-500 italic text-[11px]">
                              Awaiting allotment
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 text-slate-400 text-[11px]">
                          {formatDate(del.created_at)}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedDelivery(del)}
                              title="Inspect Delivery Details & History"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleLiveSync(del.id)}
                              title="Sync Live Status from Partner"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            {del.status !== "delivered" && del.status !== "cancelled" && (
                              <button
                                onClick={() => handleCancelDelivery(del.id)}
                                title="Cancel Dispatch"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-rose-400 transition"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delivery Inspector Modal */}
        {selectedDelivery && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold">
                    Delivery Inspection: {selectedDelivery.tracking_id}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Order Ref: {selectedDelivery.order?.order_number || selectedDelivery.order_id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDelivery(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Status & Rider Overview */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <span className="text-slate-400">Current Status:</span>
                  <p className="font-bold text-sm text-emerald-400 uppercase">
                    {selectedDelivery.status.replace(/_/g, " ")}
                  </p>
                  <p className="text-slate-400 pt-1">
                    Logistics Partner: <strong>{selectedDelivery.provider.toUpperCase()}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <span className="text-slate-400">Rider Allotted:</span>
                  <p className="font-bold text-sm text-purple-300">
                    {selectedDelivery.rider_name || "Unassigned"}
                  </p>
                  <p className="text-slate-400 pt-1">
                    Phone: {selectedDelivery.rider_phone || "N/A"}
                  </p>
                </div>
              </div>

              {/* Failure Reason if present */}
              {selectedDelivery.failure_reason && (
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300">
                  <p className="font-bold mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Exception / Failure Detail:</span>
                  </p>
                  <p>{selectedDelivery.failure_reason}</p>
                </div>
              )}

              {/* Route Endpoints */}
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">
                    Pickup Kitchen:
                  </span>
                  <p className="font-medium text-slate-200 mt-0.5">
                    {selectedDelivery.pickup_address} (PIN: {selectedDelivery.pickup_pincode})
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">
                    Drop Customer Doorstep:
                  </span>
                  <p className="font-medium text-slate-200 mt-0.5">
                    {selectedDelivery.drop_address} (PIN: {selectedDelivery.drop_pincode})
                  </p>
                </div>
              </div>

              {/* Status History Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Status Timeline & Webhook Log
                </h4>
                <div className="divide-y divide-slate-800 bg-slate-800/40 rounded-2xl border border-slate-800 p-4 text-xs">
                  {selectedDelivery.status_history && selectedDelivery.status_history.length > 0 ? (
                    selectedDelivery.status_history.map((h, i) => (
                      <div key={i} className="py-2.5 first:pt-0 last:pb-0 flex justify-between gap-4">
                        <div>
                          <span className="font-bold text-white capitalize">
                            {h.status.replace(/_/g, " ")}
                          </span>
                          <p className="text-slate-400 text-[11px] mt-0.5">{h.description}</p>
                        </div>
                        <span className="text-slate-500 font-mono text-[10px] shrink-0">
                          {formatDate(h.timestamp)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 py-2 text-center">No status history recorded yet.</p>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                {selectedDelivery.tracking_url ? (
                  <a
                    href={selectedDelivery.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>External Partner Tracking</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-slate-500 text-xs">No external tracking URL</span>
                )}
                <button
                  onClick={() => setSelectedDelivery(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
