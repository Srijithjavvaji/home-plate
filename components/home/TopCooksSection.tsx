import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Seller } from "@/lib/supabase/types";
import { Star, ShieldCheck, MapPin, ChefHat } from "lucide-react";

interface TopCooksSectionProps {
  sellers: Seller[];
}

export const TopCooksSection: React.FC<TopCooksSectionProps> = ({ sellers }) => {
  return (
    <section id="top-cooks" className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Trusted Kitchens
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            Meet Our Top Home Cooks
          </h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Every home cook on Home Plate undergoes our 5-point hygiene check, kitchen inspection, and tasting session before serving the community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sellers.map((seller) => (
            <div
              key={seller.id}
              className="group flex flex-col bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300"
            >
              {/* Banner Image */}
              <div className="relative h-40 w-full bg-gray-100">
                <Image
                  src={
                    seller.banner_url ||
                    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80"
                  }
                  alt={seller.kitchen_name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm backdrop-blur-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{seller.rating.toFixed(1)}</span>
                  <span className="text-gray-400 font-normal">({seller.total_ratings})</span>
                </div>
              </div>

              {/* Cook Profile Avatar & Info */}
              <div className="p-6 relative flex flex-col flex-1">
                {/* Overlapping Avatar */}
                <div className="relative -mt-14 mb-3 w-16 h-16 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-white">
                  <Image
                    src={
                      seller.logo_url ||
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80"
                    }
                    alt={seller.kitchen_name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition">
                    {seller.kitchen_name}
                  </h3>
                  {seller.is_verified && (
                    <span title="FSSAI Verified Cook">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{seller.address}, {seller.city}</span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-6">
                  {seller.description}
                </p>

                {/* Footer Action */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <ChefHat className="w-3.5 h-3.5" />
                    <span>Homemade Specialty</span>
                  </span>
                  <Link
                    href={`/seller/${seller.id}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white transition-all shadow-sm"
                  >
                    View Menu
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
