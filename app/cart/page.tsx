"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/context/CartContext";
import { useToast } from "@/lib/context/ToastContext";
import { formatPrice } from "@/lib/utils";
import { VegBadge } from "@/components/food/VegBadge";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  ShieldCheck,
  CheckCircle2,
  X,
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { success, error: toastError } = useToast();

  const [couponInput, setCouponInput] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput.trim());
    if (res.success) {
      success("Coupon Applied!", res.message);
      setCouponInput("");
    } else {
      toastError("Coupon Failed", res.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-16 px-4">
        <div className="text-center max-w-md bg-white rounded-3xl p-10 border border-gray-100 shadow-card">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-950">
            Your Cart is Empty
          </h2>
          <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">
            Good homemade food is cooking right now in your neighborhood. Discover fresh dishes and add them to your cart!
          </p>
          <Link
            href="/foods"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <span>Explore Homemade Foods</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
              Your Food Cart
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Review your items before proceeding to checkout
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold hover:underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
              {items.map(({ food, quantity }) => (
                <div key={food.id} className="p-4 sm:p-6 flex items-center gap-4">
                  {/* Food Image */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={food.image_url}
                      alt={food.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Food Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <VegBadge isVeg={food.is_veg} size="sm" />
                      <span className="text-[11px] text-gray-400 font-medium truncate">
                        {food.serving_info}
                      </span>
                    </div>

                    <Link
                      href={`/foods/${food.id}`}
                      className="font-bold text-gray-900 text-sm hover:text-emerald-700 transition truncate block"
                    >
                      {food.name}
                    </Link>

                    <p className="text-xs font-semibold text-gray-950 mt-1">
                      {formatPrice(food.price)} each
                    </p>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 border border-gray-200">
                    <button
                      onClick={() => updateQuantity(food.id, -1)}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-gray-700 hover:bg-gray-200 transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-5 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(food.id, 1)}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-gray-700 hover:bg-gray-200 transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Item Subtotal & Delete */}
                  <div className="text-right pl-2 shrink-0">
                    <p className="text-sm font-extrabold text-gray-950">
                      {formatPrice(food.price * quantity)}
                    </p>
                    <button
                      onClick={() => removeItem(food.id)}
                      className="text-gray-400 hover:text-rose-600 transition p-1 mt-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Delivery Guarantee Note */}
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3 text-xs text-emerald-900">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>100% Home Cook Guarantee:</strong> Every meal is cooked fresh in verified domestic kitchens and packed hot.
              </span>
            </div>
          </div>

          {/* Bill Summary & Coupons */}
          <div className="lg:col-span-4 space-y-4">
            {/* Promo Coupon Card */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Offers & Coupons
                </h3>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div>
                    <div className="flex items-center gap-1 font-bold text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{appliedCoupon.code}</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      {appliedCoupon.description}
                    </p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 text-gray-400 hover:text-rose-600 transition"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter WELCOME50 or HOMEPLATE10"
                    className="flex-1 uppercase bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Coupon Suggestions */}
              {!appliedCoupon && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <button
                    onClick={() => applyCoupon("WELCOME50")}
                    className="text-[10px] font-semibold bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 px-2 py-1 rounded-lg border border-dashed border-gray-300 transition"
                  >
                    WELCOME50 (₹50 off)
                  </button>
                  <button
                    onClick={() => applyCoupon("HOMEPLATE10")}
                    className="text-[10px] font-semibold bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 px-2 py-1 rounded-lg border border-dashed border-gray-300 transition"
                  >
                    HOMEPLATE10 (10% off)
                  </button>
                  <button
                    onClick={() => applyCoupon("FREESHIP")}
                    className="text-[10px] font-semibold bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 px-2 py-1 rounded-lg border border-dashed border-gray-300 transition"
                  >
                    FREESHIP (Free Delivery)
                  </button>
                </div>
              )}
            </div>

            {/* Bill Details */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
                Bill Summary
              </h3>

              <div className="space-y-2.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Delivery Partner Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="font-bold text-emerald-700 uppercase text-[11px] bg-emerald-50 px-1.5 py-0.5 rounded">
                      FREE
                    </span>
                  ) : (
                    <span className="font-semibold text-gray-900">
                      {formatPrice(deliveryFee)}
                    </span>
                  )}
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount Savings</span>
                    <span>- {formatPrice(discount)}</span>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline text-base font-extrabold text-gray-950">
                  <span>Total Amount</span>
                  <span className="text-xl text-emerald-700">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => router.push("/checkout")}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
