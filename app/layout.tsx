import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { CartProvider } from "@/lib/context/CartContext";
import { WishlistProvider } from "@/lib/context/WishlistContext";
import { ToastProvider } from "@/lib/context/ToastContext";
import { LanguageProvider } from "@/lib/context/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Home Plate | Homemade Goodness, Delivered with Love",
  description:
    "Discover authentic homemade snacks, pure sweets, sun-cured pickles, aromatic podis, and healthy delicacies crafted by verified homemakers and home cooks across Hyderabad.",
  keywords: [
    "homemade food",
    "home plate",
    "hyderabad homemade snacks",
    "traditional sweets",
    "andhra avakaya pickle",
    "kandi podi",
    "healthy millet snacks",
    "hyderabad home cooks",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=Poppins:wght@400;500;600;700;800&family=Noto+Sans+Telugu:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen font-lato bg-[#fffdfa] text-gray-900">
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <ToastProvider>
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </ToastProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
