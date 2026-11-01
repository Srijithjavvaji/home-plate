import React from "react";
import Link from "next/link";
import { UtensilsCrossed, ShieldCheck, HeartHandshake, PhoneCall, Mail, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#271b15] text-amber-100/80 pt-16 pb-12 border-t border-amber-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-950/40">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                HOME<span className="text-orange-500">PLATE</span>
              </span>
            </Link>
            <p className="text-sm text-amber-200/70 max-w-sm leading-relaxed">
              "Homemade Goodness, Delivered with Love." Connecting food lovers with verified homemakers, grandma heirloom recipes, and regional artisanal culinary heritage across Hyderabad.
            </p>
            <div className="flex items-center gap-4 text-xs text-orange-300 pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span>100% Kitchen Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-orange-400" />
                <span>Empowering Homemakers</span>
              </div>
            </div>
          </div>

          {/* Product Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Product Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/foods" className="hover:text-orange-400 transition">
                  Traditional Snacks
                </Link>
              </li>
              <li>
                <Link href="/foods" className="hover:text-orange-400 transition">
                  Homemade Sweets
                </Link>
              </li>
              <li>
                <Link href="/foods" className="hover:text-orange-400 transition">
                  Authentic Pickles
                </Link>
              </li>
              <li>
                <Link href="/foods" className="hover:text-orange-400 transition">
                  Stone-Ground Podis
                </Link>
              </li>
              <li>
                <Link href="/foods" className="hover:text-orange-400 transition">
                  Healthy Millet Snacks
                </Link>
              </li>
              <li>
                <Link href="/foods" className="hover:text-orange-400 transition">
                  Regional Specialities
                </Link>
              </li>
            </ul>
          </div>

          {/* Seller & Cook Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              For Homemakers
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/become-a-seller" className="hover:text-orange-400 transition font-semibold text-orange-300">
                  Register Your Kitchen
                </Link>
              </li>
              <li>
                <Link href="/seller/dashboard" className="hover:text-orange-400 transition">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link href="/seller/foods" className="hover:text-orange-400 transition">
                  Product Management
                </Link>
              </li>
              <li>
                <Link href="/seller/orders" className="hover:text-orange-400 transition">
                  Order Desk
                </Link>
              </li>
              <li>
                <Link href="/seller/earnings" className="hover:text-orange-400 transition">
                  Earnings & Daily Payouts
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Hyderabad Hub
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Madhapur & Banjara Hills, Hyderabad, Telangana</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-orange-400 shrink-0" />
                <span>+91 98765 00000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span>support@homeplate.app</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-300/50 gap-4">
          <p>© {new Date().getFullYear()} Home Plate Technologies Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-orange-400 font-medium">Initial Service Area: Hyderabad, Telangana</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
