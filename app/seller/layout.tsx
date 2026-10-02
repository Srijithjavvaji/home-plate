import React from "react";
import { SellerNav } from "@/components/layout/SellerNav";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <SellerNav />
      <div className="flex-1">{children}</div>
    </div>
  );
}
