"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
  Home,
  LayoutDashboard,
  Users,
  Truck,
  FileBarChart,
  DollarSign,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useLanguage } from "@/lib/context/LanguageContext";
import { UserRole } from "@/lib/supabase/types";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, seller } = useAuth();
  const { totalItemsCount } = useCart();
  const { wishlist } = useWishlist();
  const { language, setLanguage, t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push("/foods?search=" + encodeURIComponent(searchQuery.trim()));
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    router.push("/");
  };

  const isAdminRole = (role?: UserRole) => {
    return role === "admin" || role === "super_admin" || role === "operations_admin" || role === "seller_support";
  };

  const isCurrentActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      {/* Top Microbar: Location, Brand Tagline & Language Switcher (Role Selector Completely Removed) */}
      <div className="bg-[#1c1c1c] text-white text-[11px] py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#e23744] animate-pulse" />
            <span className="font-medium text-gray-200">
              {t("tagline", "Homemade Goodness, Delivered with Love.")}
            </span>
            <span className="text-gray-500 font-semibold">•</span>
            <span className="text-gray-300 font-normal">Hyderabad, Telangana</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-white/10 rounded-md px-2 py-0.5 border border-white/10">
              <Globe className="w-3 h-3 text-[#e23744]" />
              <button
                onClick={() => setLanguage("en")}
                className={"px-1.5 py-0.5 rounded text-[10px] font-bold transition " + (
                  language === "en" ? "bg-[#e23744] text-white" : "text-gray-300 hover:text-white"
                )}
              >
                EN
              </button>
              <span className="text-white/30 text-[10px]">|</span>
              <button
                onClick={() => setLanguage("te")}
                className={"px-1.5 py-0.5 rounded text-[10px] font-bold transition " + (
                  language === "te" ? "bg-[#e23744] text-white" : "text-gray-300 hover:text-white"
                )}
              >
                తెలుగు
              </button>
            </div>

            {/* Authenticated user greeting or Sign In link */}
            {user ? (
              <div className="flex items-center gap-2 text-[11px] text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="font-medium text-white">{user.full_name || user.email}</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-white/15 text-orange-200">
                  {user.role === "seller" ? "Home Cook" : isAdminRole(user.role) ? "Admin" : "Customer"}
                </span>
              </div>
            ) : (
              <Link
                href="/login"
                id="top-signin-btn"
                className="text-gray-200 hover:text-white font-bold transition text-[11px] flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded border border-white/10"
              >
                <User className="w-3 h-3 text-[#e23744]" />
                <span>Log In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Brand Logo with Zomato-inspired red flair */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-[#e23744] flex items-center justify-center text-white shadow-md shadow-[#e23744]/25 group-hover:scale-105 transition-transform duration-300">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#1c1c1c] group-hover:text-[#e23744] transition font-poppins">
                HOME<span className="text-[#e23744]">PLATE</span>
              </span>
              <p className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold leading-none">
                Homemade Snacks
              </p>
            </div>
          </Link>

          {/* Search Bar (Visible for Customer & Guest) */}
          {(!user || user.role === "customer") && (
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex items-center flex-1 max-w-sm mx-6 relative"
            >
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search homemade pickles, podis, snacks..."
                className="w-full bg-[#f8f8f8] border border-gray-200 rounded-full pl-10 pr-4 py-2 text-xs text-gray-900 focus:bg-white focus:border-[#e23744] focus:outline-none focus:ring-2 focus:ring-[#e23744]/20 transition-all placeholder:text-gray-400 font-lato"
              />
            </form>
          )}

          {/* ========================================================================= */}
          {/* ROLE-BASED DESKTOP NAVIGATION                                            */}
          {/* ========================================================================= */}

          {/* 1. CUSTOMER NAVIGATION */}
          {user && user.role === "customer" && (
            <nav className="hidden lg:flex items-center gap-5 text-xs font-poppins font-medium text-gray-700">
              <Link
                href="/"
                className={"transition hover:text-[#e23744] flex items-center gap-1.5 " + (
                  isCurrentActive("/") && pathname === "/" ? "text-[#e23744] font-semibold" : ""
                )}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <Link
                href="/foods"
                className={"transition hover:text-[#e23744] " + (
                  isCurrentActive("/foods") ? "text-[#e23744] font-semibold" : ""
                )}
              >
                Homemade Snacks
              </Link>
              <Link
                href="/wishlist"
                className={"transition hover:text-[#e23744] flex items-center gap-1 " + (
                  isCurrentActive("/wishlist") ? "text-[#e23744] font-semibold" : ""
                )}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Wishlist</span>
              </Link>
              <Link
                href="/cart"
                className={"transition hover:text-[#e23744] flex items-center gap-1 " + (
                  isCurrentActive("/cart") ? "text-[#e23744] font-semibold" : ""
                )}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Cart</span>
              </Link>
              <Link
                href="/orders"
                className={"transition hover:text-[#e23744] " + (
                  isCurrentActive("/orders") ? "text-[#e23744] font-semibold" : ""
                )}
              >
                My Orders
              </Link>
              <Link
                href="/profile"
                className={"transition hover:text-[#e23744] " + (
                  isCurrentActive("/profile") ? "text-[#e23744] font-semibold" : ""
                )}
              >
                Profile
              </Link>
            </nav>
          )}

          {/* 2. HOME COOK (SELLER) NAVIGATION */}
          {user && user.role === "seller" && (
            <nav className="hidden lg:flex items-center gap-5 text-xs font-poppins font-medium text-gray-700">
              <Link
                href="/seller/dashboard"
                className={"transition hover:text-[#e23744] flex items-center gap-1.5 " + (
                  isCurrentActive("/seller/dashboard") ? "text-[#e23744] font-semibold" : ""
                )}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/seller/foods"
                className={"transition hover:text-[#e23744] flex items-center gap-1.5 " + (
                  isCurrentActive("/seller/foods") ? "text-[#e23744] font-semibold" : ""
                )}
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>My Products</span>
              </Link>
              <Link
                href="/seller/orders"
                className={"transition hover:text-[#e23744] flex items-center gap-1.5 " + (
                  isCurrentActive("/seller/orders") ? "text-[#e23744] font-semibold" : ""
                )}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Orders</span>
              </Link>
              <Link
                href="/seller/application-status"
                className={"transition hover:text-[#e23744] flex items-center gap-1.5 " + (
                  isCurrentActive("/seller/application-status") ? "text-[#e23744] font-semibold" : ""
                )}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Kitchen Management</span>
              </Link>
              <Link
                href="/seller/earnings"
                className={"transition hover:text-[#e23744] flex items-center gap-1.5 " + (
                  isCurrentActive("/seller/earnings") ? "text-[#e23744] font-semibold" : ""
                )}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Earnings</span>
              </Link>
              <Link
                href="/profile"
                className={"transition hover:text-[#e23744] " + (
                  isCurrentActive("/profile") ? "text-[#e23744] font-semibold" : ""
                )}
              >
                Profile
              </Link>
            </nav>
          )}

          {/* 3. ADMIN NAVIGATION */}
          {user && isAdminRole(user.role) && (
            <nav className="hidden lg:flex items-center gap-5 text-xs font-poppins font-medium text-gray-700">
              <Link
                href="/admin"
                className={"transition hover:text-[#e23744] flex items-center gap-1.5 " + (
                  pathname === "/admin" ? "text-[#e23744] font-semibold" : ""
                )}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/admin/users"
                className={"transition hover:text-[#e23744] flex items-center gap-1.5 " + (
                  isCurrentActive("/admin/users") ? "text-[#e23744] font-semibold" : ""
                )}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Users</span>
              </Link>
              <Link
                href="/admin/sellers"
                className={"transition hover:text-[#e23744] flex items-center gap-1.5 " + (
                  isCurrentActive("/admin/sellers") ? "text-[#e23744] font-semibold" : ""
                )}
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>Home Cooks</span>
              </Link>
              <Link
                href="/admin/orders"
                className={"transition hover:text-[#e23744] flex items-center gap-1.5 " + (
                  isCurrentActive("/admin/orders") ? "text-[#e23744] font-semibold" : ""
                )}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Orders</span>
              </Link>
              <Link
                href="/admin/deliveries"
                className={"transition hover:text-[#e23744] flex items-center gap-1.5 " + (
                  isCurrentActive("/admin/deliveries") ? "text-[#e23744] font-semibold" : ""
                )}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Deliveries</span>
              </Link>
              <Link
                href="/admin/audit-logs"
                className={"transition hover:text-[#e23744] flex items-center gap-1.5 " + (
                  isCurrentActive("/admin/audit-logs") ? "text-[#e23744] font-semibold" : ""
                )}
              >
                <FileBarChart className="w-3.5 h-3.5" />
                <span>Reports</span>
              </Link>
            </nav>
          )}

          {/* 4. GUEST NAVIGATION */}
          {!user && (
            <nav className="hidden lg:flex items-center gap-6 text-xs font-poppins font-medium text-gray-700">
              <Link
                href="/foods"
                className="hover:text-[#e23744] transition flex items-center gap-1"
              >
                <span>Homemade Snacks</span>
              </Link>
              <Link
                href="/#categories"
                className="hover:text-[#e23744] transition"
              >
                Categories
              </Link>
              <Link
                href="/#top-cooks"
                className="hover:text-[#e23744] transition"
              >
                Top Home Cooks
              </Link>
              <Link
                href="/seller/register"
                className="text-[#e23744] font-semibold hover:text-[#cb202d] transition flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-full border border-red-100"
              >
                <ChefHat className="w-3.5 h-3.5 text-[#e23744]" />
                <span>Sell Homemade Food</span>
              </Link>
            </nav>
          )}

          {/* Action Icons & User Dropdown */}
          <div className="flex items-center gap-3">
            {/* Show Wishlist & Cart for Customer or Guest */}
            {(!user || user.role === "customer") && (
              <>
                <Link
                  href="/wishlist"
                  aria-label="Wishlist"
                  className="relative p-2 rounded-xl text-gray-600 hover:text-rose-600 hover:bg-red-50 transition"
                >
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#e23744] text-white text-[10px] font-bold flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                <Link
                  href="/cart"
                  aria-label="Cart"
                  className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl bg-red-50/80 text-gray-900 hover:bg-red-100/70 transition border border-red-100"
                >
                  <ShoppingBag className="w-4 h-4 text-[#e23744]" />
                  <span className="hidden sm:inline text-xs font-poppins font-medium">Cart</span>
                  {totalItemsCount > 0 && (
                    <span className="w-4.5 h-4.5 px-1 rounded-full bg-[#e23744] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {totalItemsCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* Authenticated User Menu Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition border border-gray-200"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#e23744] text-white text-xs font-bold flex items-center justify-center">
                    {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </div>
                  <span className="hidden sm:inline text-xs font-poppins font-medium text-gray-800 max-w-[100px] truncate">
                    {user.full_name || "My Account"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {user.full_name}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-[#e23744]">
                        {user.role === "seller" ? "Home Cook" : isAdminRole(user.role) ? "Admin" : "Customer"}
                      </span>
                    </div>

                    {/* Role specific links in dropdown */}
                    {user.role === "customer" && (
                      <>
                        <Link
                          href="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition font-poppins"
                        >
                          <User className="w-4 h-4 text-gray-500" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition font-poppins"
                        >
                          <Package className="w-4 h-4 text-gray-500" />
                          <span>My Orders</span>
                        </Link>
                      </>
                    )}

                    {user.role === "seller" && (
                      <>
                        <Link
                          href="/seller/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition font-poppins"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#e23744]" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          href="/seller/foods"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition font-poppins"
                        >
                          <ChefHat className="w-4 h-4 text-[#e23744]" />
                          <span>My Products</span>
                        </Link>
                        <Link
                          href="/seller/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition font-poppins"
                        >
                          <Package className="w-4 h-4 text-[#e23744]" />
                          <span>Orders</span>
                        </Link>
                        <Link
                          href="/seller/application-status"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition font-poppins"
                        >
                          <ClipboardList className="w-4 h-4 text-[#e23744]" />
                          <span>Kitchen Management</span>
                        </Link>
                        <Link
                          href="/seller/earnings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition font-poppins"
                        >
                          <DollarSign className="w-4 h-4 text-[#e23744]" />
                          <span>Earnings</span>
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition font-poppins"
                        >
                          <User className="w-4 h-4 text-gray-500" />
                          <span>Profile</span>
                        </Link>
                      </>
                    )}

                    {isAdminRole(user.role) && (
                      <>
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#e23744] font-semibold hover:bg-red-50 transition font-poppins"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#e23744]" />
                          <span>Admin Dashboard</span>
                        </Link>
                        <Link
                          href="/admin/users"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition font-poppins"
                        >
                          <Users className="w-4 h-4 text-gray-500" />
                          <span>Manage Users</span>
                        </Link>
                        <Link
                          href="/admin/sellers"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition font-poppins"
                        >
                          <ChefHat className="w-4 h-4 text-gray-500" />
                          <span>Manage Home Cooks</span>
                        </Link>
                        <Link
                          href="/admin/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition font-poppins"
                        >
                          <Package className="w-4 h-4 text-gray-500" />
                          <span>Manage Orders</span>
                        </Link>
                        <Link
                          href="/admin/deliveries"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition font-poppins"
                        >
                          <Truck className="w-4 h-4 text-gray-500" />
                          <span>Deliveries</span>
                        </Link>
                        <Link
                          href="/admin/audit-logs"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition font-poppins"
                        >
                          <FileBarChart className="w-4 h-4 text-gray-500" />
                          <span>Reports & Logs</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-100 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition text-left font-poppins font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  id="nav-login-btn"
                  className="px-4 py-2 text-xs font-poppins font-medium text-gray-800 hover:text-[#e23744] hover:bg-red-50/50 rounded-xl border border-gray-200 transition shadow-xs"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  id="nav-signup-btn"
                  className="px-4 py-2 text-xs font-poppins font-medium bg-[#e23744] text-white rounded-xl hover:bg-[#cb202d] transition shadow-sm shadow-[#e23744]/25"
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

      {/* ========================================================================= */}
      {/* MOBILE DRAWER MENU - ROLE SPECIFIC                                       */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in fade-in">
          {/* Language Switcher in Mobile Drawer */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-500">Language / భాష:</span>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLanguage("en")}
                className={"px-3 py-1 rounded text-xs font-bold " + (
                  language === "en" ? "bg-[#e23744] text-white" : "text-gray-700"
                )}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("te")}
                className={"px-3 py-1 rounded text-xs font-bold " + (
                  language === "te" ? "bg-[#e23744] text-white" : "text-gray-700"
                )}
              >
                తెలుగు
              </button>
            </div>
          </div>

          {/* Search bar on mobile */}
          {(!user || user.role === "customer") && (
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search homemade pickles, podis, snacks..."
                className="w-full bg-[#f8f8f8] border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-900 focus:bg-white focus:border-[#e23744] focus:outline-none"
              />
            </form>
          )}

          {/* 1. Mobile Customer Navigation */}
          {user && user.role === "customer" && (
            <div className="flex flex-col space-y-1 text-sm font-poppins font-medium text-gray-700">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <Home className="w-4 h-4 text-[#e23744]" />
                <span>Home</span>
              </Link>
              <Link
                href="/foods"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <UtensilsCrossed className="w-4 h-4 text-[#e23744]" />
                <span>Homemade Snacks</span>
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <Heart className="w-4 h-4 text-[#e23744]" />
                <span>Wishlist</span>
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#e23744]" />
                <span>Cart</span>
              </Link>
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <Package className="w-4 h-4 text-[#e23744]" />
                <span>My Orders</span>
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-[#e23744]" />
                <span>Profile</span>
              </Link>
              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. Mobile Home Cook Navigation */}
          {user && user.role === "seller" && (
            <div className="flex flex-col space-y-1 text-sm font-poppins font-medium text-gray-700">
              <Link
                href="/seller/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-[#e23744]" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/seller/foods"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <ChefHat className="w-4 h-4 text-[#e23744]" />
                <span>My Products</span>
              </Link>
              <Link
                href="/seller/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <Package className="w-4 h-4 text-[#e23744]" />
                <span>Orders</span>
              </Link>
              <Link
                href="/seller/application-status"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <ClipboardList className="w-4 h-4 text-[#e23744]" />
                <span>Kitchen Management</span>
              </Link>
              <Link
                href="/seller/earnings"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4 text-[#e23744]" />
                <span>Earnings</span>
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-[#e23744]" />
                <span>Profile</span>
              </Link>
              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. Mobile Admin Navigation */}
          {user && isAdminRole(user.role) && (
            <div className="flex flex-col space-y-1 text-sm font-poppins font-medium text-gray-700">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-[#e23744]" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-[#e23744]" />
                <span>Users</span>
              </Link>
              <Link
                href="/admin/sellers"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <ChefHat className="w-4 h-4 text-[#e23744]" />
                <span>Home Cooks</span>
              </Link>
              <Link
                href="/admin/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <Package className="w-4 h-4 text-[#e23744]" />
                <span>Orders</span>
              </Link>
              <Link
                href="/admin/deliveries"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-[#e23744]" />
                <span>Deliveries</span>
              </Link>
              <Link
                href="/admin/audit-logs"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2"
              >
                <FileBarChart className="w-4 h-4 text-[#e23744]" />
                <span>Reports</span>
              </Link>
              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. Mobile Guest Navigation */}
          {!user && (
            <div className="space-y-3">
              <div className="flex flex-col space-y-1 text-sm font-poppins font-medium text-gray-700">
                <Link
                  href="/foods"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-red-50"
                >
                  Homemade Snacks
                </Link>
                <Link
                  href="/#categories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-red-50"
                >
                  Categories
                </Link>
                <Link
                  href="/#top-cooks"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-red-50"
                >
                  Home Cooks
                </Link>
                <Link
                  href="/seller/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-[#e23744] font-semibold hover:bg-red-50"
                >
                  Sell Homemade Food
                </Link>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#e23744] text-white font-poppins font-medium text-xs shadow-md shadow-[#e23744]/20"
                >
                  <User className="w-4 h-4" />
                  <span>Log in</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-gray-800 font-poppins font-medium text-xs hover:bg-gray-50 transition"
                >
                  <span>Sign up as Customer</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
