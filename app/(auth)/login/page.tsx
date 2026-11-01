"use client";

import React, { Suspense } from "react";
import { WelcomeLoginScreen } from "@/components/auth/WelcomeLoginScreen";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#e23744] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <WelcomeLoginScreen />
    </Suspense>
  );
}
