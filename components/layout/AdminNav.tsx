"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  UtensilsCrossed,
  ShoppingBag,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const AdminNav: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/sellers", label: "Sellers & Approvals", icon: Store },
    { href: "/admin/foods", label: "Food Catalog", icon: UtensilsCrossed },
    { href: "/admin/orders", label: "All Orders", icon: ShoppingBag },
    { href: "/admin/categories", label: "Categories", icon: Layers },
  ];

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Main App</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <h1 className="text-xl font-extrabold text-white">
                Admin Control Center
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Superadmin
              </span>
            </div>
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
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
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
