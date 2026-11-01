"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  ChefHat,
  PackageCheck,
  Bike,
  Home,
  AlertCircle,
  ShieldCheck,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { OrderStatus, Delivery } from "@/lib/supabase/types";

interface OrderStatusTrackerProps {
  status: OrderStatus;
  estimatedDelivery?: string;
  delivery?: Delivery | null;
  scheduledAt?: string;
  deliverySlot?: string;
}

const STEPS = [
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2, desc: "Order accepted by home kitchen" },
  { key: "preparing", label: "Crafting Batch", icon: ChefHat, desc: "Homemaker is cooking fresh" },
  { key: "ready_for_pickup", label: "Packed & Sealed", icon: PackageCheck, desc: "Awaiting courier pickup" },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Bike, desc: "Rider navigating to doorstep" },
  { key: "delivered", label: "Delivered", icon: Home, desc: "Enjoy your homemade goodness!" },
];

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  status,
  estimatedDelivery,
  delivery,
  scheduledAt,
  deliverySlot,
}) => {
  if (status === "cancelled") {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-rose-900">Order Cancelled</h4>
        <p className="text-xs text-rose-700 mt-1 max-w-sm mx-auto">
          This order was cancelled. Any amount deducted will be refunded to your source payment method within 3-5 business days.
        </p>
      </div>
    );
  }

  // Determine active step index
  let currentStepIndex = 0;
  if (status === "pending" || status === "payment_pending") {
    currentStepIndex = 0;
  } else if (status === "paid" || status === "confirmed") {
    currentStepIndex = 0;
  } else if (status === "preparing") {
    currentStepIndex = 1;
  } else if (status === "ready_for_pickup") {
    currentStepIndex = 2;
  } else if (status === "out_for_delivery") {
    currentStepIndex = 3;
  } else if (status === "delivered") {
    currentStepIndex = 4;
  }

  return (
    <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-sm">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-orange-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-800 bg-orange-100/80 px-2.5 py-1 rounded-full">
              Live Fulfillment
            </span>
            {delivery?.provider && (
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{delivery.provider.toUpperCase()} Logistics</span>
              </span>
            )}
            {deliverySlot && (
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                Slot: {deliverySlot.toUpperCase()}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-[#26140e] mt-2">
            {STEPS[currentStepIndex]?.desc || "Processing your order"}
          </h3>
          {delivery?.rider_name && (
            <p className="text-xs text-orange-700 font-semibold mt-1">
              Rider: {delivery.rider_name} {delivery.rider_phone ? `(${delivery.rider_phone})` : ""}
            </p>
          )}
        </div>

        {estimatedDelivery && (
          <div className="flex items-center gap-2 text-xs text-stone-600 bg-orange-50/50 px-3.5 py-2 rounded-2xl border border-orange-200">
            <Clock className="w-4 h-4 text-orange-600" />
            <span>
              Estimated arrival:{" "}
              <strong className="text-stone-900 font-bold">
                {new Date(estimatedDelivery).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Steps Visual Tracker */}
      <div className="mt-8">
        <div className="relative">
          {/* Background Connecting Bar */}
          <div className="absolute top-5 left-6 right-6 h-1 bg-stone-200 -z-0 hidden md:block" />

          {/* Active Connecting Bar */}
          <div
            className="absolute top-5 left-6 h-1 bg-orange-600 transition-all duration-500 -z-0 hidden md:block"
            style={{
              width: `${(currentStepIndex / (STEPS.length - 1)) * 90}%`,
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.key} className="flex md:flex-col items-center gap-3.5 md:text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                      isCompleted
                        ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                        : isCurrent
                        ? "bg-orange-600 text-white ring-4 ring-orange-100 shadow-md shadow-orange-600/40 animate-pulse"
                        : "bg-stone-100 text-stone-400 border border-stone-200"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p
                      className={`text-xs font-bold leading-tight ${
                        isCompleted || isCurrent ? "text-stone-900" : "text-stone-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Doorstep Delivery OTP Handshake Card */}
      {delivery?.delivery_otp && (
        <div className="mt-8 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-2 border-orange-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-600/30 shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-orange-950">
                  Doorstep Delivery Confirmation PIN
                </span>
                {delivery.otp_verified ? (
                  <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                    Handshake Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                    Share at Doorstep
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Share this 4-digit code with the courier rider upon delivery to safely confirm receipt.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-orange-300 shadow-sm shrink-0">
            <span className="text-2xl font-black tracking-widest text-[#26140e] font-mono">
              {delivery.delivery_otp}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
