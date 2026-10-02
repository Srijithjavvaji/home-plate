import React from "react";
import Link from "next/link";
import { Food } from "@/lib/supabase/types";
import { FoodCard } from "../food/FoodCard";
import { ArrowRight, Flame } from "lucide-react";

interface PopularFoodSectionProps {
  foods: Food[];
}

export const PopularFoodSection: React.FC<PopularFoodSectionProps> = ({ foods }) => {
  return (
    <section className="py-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full w-fit">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Most Loved by Customers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
              Popular Homemade Delicacies
            </h2>
            <p className="text-sm text-gray-500 mt-1 max-w-xl">
              Hand-prepared in small batches by neighborhood cooks. Order early before daily kitchen slots run out.
            </p>
          </div>
          <Link
            href="/foods"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group transition"
          >
            <span>Browse Full Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid of Food Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {foods.slice(0, 8).map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </div>
    </section>
  );
};
