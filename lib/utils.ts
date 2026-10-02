import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { OrderStatus } from "./supabase/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getStatusInfo(status: OrderStatus): {
  label: string;
  colorClass: string;
  bgClass: string;
  step: number;
} {
  switch (status) {
    case "pending":
    case "payment_pending":
      return {
        label: "Payment Pending",
        colorClass: "text-amber-700",
        bgClass: "bg-amber-50 border-amber-200",
        step: 0,
      };
    case "paid":
    case "confirmed":
      return {
        label: "Order Confirmed",
        colorClass: "text-blue-700",
        bgClass: "bg-blue-50 border-blue-200",
        step: 1,
      };
    case "preparing":
      return {
        label: "Kitchen Preparing",
        colorClass: "text-emerald-700",
        bgClass: "bg-emerald-50 border-emerald-200",
        step: 2,
      };
    case "ready_for_pickup":
      return {
        label: "Ready for Pickup",
        colorClass: "text-indigo-700",
        bgClass: "bg-indigo-50 border-indigo-200",
        step: 3,
      };
    case "out_for_delivery":
      return {
        label: "Out for Delivery",
        colorClass: "text-purple-700",
        bgClass: "bg-purple-50 border-purple-200",
        step: 4,
      };
    case "delivered":
      return {
        label: "Delivered",
        colorClass: "text-green-800",
        bgClass: "bg-green-100 border-green-300",
        step: 5,
      };
    case "cancelled":
      return {
        label: "Cancelled",
        colorClass: "text-rose-700",
        bgClass: "bg-rose-50 border-rose-200",
        step: -1,
      };
    default:
      return {
        label: status,
        colorClass: "text-gray-700",
        bgClass: "bg-gray-50 border-gray-200",
        step: 0,
      };
  }
}
