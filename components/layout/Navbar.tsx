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
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import { UserRole } from "@/lib/supabase/types";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, logout, switchRole } = useAuth();
  const { totalItemsCount } = useCart();
  const { wishlist } = useWishlist();

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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-subtle">
      {/* Top microbar with Role Switcher for seamless pair-programming review */}
      <div className="bg-emerald-950 text-white text-[11px] py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Serving fresh homemade delicacies across Hyderabad</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-300">Quick Test Mode:</span>
            <div className="inline-flex rounded-md bg-emerald-900/90 p-0.5 border border-emerald-800">
              {(["customer", "seller", "admin"] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => switchRole(role)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize transition ${
                    user?.role === role
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-emerald-200 hover:text-white"
                  }`}
                >
                  {role === "seller" ? "Home Cook" : role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3.5">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform duration-300">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900 group-hover:text-emerald-700 transition">
                HOME<span className="text-emerald-600">PLATE</span>
              </span>
              <p className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold leading-none">
                Fresh Homemade Food
              </p>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-md mx-8 relative"
          >
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search idli, biryani, pickles, podis, sweets..."
              className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-xs text-gray-900 focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400"
            />
          </form>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/foods" className="hover:text-emerald-600 transition">
              Explore Food
            </Link>
            <Link href="/#categories" className="hover:text-emerald-600 transition">
              Categories
            </Link>
            <Link href="/#top-cooks" className="hover:text-emerald-600 transition">
              Top Cooks
            </Link>
            <Link
              href="/become-a-seller"
              className="text-emerald-700 font-semibold hover:text-emerald-800 transition flex items-center gap-1.5"
            >
              <ChefHat className="w-4 h-4 text-emerald-600" />
              <span>Become a Cook</span>
            </Link>
          </nav>

          {/* Action Icons & User Dropdown */}
          <div className="flex items-center gap-3">
            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative p-2 rounded-xl text-gray-600 hover:text-rose-600 hover:bg-gray-100 transition"
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
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition border border-emerald-200/60"
            >
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <span className="hidden sm:inline text-xs font-bold">Cart</span>
              {totalItemsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* User Profile / Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition border border-gray-200"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                    {user.full_name?.charAt(0) || "U"}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {user.full_name}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      <span>My Profile & Addresses</span>
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Package className="w-4 h-4 text-gray-500" />
                      <span>My Orders</span>
                    </Link>

                    {user.role === "seller" && (
                      <Link
                        href="/seller/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-emerald-700 font-semibold hover:bg-emerald-50 transition"
                      >
                        <ChefHat className="w-4 h-4 text-emerald-600" />
                        <span>Seller Kitchen Dashboard</span>
                      </Link>
                    )}

                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-purple-700 font-semibold hover:bg-purple-50 transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span>Admin Portal</span>
                      </Link>
                    )}

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
                  className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-emerald-700 transition"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-sm"
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
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search homemade dishes..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs"
            />
          </form>

          <div className="flex flex-col space-y-2 text-sm font-medium">
            <Link
              href="/foods"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              Explore Food
            </Link>
            <Link
              href="/#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              Food Categories
            </Link>
            <Link
              href="/#top-cooks"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              Top Home Cooks
            </Link>
            <Link
              href="/become-a-seller"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-emerald-700 font-semibold bg-emerald-50"
            >
              Become a Home Cook
            </Link>
            {user?.role === "seller" && (
              <Link
                href="/seller/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-emerald-800 font-semibold bg-emerald-100"
              >
                Seller Dashboard
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-purple-800 font-semibold bg-purple-50"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
