"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { WelcomeLoginScreen } from "@/components/auth/WelcomeLoginScreen";
import { Hero } from "@/components/home/Hero";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { PopularFoodSection } from "@/components/home/PopularFoodSection";
import { TopCooksSection } from "@/components/home/TopCooksSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { BecomeCookCTA } from "@/components/home/BecomeCookCTA";
import { Food, Category, Seller, UserRole } from "@/lib/supabase/types";

interface HomeRootClientProps {
  foods: Food[];
  categories: Category[];
  sellers: Seller[];
}

export const HomeRootClient: React.FC<HomeRootClientProps> = ({
  foods,
  categories,
  sellers,
}) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const isAdminRole = (role?: UserRole) => {
    return role === "admin" || role === "super_admin" || role === "operations_admin" || role === "seller_support";
  };

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "seller") {
        router.replace("/seller/dashboard");
      } else if (isAdminRole(user.role)) {
        router.replace("/admin");
      }
    }
  }, [user, isLoading, router]);

  // Loading indicator with Home Plate branding
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 bg-[#fafafa]">
        <div className="w-10 h-10 border-3 border-[#e23744] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-poppins font-medium text-gray-500">Loading Home Plate...</p>
      </div>
    );
  }

  // 1. Unauthenticated users see dedicated First Screen: Welcome & Login/Signup
  if (!user) {
    return <WelcomeLoginScreen />;
  }

  // 2. Home Cook redirecting state
  if (user.role === "seller") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 bg-[#fafafa]">
        <div className="w-10 h-10 border-3 border-[#e23744] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-poppins font-medium text-gray-700">Opening Home Cook Kitchen Dashboard...</p>
      </div>
    );
  }

  // 3. Admin redirecting state
  if (isAdminRole(user.role)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 bg-[#fafafa]">
        <div className="w-10 h-10 border-3 border-[#e23744] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-poppins font-medium text-gray-700">Opening Administrator Console...</p>
      </div>
    );
  }

  // 4. Authenticated Customer: Displays full Customer Marketplace
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <PopularFoodSection foods={foods} />
      <CategoriesSection categories={categories} />
      <TopCooksSection sellers={sellers} />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <BecomeCookCTA />
    </div>
  );
};
