import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { store } from "@/lib/data/store";
import { FoodCard } from "@/components/food/FoodCard";
import { ArrowLeft } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const category = await store.getCategoryById(id);

  if (!category) {
    notFound();
  }

  const foods = await store.getFoodsByCategory(category.id);

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/#categories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-emerald-700 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Categories</span>
        </Link>

        {/* Category Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-10 h-56 sm:h-72 bg-emerald-950 text-white shadow-lg">
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            priority
            className="object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 px-3 py-1 rounded-full">
              Category
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-2">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        {/* Foods Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Available Dishes ({foods.length})
          </h2>
          <Link
            href="/foods"
            className="text-xs text-emerald-700 font-semibold hover:underline"
          >
            Explore all categories &rarr;
          </Link>
        </div>

        {foods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {foods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-md mx-auto">
            <p className="text-base font-bold text-gray-900">
              No dishes found in this category yet.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Our home cooks are working on delicious recipes for this category!
            </p>
            <Link
              href="/foods"
              className="mt-4 inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              Explore Other Dishes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
