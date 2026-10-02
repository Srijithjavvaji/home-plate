import React from "react";
import Link from "next/link";
import { UtensilsCrossed, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md bg-white rounded-3xl p-10 border border-gray-100 shadow-card">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4">
          <UtensilsCrossed className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-gray-950">404</h1>
        <h2 className="text-lg font-bold text-gray-900 mt-2">
          Dish or Page Not Found
        </h2>
        <p className="text-xs text-gray-500 mt-1 mb-6 leading-relaxed">
          The dish or page you are looking for may have been eaten or moved to a different kitchen.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home Plate</span>
        </Link>
      </div>
    </div>
  );
}
