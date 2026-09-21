import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonVariant = React.ComponentProps<typeof Button>["variant"];

export interface BrassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "brass" | "burgundy";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const BrassButton = React.forwardRef<HTMLButtonElement, BrassButtonProps>(
  ({ className, variant = "primary", size = "md", asChild, ...props }, ref) => {
    const mappedVariant: ButtonVariant = 
      variant === "primary" ? "brass" :
      variant === "secondary" ? "brassOutline" :
      variant === "danger" ? "destructive" :
      variant === "ghost" ? "ghost" :
      variant === "burgundy" ? "burgundy" :
      variant === "brass" ? "brass" :
      "brass";

    const mappedSize: React.ComponentProps<typeof Button>["size"] =
      size === "sm" ? "sm" :
      size === "lg" ? "lg" :
      "default";

    return (
      <Button
        ref={ref}
        asChild={asChild}
        variant={mappedVariant}
        size={mappedSize}
        className={cn("tracking-wider font-serif", className)}
        {...props}
      />
    );
  }
);
BrassButton.displayName = "BrassButton";
