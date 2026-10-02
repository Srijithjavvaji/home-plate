"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Food } from "../supabase/types";

interface WishlistContextType {
  wishlist: Food[];
  toggleWishlist: (food: Food) => void;
  isInWishlist: (foodId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Food[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("homeplate_wishlist");
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Wishlist error:", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("homeplate_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Wishlist save error:", e);
    }
  }, [wishlist]);

  const toggleWishlist = (food: Food) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === food.id);
      if (exists) {
        return prev.filter((item) => item.id !== food.id);
      }
      return [...prev, food];
    });
  };

  const isInWishlist = (foodId: string) => {
    return wishlist.some((item) => item.id === foodId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
