import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { CartProvider } from "@/lib/context/CartContext";
import { WishlistProvider } from "@/lib/context/WishlistContext";
import { ToastProvider } from "@/lib/context/ToastContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Home Plate | Fresh Homemade Food, Delivered to Your Doorstep",
  description:
    "Order authentic, hygienic homemade food from verified home cooks near you. Grandma pickles, homestyle thalis, podis, and pure sweets delivered fresh.",
  keywords: [
    "homemade food",
    "home cook delivery",
    "fresh homemade meals",
    "avakaya pickle",
    "home plate food delivery",
    "hyderabad home cooked food",
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
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen font-sans">
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
      </body>
    </html>
  );
}
