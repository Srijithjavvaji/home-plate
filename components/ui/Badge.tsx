import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  const variantStyles = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    warning: "bg-amber-50 text-amber-800 border border-amber-200/60",
    danger: "bg-rose-50 text-rose-700 border border-rose-200/60",
    info: "bg-sky-50 text-sky-700 border border-sky-200/60",
    outline: "border border-gray-300 text-gray-700",
  };

  return (
    <span
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
};
