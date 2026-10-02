import React from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: "Sneha Reddy",
      role: "Software Architect, Financial District",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      content:
        "After working 10 hours a day, restaurant food gave me acidity and fatigue. Ordering from Ammamma’s Kitchen through Home Plate has been a lifesaver. The Thatte idlis and ghee podi taste just like what my mom makes in Mysore!",
      rating: 5,
    },
    {
      name: "Vikram Malhotra",
      role: "Founder, Cyber Towers",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      content:
        "The Punjabi Rajma Chawal thali is unmatchable. You can literally smell the slow-cooked cumin, ginger, and ghee. It's light, nutritious, and delivered on time in eco-friendly packaging.",
      rating: 5,
    },
    {
      name: "Ananya Deshpande",
      role: "UX Designer, Jubilee Hills",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      content:
        "I ordered the traditional Andhra Avakaya pickle and Moong Dal Halwa for a family festival. My in-laws could not stop praising the authenticity. Truly grateful for Home Plate connecting us with these talented homemakers.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-emerald-50/40 border-t border-b border-emerald-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Real Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 mt-3">
            Loved by Neighborhood Foodies
          </h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Read how authentic homemade food is transforming the daily health and happiness of thousands across the city.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm flex flex-col justify-between relative hover:shadow-card transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-emerald-200 mb-4" />
              <p className="text-xs text-gray-700 leading-relaxed italic mb-6">
                “{rev.content}”
              </p>

              <div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rev.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={rev.image}
                      alt={rev.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{rev.name}</h4>
                    <p className="text-[10px] text-gray-500">{rev.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
