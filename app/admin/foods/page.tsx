"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { store } from "@/lib/data/store";
import { Food } from "@/lib/supabase/types";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/lib/context/ToastContext";
import { VegBadge } from "@/components/food/VegBadge";
import { Star, Trash2, CheckCircle2, XCircle, Sparkles } from "lucide-react";

export default function AdminFoodsPage() {
  const { success } = useToast();
  const [foods, setFoods] = useState<Food[]>([]);

  useEffect(() => {
    async function loadFoods() {
      const data = await store.getFoods();
      setFoods(data);
    }
    loadFoods();
  }, []);

  const handleToggleFeatured = async (food: Food) => {
    const updated = !food.is_featured;
    await store.updateFood(food.id, { is_featured: updated });
    setFoods((prev) =>
      prev.map((f) => (f.id === food.id ? { ...f, is_featured: updated } : f))
    );
    success(
      updated ? "Dish Featured on Home Page" : "Removed from Featured",
      food.name
    );
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete ${name} from platform catalog?`)) {
      await store.deleteFood(id);
      setFoods((prev) => prev.filter((f) => f.id !== id));
      success("Dish Deleted", name);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              Platform Food Catalog
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Review all published dishes, feature dishes on the homepage, and inspect pricing.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold bg-slate-900/80">
                  <th className="py-3.5 px-6">Dish & Kitchen</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {foods.map((food) => (
                  <tr key={food.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                          <Image
                            src={food.image_url}
                            alt={food.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <VegBadge isVeg={food.is_veg} size="sm" />
                            <span className="font-bold text-white text-sm">
                              {food.name}
                            </span>
                          </div>
                          <p className="text-purple-400 text-[11px] mt-0.5">
                            {food.seller?.kitchen_name}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-400">
                      {food.category?.name || "Homestyle"}
                    </td>

                    <td className="py-4 px-4 font-bold text-white">
                      {formatPrice(food.price)}
                    </td>

                    <td className="py-4 px-4 text-amber-400 font-bold">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{food.rating.toFixed(1)}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleFeatured(food)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                          food.is_featured
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-slate-800 text-slate-500 border border-slate-700"
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{food.is_featured ? "Featured" : "Standard"}</span>
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(food.id, food.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        title="Delete Food"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
