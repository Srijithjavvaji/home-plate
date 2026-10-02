import React from "react";
import { Search, ChefHat, Bike, Smile } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      icon: Search,
      title: "Discover Home Cooks",
      desc: "Browse authentic menus cooked by real home cooks, mothers, and artisanal grandmothers in your neighborhood.",
    },
    {
      num: "02",
      icon: ChefHat,
      title: "Cooked Fresh to Order",
      desc: "No bulk commercial restaurant preps. Your meal is crafted from scratch using wholesome home ingredients only after you order.",
    },
    {
      num: "03",
      icon: Bike,
      title: "Carefully Delivered",
      desc: "Hot, insulated packaging brings the taste of mother’s kitchen straight to your dining table or office desk.",
    },
    {
      num: "04",
      icon: Smile,
      title: "Relish Real Food",
      desc: "Enjoy genuine homemade nutrition that feels light on your stomach and comforting for your soul.",
    },
  ];

  return (
    <section className="py-20 bg-emerald-950 text-white relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-800">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            How Home Plate Works
          </h2>
          <p className="text-sm text-emerald-100/70 mt-2 leading-relaxed">
            From the neighborhood home stove directly to your doorstep in 4 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative bg-emerald-900/40 border border-emerald-800/60 rounded-3xl p-6 backdrop-blur-sm flex flex-col hover:border-emerald-600 transition-colors duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/50">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-emerald-700/60 font-mono">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-emerald-100/70 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
