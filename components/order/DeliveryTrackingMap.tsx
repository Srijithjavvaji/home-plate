"use client";

import React, { useState } from "react";
import { Delivery, DeliveryStatus } from "@/lib/supabase/types";
import {
  MapPin,
  Bike,
  Store,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Phone,
  Compass,
} from "lucide-react";

interface DeliveryTrackingMapProps {
  delivery?: Delivery | null;
  orderNumber: string;
  orderStatus: string;
}

export const DeliveryTrackingMap: React.FC<DeliveryTrackingMapProps> = ({
  delivery,
  orderNumber,
  orderStatus,
}) => {
  const [copied, setCopied] = useState(false);

  const getStatusBadge = (status?: DeliveryStatus) => {
    switch (status) {
      case "assigned":
        return { label: "Rider Assigned", bg: "bg-blue-50 text-blue-700 border-blue-200" };
      case "arrived_pickup":
        return { label: "Rider at Kitchen", bg: "bg-amber-50 text-amber-700 border-amber-200" };
      case "picked_up":
        return { label: "Picked Up by Courier", bg: "bg-indigo-50 text-indigo-700 border-indigo-200" };
      case "out_for_delivery":
        return { label: "Out for Delivery", bg: "bg-purple-50 text-purple-700 border-purple-200" };
      case "arrived_customer":
        return { label: "Rider at Doorstep", bg: "bg-teal-50 text-teal-700 border-teal-200" };
      case "delivered":
        return { label: "Successfully Delivered", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case "failed":
      case "serviceability_failed":
        return { label: "Delivery Exception", bg: "bg-rose-50 text-rose-700 border-rose-200" };
      case "cancelled":
        return { label: "Delivery Cancelled", bg: "bg-gray-100 text-gray-700 border-gray-300" };
      case "requested":
      default:
        return { label: "Courier Dispatch Requested", bg: "bg-amber-50 text-amber-700 border-amber-200" };
    }
  };

  const badge = getStatusBadge(delivery?.status);

  // Approximate relative position on schematic map:
  // Pickup is left (20%), Drop is right (80%)
  // Rider position interpolates along route depending on status
  let riderProgressPercent = 20;
  if (delivery?.status === "assigned") riderProgressPercent = 10;
  else if (delivery?.status === "arrived_pickup") riderProgressPercent = 20;
  else if (delivery?.status === "picked_up") riderProgressPercent = 35;
  else if (delivery?.status === "out_for_delivery") riderProgressPercent = 60;
  else if (delivery?.status === "arrived_customer" || delivery?.status === "delivered") riderProgressPercent = 80;

  const copyTrackingId = () => {
    if (delivery?.tracking_id) {
      navigator.clipboard.writeText(delivery.tracking_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-gray-50/50 to-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Logistics Provider: {delivery?.provider ? delivery.provider.toUpperCase() : "SHADOWFAX HYPERLOCAL"}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badge.bg}`}>
              {badge.label}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mt-2 flex items-center gap-2">
            <span>Live Hyperlocal Delivery Route</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </h3>
        </div>

        {delivery?.tracking_id && (
          <div className="flex items-center gap-2">
            <button
              onClick={copyTrackingId}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition text-gray-700"
              title="Click to copy tracking ID"
            >
              {copied ? "Copied!" : `Tracking ID: ${delivery.tracking_id}`}
            </button>
            {delivery.tracking_url && (
              <a
                href={delivery.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <span>Partner Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Interactive Schematic Delivery Route Canvas */}
      <div className="relative bg-slate-900 text-white p-6 sm:p-10 min-h-[260px] flex flex-col justify-between overflow-hidden">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top Info Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: "12s" }} />
            <span>Hyperlocal Corridor: Hyderabad Cyberabad Hub</span>
          </div>
          {delivery?.estimated_delivery_at && (
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-200">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Estimated Delivery:{" "}
                <strong className="text-white font-bold">
                  {new Date(delivery.estimated_delivery_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* Route Line with Waypoints */}
        <div className="relative z-10 my-10 px-4 sm:px-12">
          {/* Base Track */}
          <div className="h-2 w-full bg-slate-800 rounded-full relative overflow-hidden">
            {/* Animated Active Route */}
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${riderProgressPercent}%` }}
            />
          </div>

          {/* Waypoint 1: Kitchen Pickup Point */}
          <div className="absolute top-1/2 left-4 sm:left-12 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center group">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 border-2 border-emerald-400">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-white mt-2">Kitchen</span>
            <span className="text-[9px] text-slate-400 max-w-[100px] text-center truncate">
              {delivery?.pickup_pincode || "500081"}
            </span>
          </div>

          {/* Dynamic Rider Marker (if active/moving) */}
          {(delivery?.status === "assigned" ||
            delivery?.status === "arrived_pickup" ||
            delivery?.status === "picked_up" ||
            delivery?.status === "out_for_delivery") && (
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-700 z-20"
              style={{ left: `${riderProgressPercent}%` }}
            >
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center ring-4 ring-purple-400/40 shadow-xl shadow-purple-600/40 animate-pulse">
                <Bike className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold text-purple-300 mt-1.5 whitespace-nowrap bg-slate-900/90 px-2 py-0.5 rounded-full border border-purple-500/40">
                {delivery.rider_name || "Shadowfax Rider"}
              </span>
            </div>
          )}

          {/* Waypoint 2: Customer Drop Point */}
          <div className="absolute top-1/2 right-4 sm:right-12 -translate-y-1/2 translate-x-1/2 flex flex-col items-center group">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-2 ${
                delivery?.status === "delivered"
                  ? "bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/30"
                  : "bg-slate-800 text-slate-300 border-slate-700"
              }`}
            >
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-white mt-2">Doorstep</span>
            <span className="text-[9px] text-slate-400 max-w-[100px] text-center truncate">
              {delivery?.drop_pincode || "500081"}
            </span>
          </div>
        </div>

        {/* Bottom Status Banner */}
        <div className="relative z-10 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Real-time webhook synchronization enabled with <strong>Shadowfax Fleet API</strong>
            </span>
          </div>
          {delivery?.rider_phone && (
            <a
              href={`tel:${delivery.rider_phone}`}
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Rider: {delivery.rider_phone}</span>
            </a>
          )}
        </div>
      </div>

      {/* Address & Logistics Cards Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50">
        {/* Pickup Details */}
        <div className="p-4 rounded-2xl bg-white border border-gray-100 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
            <Store className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pickup Point (Kitchen)</span>
          </div>
          <p className="font-bold text-gray-900 text-sm pt-1">
            {delivery?.pickup_address || "Home Plate Certified Home Kitchen"}
          </p>
          <p className="text-gray-500">PIN: {delivery?.pickup_pincode || "500081"}</p>
          {delivery?.actual_pickup_at && (
            <p className="text-emerald-700 font-semibold text-[11px] pt-1">
              Collected at: {new Date(delivery.actual_pickup_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>

        {/* Drop Details */}
        <div className="p-4 rounded-2xl bg-white border border-gray-100 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            <span>Delivery Point (Customer)</span>
          </div>
          <p className="font-bold text-gray-900 text-sm pt-1">
            {delivery?.drop_address || "Customer Delivery Address"}
          </p>
          <p className="text-gray-500">PIN: {delivery?.drop_pincode || "500081"}</p>
          {delivery?.actual_delivery_at && (
            <p className="text-emerald-700 font-semibold text-[11px] pt-1">
              Delivered at: {new Date(delivery.actual_delivery_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
