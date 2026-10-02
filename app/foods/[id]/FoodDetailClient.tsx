"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Food, Review } from "@/lib/supabase/types";
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useToast } from "@/lib/context/ToastContext";
import { useAuth } from "@/lib/context/AuthContext";
import { VegBadge } from "@/components/food/VegBadge";
import { FoodCard } from "@/components/food/FoodCard";
import { formatPrice } from "@/lib/utils";
import {
  Star,
  Clock,
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  ChefHat,
  ShieldCheck,
  MapPin,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

interface FoodDetailClientProps {
  food: Food;
  initialReviews: Review[];
  relatedFoods: Food[];
}

export default function FoodDetailClient({
  food,
  initialReviews,
  relatedFoods,
}: FoodDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success, error: toastError } = useToast();
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const isWishlisted = isInWishlist(food.id);

  const handleAddToCart = () => {
    addItem(food, quantity);
    success("Added to Cart", `${quantity}x ${food.name} added to your order.`);
  };

  const handleBuyNow = () => {
    addItem(food, quantity);
    router.push("/checkout");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toastError("Comment required", "Please write a few words about this dish.");
      return;
    }

    setIsSubmittingReview(true);
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      user_id: user?.id || "anon",
      food_id: food.id,
      rating: newRating,
      comment: newComment.trim(),
      created_at: new Date().toISOString(),
      user: {
        id: user?.id || "anon",
        email: user?.email || "customer@homeplate.app",
        full_name: user?.full_name || "Food Lover",
        role: "customer",
      },
    };

    setTimeout(() => {
      setReviews((prev) => [newRev, ...prev]);
      setNewComment("");
      setIsSubmittingReview(false);
      success("Review Posted!", "Thank you for supporting this home cook.");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-emerald-700">Home</Link>
          <span>/</span>
          <Link href="/foods" className="hover:text-emerald-700">Foods</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold truncate">{food.name}</span>
        </nav>

        {/* Main Details Grid */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10">
            {/* Left: Large Food Image */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative h-80 sm:h-[450px] w-full rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                <Image
                  src={food.image_url}
                  alt={food.name}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <VegBadge isVeg={food.is_veg} size="md" className="shadow-md" />
                  <span className="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {food.is_veg ? "Pure Vegetarian" : "Non-Vegetarian"}
                  </span>
                </div>

                <button
                  onClick={() => toggleWishlist(food)}
                  className="absolute top-4 right-4 p-3 rounded-full bg-white/95 text-gray-700 hover:text-rose-500 shadow-md transition backdrop-blur-sm"
                  aria-label="Save to Wishlist"
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Right: Food Info & Action */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Header & Seller Link */}
                {food.seller && (
                  <Link
                    href={`/seller/${food.seller.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-3 hover:bg-emerald-100 transition"
                  >
                    <ChefHat className="w-3.5 h-3.5" />
                    <span>Kitchen: {food.seller.kitchen_name}</span>
                  </Link>
                )}

                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight leading-snug">
                  {food.name}
                </h1>

                {/* Rating & Prep stats */}
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{food.rating.toFixed(1)}</span>
                    <span className="text-amber-700 font-normal">({reviews.length} reviews)</span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Prep: {food.prep_time_minutes} mins</span>
                  </div>

                  <span className="text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg">
                    {food.serving_info}
                  </span>

                  <span
                    className={`px-2.5 py-1 rounded-lg font-semibold ${
                      food.is_available
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {food.is_available ? "In Stock & Fresh" : "Temporarily Sold Out"}
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-gray-950">
                    {formatPrice(food.price)}
                  </span>
                  {food.original_price && food.original_price > food.price && (
                    <span className="text-base text-gray-400 line-through">
                      {formatPrice(food.original_price)}
                    </span>
                  )}
                  {food.original_price && food.original_price > food.price && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Save {formatPrice(food.original_price - food.price)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed mt-4">
                  {food.description}
                </p>

                {/* Key Ingredients */}
                {food.ingredients && food.ingredients.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                      Key Fresh Ingredients:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {food.ingredients.map((ing, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-xl bg-gray-100 text-gray-700 text-xs font-medium"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity & Buy Buttons */}
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Quantity:
                  </span>
                  <div className="flex items-center gap-3 bg-gray-100 rounded-2xl p-1 border border-gray-200">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-gray-700 hover:bg-gray-200 transition disabled:opacity-40"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-gray-700 hover:bg-gray-200 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    Total: <strong>{formatPrice(food.price * quantity)}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!food.is_available}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-600/40 hover:border-emerald-600 font-bold text-sm transition-all disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-700" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={!food.is_available}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Home Cook Information Card */}
        {food.seller && (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border-2 border-emerald-100">
                  <Image
                    src={food.seller.logo_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80"}
                    alt={food.seller.kitchen_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {food.seller.kitchen_name}
                    </h3>
                    {food.seller.is_verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>FSSAI Verified</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{food.seller.address}, {food.seller.city}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 max-w-xl">
                    {food.seller.description}
                  </p>
                </div>
              </div>

              <Link
                href={`/seller/${food.seller.id}`}
                className="px-5 py-2.5 rounded-xl border border-emerald-600 text-emerald-700 font-bold text-xs hover:bg-emerald-50 transition shrink-0"
              >
                Visit Home Kitchen &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Customer Reviews & Feedback Section */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mb-12">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Customer Reviews ({reviews.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                          {rev.user?.full_name?.charAt(0) || "U"}
                        </div>
                        <span className="text-xs font-bold text-gray-900">
                          {rev.user?.full_name || "Home Food Lover"}
                        </span>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic py-4">
                  No reviews yet for this dish. Be the first to share your experience!
                </p>
              )}
            </div>

            {/* Leave a Review Form */}
            <div className="lg:col-span-5 bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
              <h4 className="text-sm font-bold text-emerald-950 mb-1">
                Leave a Review
              </h4>
              <p className="text-xs text-gray-600 mb-4">
                How was the flavor, hygiene, and freshness of this dish?
              </p>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Rating (1 to 5 Stars):
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Thoughts:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share what made this homemade dish special..."
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition shadow-sm"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Related Dishes */}
        {relatedFoods.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              More Delicacies from This Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedFoods.map((f) => (
                <FoodCard key={f.id} food={f} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
