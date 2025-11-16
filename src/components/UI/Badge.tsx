// src/components/ui/Badge.tsx
import { type ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "secondary" | "success" | "warning";
  className?: string;
}

const variantStyles = {
  default: "bg-teal-100 text-teal-800",
  secondary: "bg-gray-100 text-gray-700",
  success: "bg-green-100 text-green-800",
  warning: "bg-amber-100 text-amber-800",
};

export const Badge = ({
  children,
  variant = "default",
  className = "",
}: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
