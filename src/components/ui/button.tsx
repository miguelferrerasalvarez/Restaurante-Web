"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-[--wine] text-[--paper] hover:bg-[--wine-dark] focus-visible:ring-[--wine]": variant === "primary",
            "border border-[--wine] text-[--wine] hover:bg-[--wine] hover:text-[--paper] focus-visible:ring-[--wine]": variant === "secondary",
            "text-[--ink-soft] hover:text-[--ink] hover:bg-[--paper-dark]": variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500": variant === "danger",
          },
          {
            "text-sm px-3 py-1.5 rounded": size === "sm",
            "text-sm px-5 py-2.5 rounded": size === "md",
            "text-base px-7 py-3.5 rounded": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
