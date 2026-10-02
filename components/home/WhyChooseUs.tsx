import React from "react";
import { Heart, Sparkles, CheckCircle2, ShieldCheck, Leaf, Users } from "lucide-react";

export const WhyChooseUs: React.FC = () => {
  const perks = [
    {
      icon: Leaf,
      title: "No Palm Oil or MSG",
      desc: "Our cooks use cold-pressed groundnut/sesame oils and homemade cow ghee, never reused commercial frying fats.",
    },
    {
      icon: Sparkles,
      title: "Small Batch Preparation",
      desc: "Food is made in small domestic utensils, maintaining genuine home flavor, texture, and nutritional vitality.",
    },
    {
      icon: Users,
      title: "Empowering Local Families",
      desc: "85% of order value goes directly to home cooks, supporting passionate homemakers and micro-entrepreneurs.",
    },
    {
      icon: ShieldCheck,
      title: "Strict Quality Audits",
      desc: "Regular kitchen spot checks, water purity verification, and mandatory FSSAI food safety registrations.",
    },
    {
      icon: Heart,
      title: "Clean Grandmother Recipes",
      desc: "Time-tested recipes handed down over generations that you simply cannot find in commercial restaurants.",
    },
    {
      icon: CheckCircle2,
      title: "Fresh Customizations",
      desc: "Need less spice or diabetic-friendly millet alternatives? Home cooks prepare meals according to your dietary needs.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            The Home Plate Difference
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 mt-3">
            Why Choose Home Plate?
          </h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            We are not another dark kitchen or restaurant aggregator. We are a family of home cooks bringing pure, soulful food to your dining table.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {perks.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <div
                key={i}
                className="flex gap-4 p-6 rounded-3xl bg-gray-50/70 border border-gray-100/90 hover:bg-emerald-50/40 hover:border-emerald-200 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-white text-emerald-700 flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1.5">{perk.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{perk.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
