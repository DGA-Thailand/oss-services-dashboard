import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-[10px] py-[var(--spacing-xxs)] text-[length:var(--font-size-label-m)] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--badge-background-primary,#00b274)] text-white hover:opacity-80",
        secondary:
          "border-[var(--stroke-secondary-lighter)] bg-[var(--background-secondary-lighter)] text-[var(--foreground-secondary-default)] hover:opacity-80",
        destructive:
          "border-transparent bg-[var(--badge-background-default,#d92d20)] text-white hover:opacity-80",
        outline: "text-[var(--foreground)]",
        success: "border-transparent bg-[var(--background-positive-medium,#17b26a)] text-white hover:opacity-80",
        warning: "border-transparent bg-[var(--background-warning-medium,#f79009)] text-white hover:opacity-80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
