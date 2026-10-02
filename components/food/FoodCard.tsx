"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Heart, Plus, Minus } from "lucide-react";
import { Food } from "@/lib/supabase/types";
import { VegBadge } from "./VegBadge";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useToast } from "@/lib/context/ToastContext";

interface FoodCardProps {
  food: Food;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const { items, addItem, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success } = useToast();

  const cartItem = items.find((item) => item.food.id === food.id);
  const isWishlisted = isInWishlist(food.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(food, 1);
    success("Added to cart", `${food.name} was added to your order.`);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    updateQuantity(food.id, 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    updateQuantity(food.id, -1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(food);
    success(
      isWishlisted ? "Removed from Wishlist" : "Saved to Wishlist",
      food.name
    );
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-gray-100/90 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Food Image Container */}
      <Link href={`/foods/${food.id}`} className="relative h-48 w-full overflow-hidden bg-gray-100">
        <Image
          src={food.image_url}
          alt={food.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Veg/Non-Veg & Rating top overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <VegBadge isVeg={food.is_veg} className="shadow-sm" />
          {food.is_featured && (
            <span className="bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
              Cook's Special
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label="Save to wishlist"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-gray-700 hover:text-rose-500 hover:bg-white transition-all shadow-sm backdrop-blur-sm"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "fill-rose-500 text-rose-500" : ""
            }`}
          />
        </button>

        {/* Rating and Prep Time bottom overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{food.rating.toFixed(1)}</span>
            <span className="text-gray-300 text-[10px]">({food.total_reviews})</span>
          </div>

          <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>{food.prep_time_minutes} mins</span>
          </div>
        </div>
      </Link>

      {/* Food Details */}
      <div className="flex flex-col flex-1 p-4">
        {/* Seller Kitchen */}
        {food.seller && (
          <Link
            href={`/seller/${food.seller.id}`}
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800 transition line-clamp-1 mb-1"
          >
            By {food.seller.kitchen_name}
          </Link>
        )}

        {/* Food Name */}
        <Link href={`/foods/${food.id}`} className="group-hover:text-emerald-700 transition">
          <h3 className="font-semibold text-gray-900 text-base line-clamp-1 leading-snug">
            {food.name}
          </h3>
        </Link>

        {/* Description snippet */}
        <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-3">
          {food.description}
        </p>

        {/* Price & Action row */}
        <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-gray-950">
                {formatPrice(food.price)}
              </span>
              {food.original_price && food.original_price > food.price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(food.original_price)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500">{food.serving_info}</p>
          </div>

          {/* Add to Cart or Quantity Selector */}
          <div>
            {!cartItem ? (
              <button
                onClick={handleAddToCart}
                disabled={!food.is_available}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl text-xs font-semibold border border-emerald-200 hover:border-emerald-600 transition-all duration-200 shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{food.is_available ? "ADD" : "Sold Out"}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-600 text-white rounded-xl px-2 py-1 shadow-sm">
                <button
                  onClick={handleDecrement}
                  aria-label="Decrease quantity"
                  className="p-0.5 hover:bg-emerald-700 rounded transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold min-w-4 text-center">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  aria-label="Increase quantity"
                  className="p-0.5 hover:bg-emerald-700 rounded transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
