"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Utensils, ShoppingBag, IndianRupee, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export const SellerNav: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/seller/foods", label: "Menu & Foods", icon: Utensils },
    { href: "/seller/orders", label: "Orders", icon: ShoppingBag },
    { href: "/seller/earnings", label: "Earnings", icon: IndianRupee },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="text-xs text-gray-500 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home Plate Storefront</span>
              </Link>
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 mt-1">
              Home Cook Kitchen Portal
            </h1>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors",
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
