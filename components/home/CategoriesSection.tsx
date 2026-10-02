import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/supabase/types";
import { ArrowRight } from "lucide-react";

interface CategoriesSectionProps {
  categories: Category[];
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
  return (
    <section id="categories" className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Traditional Cuisines
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
              Explore Homemade Food Categories
            </h2>
            <p className="text-sm text-gray-500 mt-1 max-w-xl">
              From morning tiffins to grandmother’s avakaya pickles and pure ghee sweets, choose what cravings call you today.
            </p>
          </div>
          <Link
            href="/foods"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group transition"
          >
            <span>View all dishes</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative flex flex-col items-center bg-gray-50 hover:bg-emerald-50/50 rounded-2xl p-4 border border-gray-100 transition-all duration-300 hover:shadow-card hover:-translate-y-1 text-center"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-inner border-2 border-white mb-3 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </div>
              <h3 className="font-bold text-gray-900 text-sm group-hover:text-emerald-800 transition line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
