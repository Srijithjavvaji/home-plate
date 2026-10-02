import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChefHat, Sparkles, ShieldCheck, HeartHandshake } from "lucide-react";

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-white py-16 lg:py-24">
      {/* Subtle organic background blur shapes */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-200/20 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Authentic Homemade Recipes • Zero Chemical Additives</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.12]">
              Homemade Goodness, <br />
              <span className="text-emerald-700">Delivered to Your Doorstep.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover fresh, authentic homemade food from trusted home cooks near you. Slow-cooked heritage recipes, grandma pickles, and healthy millet meals prepared with pure love.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/foods"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Food</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/become-a-seller"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 border-2 border-emerald-600/30 hover:border-emerald-600 font-bold text-base transition-all"
              >
                <ChefHat className="w-4 h-4 text-emerald-600" />
                <span>Become a Home Cook</span>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-100 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>FSSAI Certified</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">Verified hygiene standards</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Fresh Batches</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">Cooked only on order</p>
              </div>
              <div>
                <div className="text-emerald-700 font-bold text-sm">
                  <span>4.9 / 5.0</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">Over 2,400+ reviews</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Large Image */}
              <div className="relative h-96 sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1000&auto=format&fit=crop&q=80"
                  alt="Authentic Homemade Thali"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 px-2 py-0.5 rounded-full">
                    Ammamma’s Secret Spice
                  </span>
                  <h4 className="text-lg font-bold mt-1">Homestyle Claypot Biryani & Thalis</h4>
                  <p className="text-xs text-gray-200">Gingelly oil & stone-ground spices</p>
                </div>
              </div>

              {/* Floating Floating Card Top-Right */}
              <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-gray-100 flex items-center gap-3 hidden sm:flex">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
                  🍲
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Zero Preservatives</p>
                  <p className="text-[10px] text-gray-500">100% Pure Homemade Food</p>
                </div>
              </div>

              {/* Floating Floating Card Bottom-Left */}
              <div className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-gray-100 flex items-center gap-3 hidden sm:flex">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                  ⏱️
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Cooked to Order</p>
                  <p className="text-[10px] text-gray-500">Delivered hot & steaming</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
