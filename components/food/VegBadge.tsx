import React from "react";
import { cn } from "@/lib/utils";

interface VegBadgeProps {
  isVeg: boolean;
  className?: string;
  size?: "sm" | "md";
}

export const VegBadge: React.FC<VegBadgeProps> = ({ isVeg, className, size = "md" }) => {
  const containerSize = size === "sm" ? "w-3.5 h-3.5 p-[2px]" : "w-4 h-4 p-[3px]";
  const dotSize = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";

  return (
    <div
      title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
      className={cn(
        "inline-flex items-center justify-center rounded-sm border shrink-0 bg-white",
        containerSize,
        isVeg ? "border-emerald-600" : "border-amber-800",
        className
      )}
    >
      <div
        className={cn(
          "rounded-full",
          dotSize,
          isVeg ? "bg-emerald-600" : "bg-amber-800"
        )}
      />
    </div>
  );
};
