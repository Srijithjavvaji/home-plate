"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "te";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
}

const DICTIONARY: Record<Language, Record<string, string>> = {
  en: {
    tagline: "Homemade Goodness, Delivered with Love.",
    home: "Home",
    categories: "Categories",
    search: "Search",
    wishlist: "Wishlist",
    cart: "Cart",
    my_orders: "My Orders",
    profile: "Profile",
    popular_foods: "Popular Homemade Delicacies",
    top_cooks: "Featured Home Cooks",
    how_it_works: "How Home Plate Works",
    why_choose_us: "Why Choose Home Plate",
    pure_veg: "Pure Veg Only",
    add_to_cart: "Add to Cart",
    checkout: "Proceed to Checkout",
    min_order_note: "Minimum order value is ₹149",
    free_delivery_note: "Free delivery on orders above ₹500",
    order_success: "Order Placed Successfully!",
    track_order: "Track Order",
    support_chat: "Customer Support",
    hyderabad_location: "Hyderabad, Telangana",
    traditional_snacks: "Traditional Homemade Snacks",
    homemade_sweets: "Homemade Sweets",
    pickles: "Pickles",
    podis: "Podis",
    healthy_snacks: "Healthy Snacks",
    regional_specialities: "Regional Specialities",
  },
  te: {
    tagline: "ప్రేమతో వండిన రుచికరమైన ఇంటి ఆహారం, మీ ముంగిట్లోకి.",
    home: "హోమ్",
    categories: "విభాగాలు",
    search: "వెతకండి",
    wishlist: "ఇష్టమైనవి",
    cart: "షాపింగ్ కార్ట్",
    my_orders: "నా ఆర్డర్లు",
    profile: "ప్రొఫైల్",
    popular_foods: "ప్రజాదరణ పొందిన ఇంటి వంటకాలు",
    top_cooks: "నైపుణ్యం గల గృహిణులు",
    how_it_works: "హోమ్ ప్లేట్ ఎలా పనిచేస్తుంది",
    why_choose_us: "హోమ్ ప్లేట్ ఎందుకు ఎంచుకోవాలి",
    pure_veg: "కేవలం శుద్ధ శాకాహారం",
    add_to_cart: "కార్ట్‌కు జోడించు",
    checkout: "చెల్లింపుకు కొనసాగండి",
    min_order_note: "కనిష్ట ఆర్డర్ మొత్తం ₹149",
    free_delivery_note: "₹500 పైన ఉచిత డెలివరీ",
    order_success: "ఆర్డర్ విజయవంతంగా నమోదైంది!",
    track_order: "ఆర్డర్ ట్రాక్ చేయండి",
    support_chat: "కస్టమర్ సపోర్ట్",
    hyderabad_location: "హైదరాబాద్, తెలంగాణ",
    traditional_snacks: "సంప్రదాయ ఇంటి చిరుతిళ్ళు",
    homemade_sweets: "స్వచ్ఛమైన ఇంటి మిఠాయిలు",
    pickles: "ఘుమఘుమలాడే నిల్వ పచ్చళ్ళు",
    podis: "కమ్మనైన కారపు పొడులు",
    healthy_snacks: "ఆరోగ్యకరమైన చిరుతిళ్ళు",
    regional_specialities: "ప్రాంతీయ విశేషాలు",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("homeplate_lang") as Language;
    if (saved === "en" || saved === "te") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("homeplate_lang", lang);
  };

  const t = (key: string, defaultText?: string): string => {
    return DICTIONARY[language]?.[key] || defaultText || DICTIONARY.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
