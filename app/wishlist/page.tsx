"use client";

import React from "react";
import Link from "next/link";
import { useWishlist } from "@/lib/context/WishlistContext";
import { FoodCard } from "@/components/food/FoodCard";
import { Heart, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
              Saved Homemade Dishes
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Your personal collection of favorite homemade meals and artisanal pickles
          </p>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Your wishlist is empty
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              Explore authentic home cooking and click the heart icon on any dish to save it for later.
            </p>
            <Link
              href="/foods"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
            >
              <span>Explore Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
