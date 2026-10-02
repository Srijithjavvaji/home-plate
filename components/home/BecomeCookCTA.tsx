import React from "react";
import Link from "next/link";
import { ChefHat, ArrowRight, DollarSign, Clock, Heart } from "lucide-react";

export const BecomeCookCTA: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white overflow-hidden shadow-2xl p-8 sm:p-14">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
              <ChefHat className="w-4 h-4 text-emerald-300" />
              <span>Turn Your Passion Into A Thriving Business</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Cook From Your Home Kitchen, Earn With Pride.
            </h2>

            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Join hundreds of homemakers, mothers, and passionate chefs who earn up to ₹65,000/month by serving authentic homemade specialties to their neighborhoods. We handle deliveries, payments, and packaging.
            </p>

            {/* Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Cook on your own schedule</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <DollarSign className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Weekly direct bank deposits</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Heart className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Keep 85% of your earnings</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/become-a-seller"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-emerald-900 font-extrabold text-sm hover:bg-emerald-50 transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                <span>Register Your Home Kitchen Now</span>
                <ArrowRight className="w-4 h-4 text-emerald-700" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
