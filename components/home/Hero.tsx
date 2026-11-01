import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChefHat, Sparkles, ShieldCheck, HeartHandshake, MapPin } from "lucide-react";

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fdfbf9] via-white to-white py-12 lg:py-16">
      {/* Subtle clean red-tinted ambient glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-100/30 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-[#e23744] text-xs font-poppins font-medium border border-red-100 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#e23744]" />
              <span>Hyderabad's Verified Homemade Snacks Marketplace</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-semibold text-[#1c1c1c] tracking-tight leading-[1.15]">
              Homemade Goodness, <br />
              <span className="text-[#e23744]">Delivered to Your Doorstep.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg font-lato text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Connect with verified home cooks and homemakers across Hyderabad. Discover sun-cured Andhra pickles, stone-ground podis, pure cow ghee sweets, and crispy traditional snacks crafted without industrial additives.
            </p>

            {/* Action Buttons in Zomato Red & White */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/foods"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#e23744] hover:bg-[#cb202d] text-white font-poppins font-medium text-base shadow-lg shadow-[#e23744]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Homemade Snacks</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/seller/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-red-50/50 text-gray-800 border-2 border-gray-200 hover:border-[#e23744] font-poppins font-medium text-base transition-all"
              >
                <ChefHat className="w-4 h-4 text-[#e23744]" />
                <span>Sell Homemade Food</span>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-100 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <div className="flex items-center gap-1.5 text-gray-900 font-poppins font-medium text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 text-[#e23744]" />
                  <span>FSSAI Compliant</span>
                </div>
                <p className="text-[11px] font-lato text-gray-500 mt-0.5">Verified home kitchens</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-gray-900 font-poppins font-medium text-xs sm:text-sm">
                  <HeartHandshake className="w-4 h-4 text-[#e23744]" />
                  <span>Grandma Recipes</span>
                </div>
                <p className="text-[11px] font-lato text-gray-500 mt-0.5">Cold-pressed oils & pure ghee</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-gray-900 font-poppins font-medium text-xs sm:text-sm">
                  <MapPin className="w-4 h-4 text-[#e23744]" />
                  <span>Hyderabad Hub</span>
                </div>
                <p className="text-[11px] font-lato text-gray-500 mt-0.5">Hyperlocal delivery fleet</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase featuring Homemade Snacks */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Large Image */}
              <div className="relative h-96 sm:h-[430px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=1000&auto=format&fit=crop&q=80"
                  alt="Authentic Homemade Andhra Avakaya and Delicacies"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] font-poppins font-bold uppercase tracking-wider bg-[#e23744] px-2.5 py-0.5 rounded-full">
                    Godavari Avakaya & Podis
                  </span>
                  <h4 className="text-base sm:text-lg font-poppins font-semibold mt-1">Sun-Cured Pickles & Stone-Ground Podis</h4>
                  <p className="text-xs font-lato text-gray-200">Prepared in small authentic batches by home cooks</p>
                </div>
              </div>

              {/* Floating Card Top-Right */}
              <div className="absolute -top-3 -right-3 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-gray-100 flex items-center gap-3 hidden sm:flex">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-[#e23744] font-bold text-xs">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-poppins font-semibold text-gray-900">Zero Preservatives</p>
                  <p className="text-[10px] font-lato text-gray-500">100% Homemade Snacks</p>
                </div>
              </div>

              {/* Floating Card Bottom-Left */}
              <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-gray-100 flex items-center gap-3 hidden sm:flex">
                <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-[#e23744] font-bold text-xs">
                  ⚡
                </div>
                <div>
                  <p className="text-xs font-poppins font-semibold text-gray-900">Hyperlocal Delivery</p>
                  <p className="text-[10px] font-lato text-gray-500">Same-Day Across Hyderabad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
