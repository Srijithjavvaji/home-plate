import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { store } from "@/lib/data/store";
import { FoodCard } from "@/components/food/FoodCard";
import { Star, ShieldCheck, MapPin, Phone, ChefHat, ArrowLeft, Clock } from "lucide-react";

interface SellerPageProps {
  params: Promise<{ id: string }>;
}

export default async function SellerProfilePage({ params }: SellerPageProps) {
  const { id } = await params;
  const seller = await store.getSellerById(id);

  if (!seller) {
    notFound();
  }

  const foods = await store.getFoodsBySeller(seller.id);

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/#top-cooks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-emerald-700 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Top Cooks</span>
        </Link>

        {/* Seller Banner Header */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm mb-10">
          {/* Banner Image */}
          <div className="relative h-48 sm:h-64 w-full bg-gray-100">
            <Image
              src={
                seller.banner_url ||
                "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&auto=format&fit=crop&q=80"
              }
              alt={seller.kitchen_name}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Profile Details Bar */}
          <div className="px-6 sm:px-10 pb-8 pt-4 relative">
            {/* Overlapping Avatar */}
            <div className="relative -mt-16 sm:-mt-20 mb-4 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white">
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

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
                    {seller.kitchen_name}
                  </h1>
                  {seller.is_verified && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>FSSAI Certified</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{seller.address}, {seller.city}, {seller.pincode}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{seller.phone}</span>
                  </div>
                  {seller.fssai_number && (
                    <span className="text-[11px] text-gray-400">
                      FSSAI Lic: <strong>{seller.fssai_number}</strong>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mt-3 leading-relaxed">
                  {seller.description}
                </p>
              </div>

              {/* Rating and Badges */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                  <div className="flex items-center justify-center gap-1 text-amber-900 font-extrabold text-lg">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span>{seller.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-[10px] text-amber-700 font-medium mt-0.5">
                    {seller.total_ratings} Customer Reviews
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <div className="flex items-center justify-center gap-1 text-emerald-900 font-extrabold text-lg">
                    <ChefHat className="w-5 h-5 text-emerald-600" />
                    <span>{foods.length}</span>
                  </div>
                  <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
                    Dishes on Menu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seller's Kitchen Menu */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Fresh Daily Menu from {seller.kitchen_name}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Prepared to order using home ingredients and standard hygiene practices.
            </p>
          </div>
        </div>

        {foods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {foods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-md mx-auto">
            <Clock className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">
              Kitchen is currently restocking
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              New homemade dishes will be posted here soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
