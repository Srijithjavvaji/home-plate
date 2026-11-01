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
    <section id="categories" className="py-16 bg-[#fffdfa] border-b border-orange-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100/80 px-3 py-1 rounded-full">
              Authentic Homemaker Specialties
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#271b15] mt-2">
              Explore Homemade Food Categories
            </h2>
            <p className="text-sm text-[#7c5946] mt-1 max-w-xl">
              Authentic traditional snacks, pure country cow ghee sweets, heirloom sun-cured pickles, stone-ground podis, and healthy millet crunchies.
            </p>
          </div>
          <Link
            href="/foods"
            className="text-xs font-bold text-orange-700 hover:text-orange-800 flex items-center gap-1 group transition"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid (6 Categories) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative flex flex-col items-center bg-white hover:bg-orange-50/60 rounded-2xl p-4 border border-orange-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 text-center"
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
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm group-hover:text-orange-800 transition line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
