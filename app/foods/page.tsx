"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { store } from "@/lib/data/store";
import { Food, Category } from "@/lib/supabase/types";
import { FoodCard } from "@/components/food/FoodCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Search, SlidersHorizontal, Sparkles, X, Check } from "lucide-react";

function FoodsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialVeg = searchParams.get("veg") === "true";

  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [vegOnly, setVegOnly] = useState(initialVeg);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating" | "time">("featured");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [loadedFoods, loadedCategories] = await Promise.all([
          store.getFoods(),
          store.getCategories(),
        ]);
        setFoods(loadedFoods);
        setCategories(loadedCategories);
      } catch (err) {
        console.error("Failed to load foods:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Update query params when URL changes
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get("search");
    if (q) setSearch(q);
    const v = searchParams.get("veg");
    if (v === "true") setVegOnly(true);
  }, [searchParams]);

  const filteredFoods = useMemo(() => {
    return foods
      .filter((food) => {
        // Search query
        if (search.trim()) {
          const query = search.toLowerCase();
          const matchesName = food.name.toLowerCase().includes(query);
          const matchesDesc = food.description.toLowerCase().includes(query);
          const matchesIngredient = food.ingredients.some((i) =>
            i.toLowerCase().includes(query)
          );
          const matchesSeller = food.seller?.kitchen_name.toLowerCase().includes(query);
          if (!matchesName && !matchesDesc && !matchesIngredient && !matchesSeller) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== "all") {
          const matchesCatId = food.category_id === selectedCategory;
          const matchesCatSlug = food.category?.slug === selectedCategory;
          if (!matchesCatId && !matchesCatSlug) return false;
        }

        // Veg filter
        if (vegOnly && !food.is_veg) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "time") return a.prep_time_minutes - b.prep_time_minutes;
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      });
  }, [foods, search, selectedCategory, vegOnly, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50/40 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-100/70 w-fit px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Freshly Cooked Near You</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            Discover Homemade Foods
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Handcrafted traditional delicacies prepared by certified neighborhood home cooks.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by dish, ingredient, or home cook..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Veg Toggle */}
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                vegOnly
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-sm border p-[2px] flex items-center justify-center ${
                  vegOnly ? "border-white" : "border-emerald-600"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    vegOnly ? "bg-white" : "bg-emerald-600"
                  }`}
                />
              </div>
              <span>Pure Veg Only</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "featured" | "price-asc" | "price-desc" | "rating" | "time"
                  )
                }
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-emerald-500 focus:bg-white"
              >
                <option value="featured">Featured First</option>
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="time">Fastest Preparation</option>
              </select>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === "all"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === c.slug || selectedCategory === c.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-gray-500 font-medium">
            Showing <strong className="text-gray-900">{filteredFoods.length}</strong> delicious dishes
          </p>
          {(search || selectedCategory !== "all" || vegOnly) && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setVegOnly(false);
              }}
              className="text-xs text-emerald-700 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Food Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
                <Skeleton className="h-44 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-20 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredFoods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl">
              🥘
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              No dishes match your filter
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              Try searching for something else or clearing your vegetarian or category filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setVegOnly(false);
              }}
              className="mt-5 px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
            >
              Show All Dishes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FoodsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-14 w-full mb-8 rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      }
    >
      <FoodsContent />
    </Suspense>
  );
}
