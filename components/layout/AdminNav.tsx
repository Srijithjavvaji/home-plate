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
  Bike,
  Settings,
  AlertCircle,
  RotateCcw,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const AdminNav: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/deliveries", label: "Deliveries", icon: Bike },
    { href: "/admin/sellers", label: "Sellers & Approvals", icon: Store },
    { href: "/admin/foods", label: "Food Catalog", icon: UtensilsCrossed },
    { href: "/admin/categories", label: "Categories", icon: Layers },
    { href: "/admin/settings", label: "Commissions & Settings", icon: Settings },
    { href: "/admin/complaints", label: "Disputes & Support", icon: AlertCircle },
    { href: "/admin/refunds", label: "Refunds", icon: RotateCcw },
    { href: "/admin/audit-logs", label: "Audit Logs", icon: History },
    { href: "/admin/users", label: "Roles", icon: Users },
  ];

  return (
    <div className="bg-[#271b15] text-white border-b border-orange-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col py-4 gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <Link
              href="/"
              className="text-xs text-orange-200/70 hover:text-orange-400 flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Home Plate Marketplace</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Governance Portal
              </span>
              <span className="text-xs text-orange-200/80">Hyderabad Metro</span>
            </div>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors",
                    isActive
                      ? "bg-orange-600 text-white shadow-sm"
                      : "text-amber-100/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
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
