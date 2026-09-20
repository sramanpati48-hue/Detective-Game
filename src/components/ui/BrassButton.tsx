import React from "react";
import { cn } from "@/lib/utils";

export interface BrassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const BrassButton = React.forwardRef<HTMLButtonElement, BrassButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-serif transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none rounded-sm uppercase tracking-wider relative overflow-hidden",
          {
            "bg-brass text-ink hover:bg-brass-light hover:shadow-[0_0_15px_rgba(201,154,60,0.4)]": variant === "primary",
            "bg-charcoal text-brass border border-brass/30 hover:bg-charcoal/80 hover:border-brass/70": variant === "secondary",
            "bg-transparent text-paper-muted hover:text-brass hover:bg-charcoal/30": variant === "ghost",
            "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 hover:border-danger": variant === "danger",
            "px-3 py-1.5 text-xs": size === "sm",
            "px-6 py-2 text-sm": size === "md",
            "px-8 py-3 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
BrassButton.displayName = "BrassButton";
