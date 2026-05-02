import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-[length:var(--font-size-body-l)] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-[var(--button-background-disabled)] disabled:text-[var(--button-foreground-disabled)] min-h-[48px]",
  {
    variants: {
      variant: {
        default: "bg-[var(--button-background-primary-solid)] text-[var(--button-foreground-primary-on-solid)] hover:opacity-80",
        destructive:
          "bg-[var(--button-background-negative-solid)] text-[var(--button-foreground-negative-on-solid)] hover:opacity-90",
        outline:
          "border border-[var(--button-stroke-primary)] bg-transparent text-[var(--button-foreground-primary-on-transparent)] hover:bg-[var(--button-background-primary-subtle)] hover:text-[var(--button-foreground-primary-on-subtle)]",
        secondary:
          "bg-[var(--button-background-secondary-subtle)] text-[var(--button-foreground-secondary-on-subtle)] hover:bg-[var(--background-secondary-lighter)]",
        ghost: "hover:bg-[var(--background-neutral-medium)] hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-[var(--spacing-xl)] py-2",
        sm: "h-8 px-[var(--spacing-md)] text-xs",
        lg: "h-10 px-[var(--spacing-4xl)]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
