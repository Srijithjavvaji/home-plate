"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UtensilsCrossed,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Search,
  ChevronDown,
  LogOut,
  ChefHat,
  ShieldCheck,
  Package,
  Globe,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useLanguage } from "@/lib/context/LanguageContext";
import { UserRole } from "@/lib/supabase/types";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, logout, switchRole, seller } = useAuth();
  const { totalItemsCount } = useCart();
  const { wishlist } = useWishlist();
  const { language, setLanguage, t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/foods?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isAdminRole = (role?: UserRole) => {
    return role === "admin" || role === "super_admin" || role === "operations_admin" || role === "seller_support";
  };

  return (
    <header className="sticky top-0 z-40 bg-[#fffdfa]/95 backdrop-blur-md border-b border-orange-100/80 shadow-sm">
      {/* Top Microbar: Location, Brand Tagline & Language Toggle */}
      <div className="bg-[#43231c] text-white text-[11px] py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span className="font-medium text-orange-100">
              {t("tagline", "Homemade Goodness, Delivered with Love.")}
            </span>
            <span className="text-orange-400/60 font-semibold">•</span>
            <span className="text-orange-200">Hyderabad, Telangana</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-black/20 rounded-md px-2 py-0.5 border border-white/10">
              <Globe className="w-3 h-3 text-orange-300" />
              <button
                onClick={() => setLanguage("en")}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
                  language === "en" ? "bg-orange-500 text-white" : "text-orange-200 hover:text-white"
                }`}
              >
                EN
              </button>
              <span className="text-white/30 text-[10px]">|</span>
              <button
                onClick={() => setLanguage("te")}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
                  language === "te" ? "bg-orange-500 text-white" : "text-orange-200 hover:text-white"
                }`}
              >
                తెలుగు
              </button>
            </div>

            <Link
                href="/login"
                className="text-orange-200 hover:text-white font-bold transition text-[11px] flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded border border-white/10"
              >
                <User className="w-3 h-3 text-orange-400" />
                <span>Sign In</span>
              </Link>

            {/* Quick Role Tester */}
            <div className="flex items-center gap-2">
              <span className="text-orange-300/80">Role:</span>
              <div className="inline-flex rounded-md bg-black/30 p-0.5 border border-white/10">
                {(["customer", "seller", "admin"] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => switchRole(role)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize transition ${
                      user?.role === role
                        ? "bg-orange-600 text-white shadow-sm"
                        : "text-orange-200 hover:text-white"
                    }`}
                  >
                    {role === "seller" ? "Home Cook" : role}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3.5">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-600/30 group-hover:scale-105 transition-transform duration-300">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#43231c] group-hover:text-orange-600 transition">
                HOME<span className="text-orange-600">PLATE</span>
              </span>
              <p className="text-[9px] uppercase tracking-wider text-[#7c5946] font-semibold leading-none">
                Homemade Goodness
              </p>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-md mx-8 relative"
          >
            <Search className="w-4 h-4 text-orange-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pickles, podis, sweets, traditional snacks..."
              className="w-full bg-[#fff8f0] border border-orange-200/80 rounded-full pl-10 pr-4 py-2 text-xs text-gray-900 focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-gray-400"
            />
          </form>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#634537]">
            <Link href="/foods" className="hover:text-orange-600 transition">
              {t("popular_foods", "Explore Products")}
            </Link>
            <Link href="/#categories" className="hover:text-orange-600 transition">
              {t("categories", "Categories")}
            </Link>
            <Link href="/#top-cooks" className="hover:text-orange-600 transition">
              {t("top_cooks", "Home Cooks")}
            </Link>
            <Link
              href="/seller/register"
              className="text-orange-700 font-semibold hover:text-orange-800 transition flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200/70"
            >
              <ChefHat className="w-4 h-4 text-orange-600" />
              <span>Sell Homemade Food</span>
            </Link>
          </nav>

          {/* Action Icons & User Dropdown */}
          <div className="flex items-center gap-3">
            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative p-2 rounded-xl text-gray-600 hover:text-rose-600 hover:bg-orange-50 transition"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl bg-orange-50 text-orange-900 hover:bg-orange-100 transition border border-orange-200/70"
            >
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <span className="hidden sm:inline text-xs font-bold">{t("cart", "Cart")}</span>
              {totalItemsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* User Profile / Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-orange-50 transition border border-orange-200/70"
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-600 text-white text-xs font-bold flex items-center justify-center">
                    {user.full_name?.charAt(0) || "U"}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-orange-100 py-2 z-50 animate-in fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {user.full_name}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-orange-50 transition"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{t("profile", "My Profile & Addresses")}</span>
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-orange-50 transition"
                    >
                      <Package className="w-4 h-4 text-gray-500" />
                      <span>{t("my_orders", "My Orders")}</span>
                    </Link>

                    {user.role === "seller" && (
                      <Link
                        href={seller?.status === "approved" ? "/seller/dashboard" : "/seller/application-status"}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-orange-700 font-semibold hover:bg-orange-50 transition"
                      >
                        <ChefHat className="w-4 h-4 text-orange-600" />
                        <span>
                          {seller?.status === "approved"
                            ? "Seller Kitchen Dashboard"
                            : "Kitchen Application Status"}
                        </span>
                      </Link>
                    )}

                    {isAdminRole(user.role) && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-amber-900 font-semibold hover:bg-amber-50 transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-orange-600" />
                        <span>Admin Control Center</span>
                      </Link>
                    )}

                                        <Link
                      href="/login"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-orange-50 transition"
                    >
                      <User className="w-4 h-4 text-orange-600" />
                      <span>Switch Account / Login Portal</span>
                    </Link>

                    <div className="border-t border-gray-100 my-1" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-orange-700 transition"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-orange-100 bg-white px-4 pt-3 pb-6 space-y-4">
          {/* Language Switcher in Mobile Drawer */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-500">Language / భాష:</span>
            <div className="flex items-center gap-1 bg-orange-50 rounded-lg p-1 border border-orange-200">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  language === "en" ? "bg-orange-600 text-white" : "text-gray-700"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("te")}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  language === "te" ? "bg-orange-600 text-white" : "text-gray-700"
                }`}
              >
                తెలుగు
              </button>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pickles, podis, sweets..."
              className="w-full bg-[#fff8f0] border border-orange-200 rounded-xl pl-10 pr-4 py-2.5 text-xs"
            />
          </form>

          <div className="flex flex-col space-y-2 text-sm font-medium text-gray-700">
            <Link
              href="/foods"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-orange-50"
            >
              Explore Products
            </Link>
            <Link
              href="/#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-orange-50"
            >
              Categories
            </Link>
            <Link
              href="/#top-cooks"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-orange-50"
            >
              Home Cooks
            </Link>
            <Link
              href="/seller/register"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-orange-700 font-semibold hover:bg-orange-50"
            >
              Sell Homemade Food
            </Link>
          </div>
          {/* Mobile Login Section */}
          <div className="pt-3 border-t border-orange-100 space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-600/20"
            >
              <User className="w-4 h-4" />
              <span>Login / Sign In to Home Plate</span>
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 font-bold text-xs hover:bg-orange-100 transition"
            >
              <span>Create Customer Account</span>
            </Link>
          </div>

        </div>
      )}
    </header>
  );
};
