import React from "react";
import Link from "next/link";
import { UtensilsCrossed, ShieldCheck, HeartHandshake, PhoneCall, Mail, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-950 text-gray-300 pt-16 pb-12 border-t border-emerald-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-900/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/40">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                HOME<span className="text-emerald-400">PLATE</span>
              </span>
            </Link>
            <p className="text-sm text-emerald-100/70 max-w-sm leading-relaxed">
              “Fresh Homemade Food, Delivered to Your Doorstep.” Connecting food lovers with verified home cooks, grandma recipes, and small artisanal kitchens.
            </p>
            <div className="flex items-center gap-4 text-xs text-emerald-300 pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Kitchen Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                <span>Empowering Home Chefs</span>
              </div>
            </div>
          </div>

          {/* Customer Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Discover
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/foods" className="hover:text-emerald-400 transition">
                  All Homemade Foods
                </Link>
              </li>
              <li>
                <Link href="/foods?veg=true" className="hover:text-emerald-400 transition">
                  Pure Vegetarian Dishes
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-emerald-400 transition">
                  Food Categories
                </Link>
              </li>
              <li>
                <Link href="/#top-cooks" className="hover:text-emerald-400 transition">
                  Top Home Cooks
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-emerald-400 transition">
                  My Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Seller & Cook Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              For Home Cooks
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/become-a-seller" className="hover:text-emerald-400 transition font-semibold text-emerald-300">
                  Register Your Kitchen
                </Link>
              </li>
              <li>
                <Link href="/seller/dashboard" className="hover:text-emerald-400 transition">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link href="/seller/foods" className="hover:text-emerald-400 transition">
                  Manage Menu
                </Link>
              </li>
              <li>
                <Link href="/seller/orders" className="hover:text-emerald-400 transition">
                  Kitchen Orders
                </Link>
              </li>
              <li>
                <Link href="/seller/earnings" className="hover:text-emerald-400 transition">
                  Earnings & Payouts
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Madhapur & Banjara Hills, Hyderabad</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 98765 00000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>care@homeplate.app</span>
              </li>
              <li className="pt-1">
                <Link href="/admin" className="text-[11px] text-emerald-300/60 hover:text-emerald-300 transition">
                  Admin Control Panel &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-100/50 gap-4">
          <p>© {new Date().getFullYear()} Home Plate Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-emerald-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-emerald-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-emerald-300 cursor-pointer">FSSAI Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
