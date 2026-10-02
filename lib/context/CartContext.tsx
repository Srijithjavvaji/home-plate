"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Food, Coupon } from "../supabase/types";
import { INITIAL_COUPONS } from "../data/mock-data";

export interface CartItem {
  id: string;
  food: Food;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (food: Food, quantity?: number) => void;
  removeItem: (foodId: string) => void;
  updateQuantity: (foodId: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  totalItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("homeplate_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem("homeplate_coupon");
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.error("Cart localStorage error:", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("homeplate_cart", JSON.stringify(items));
    } catch (e) {
      console.error("Cart save error:", e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem("homeplate_coupon", JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem("homeplate_coupon");
      }
    } catch (e) {
      console.error("Coupon save error:", e);
    }
  }, [appliedCoupon]);

  const addItem = (food: Food, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.food.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id: `cart_${Date.now()}_${food.id}`, food, quantity }];
    });
  };

  const removeItem = (foodId: string) => {
    setItems((prev) => prev.filter((item) => item.food.id !== foodId));
  };

  const updateQuantity = (foodId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.food.id === foodId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0
  );

  const baseDeliveryFee = subtotal > 0 ? 40 : 0;

  // Coupon calculations
  let discount = 0;
  let deliveryFee = baseDeliveryFee;

  if (appliedCoupon && subtotal >= appliedCoupon.min_order_amount) {
    if (appliedCoupon.code === "FREESHIP") {
      deliveryFee = 0;
    } else if (appliedCoupon.discount_type === "fixed") {
      discount = appliedCoupon.discount_value;
    } else if (appliedCoupon.discount_type === "percentage") {
      const calcDiscount = (subtotal * appliedCoupon.discount_value) / 100;
      discount = appliedCoupon.max_discount_amount
        ? Math.min(calcDiscount, appliedCoupon.max_discount_amount)
        : calcDiscount;
    }
  }

  // Free delivery standard for orders over 500
  if (subtotal >= 500 && baseDeliveryFee > 0) {
    deliveryFee = 0;
  }

  const total = Math.max(0, subtotal + deliveryFee - discount);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = INITIAL_COUPONS.find(
      (c) => c.code.toUpperCase() === cleanCode && c.is_active
    );

    if (!found) {
      return { success: false, message: "Invalid or expired promo code." };
    }

    if (subtotal < found.min_order_amount) {
      return {
        success: false,
        message: `Cart total must be at least ₹${found.min_order_amount} to use this coupon.`,
      };
    }

    setAppliedCoupon(found);
    return {
      success: true,
      message: `Coupon "${found.code}" applied successfully!`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
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
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
