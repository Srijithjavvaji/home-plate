import React from "react";
import { CheckCircle2, Clock, ChefHat, PackageCheck, Bike, Home, AlertCircle } from "lucide-react";
import { OrderStatus } from "@/lib/supabase/types";

interface OrderStatusTrackerProps {
  status: OrderStatus;
  estimatedDelivery?: string;
}

const STEPS = [
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2, desc: "Order accepted" },
  { key: "preparing", label: "Preparing", icon: ChefHat, desc: "Home cook is cooking" },
  { key: "ready_for_pickup", label: "Ready", icon: PackageCheck, desc: "Packed fresh" },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Bike, desc: "Rider on the way" },
  { key: "delivered", label: "Delivered", icon: Home, desc: "Enjoy your meal!" },
];

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  status,
  estimatedDelivery,
}) => {
  if (status === "cancelled") {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
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
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-gray-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            Live Tracker
          </span>
          <h3 className="text-lg font-bold text-gray-900 mt-2">
            {STEPS[currentStepIndex]?.desc || "Processing your order"}
          </h3>
        </div>
        {estimatedDelivery && (
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-xl">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>
              Estimated arrival:{" "}
              <strong className="text-gray-900 font-semibold">
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
          <div className="absolute top-5 left-6 right-6 h-1 bg-gray-200 -z-0 hidden md:block" />

          {/* Active Connecting Bar */}
          <div
            className="absolute top-5 left-6 h-1 bg-emerald-600 transition-all duration-500 -z-0 hidden md:block"
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
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                        : isCurrent
                        ? "bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md shadow-emerald-600/40 animate-pulse"
                        : "bg-gray-100 text-gray-400 border border-gray-200"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p
                      className={`text-xs font-bold leading-tight ${
                        isCompleted || isCurrent ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
