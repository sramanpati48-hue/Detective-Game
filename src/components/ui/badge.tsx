import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
        dossier:
          "rounded-xs border border-[#8C6D37]/50 bg-[#1E140C]/90 font-mono text-[9.5px] uppercase font-bold tracking-widest text-[#FAF4E8]",
        brass:
          "rounded-xs border border-[#C99A3C]/70 bg-[#241A12]/95 font-mono text-[9px] uppercase font-bold tracking-widest text-[#E8C66A] shadow-xs",
        burgundy:
          "rounded-xs border border-[#A84743] bg-[#7A1F24]/90 font-mono text-[9px] uppercase font-bold tracking-widest text-[#FAF4E8] shadow-xs",
        available:
          "rounded-xs border border-[#C99A3C]/50 bg-[#101720]/80 font-mono text-[10px] uppercase tracking-widest text-[#C99A3C] backdrop-blur-xs",
        solved:
          "rounded-xs border border-[#719C70]/50 bg-[#101720]/80 font-mono text-[10px] uppercase tracking-widest text-[#719C70] backdrop-blur-xs",
        inProgress:
          "rounded-xs border border-[#E6A23C]/50 bg-[#101720]/80 font-mono text-[10px] uppercase tracking-widest text-[#E6A23C] backdrop-blur-xs",
        locked:
          "rounded-xs border border-[#BAC1C8]/30 bg-[#101720]/80 font-mono text-[10px] uppercase tracking-widest text-[#BAC1C8]/70 backdrop-blur-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
