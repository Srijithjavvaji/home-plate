import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChefHat, Sparkles, ShieldCheck, HeartHandshake, MapPin } from "lucide-react";

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fff8f0] via-[#fffdfa] to-white py-14 lg:py-20">
      {/* Subtle organic warm background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-orange-200/25 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-900 text-xs font-bold border border-orange-200/80 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Hyderabad's Verified Homemade Food Marketplace</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-semibold text-[#271b15] tracking-tight leading-[1.15]">
              Homemade Goodness, <br />
              <span className="text-orange-600">Delivered with Love.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg font-lato text-[#634537] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Connect with talented home cooks and homemakers across Hyderabad. Discover sun-cured Andhra pickles, stone-ground podis, pure cow ghee sweets, and wholesome traditional snacks crafted without industrial additives.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/foods"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-base shadow-lg shadow-orange-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Discover Homemade Food</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/become-a-seller"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-orange-50 text-orange-800 border-2 border-orange-600/30 hover:border-orange-600 font-bold text-base transition-all"
              >
                <ChefHat className="w-4 h-4 text-orange-600" />
                <span>Sell Your Creations</span>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-orange-100 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <div className="flex items-center gap-1.5 text-orange-800 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span>FSSAI Compliant</span>
                </div>
                <p className="text-[11px] text-[#7c5946] mt-0.5">Verified homemaker kitchens</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-orange-800 font-bold text-sm">
                  <HeartHandshake className="w-4 h-4 text-orange-600" />
                  <span>Grandma Recipes</span>
                </div>
                <p className="text-[11px] text-[#7c5946] mt-0.5">Cold-pressed oils & pure ghee</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-orange-800 font-bold text-sm">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span>Hyderabad Hub</span>
                </div>
                <p className="text-[11px] text-[#7c5946] mt-0.5">Hyperlocal delivery fleet</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Large Image */}
              <div className="relative h-96 sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=1000&auto=format&fit=crop&q=80"
                  alt="Authentic Homemade Andhra Avakaya and Delicacies"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-600 px-2.5 py-0.5 rounded-full">
                    Godavari Avakaya & Podis
                  </span>
                  <h4 className="text-lg font-bold mt-1">Sun-Cured Pickles & Stone-Ground Podis</h4>
                  <p className="text-xs text-orange-100">Prepared in small authentic batches by home cooks</p>
                </div>
              </div>

              {/* Floating Card Top-Right */}
              <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-orange-100 flex items-center gap-3 hidden sm:flex">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                  ✨
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Zero Artificial Preservatives</p>
                  <p className="text-[10px] text-[#7c5946]">100% Homemade Goodness</p>
                </div>
              </div>

              {/* Floating Card Bottom-Left */}
              <div className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-orange-100 flex items-center gap-3 hidden sm:flex">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                  ⚡
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Hyperlocal Delivery</p>
                  <p className="text-[10px] text-[#7c5946]">Hyderabad Metro Service</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
