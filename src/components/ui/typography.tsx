import { cn } from "@/lib/utils";
import React from "react";

export function TypographyHeader({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "text-[length:var(--font-size-headline-s)] leading-[var(--line-height-headline-s)] lg:text-[length:var(--font-size-display-s)] lg:leading-[var(--line-height-display-s)] font-semibold text-[var(--foreground-neutral-default)]",
        className
      )}
      {...props}
    />
  );
}

export function TypographySubHeader({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-[length:var(--font-size-title-m)] leading-[var(--line-height-title-m)] lg:text-[length:var(--font-size-title-l)] lg:leading-[var(--line-height-title-l)] font-normal text-[var(--foreground-neutral-light)]",
        className
      )}
      {...props}
    />
  );
}

export function TypographyTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-[length:var(--font-size-title-m)] leading-[var(--line-height-title-m)] lg:text-[length:var(--font-size-title-l)] lg:leading-[var(--line-height-title-l)] font-semibold text-[var(--foreground-neutral-default)]",
        className
      )}
      {...props}
    />
  );
}

export function TypographySubTitle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-[length:var(--font-size-body-m)] leading-[var(--line-height-body-m)] lg:text-[length:var(--font-size-body-l)] lg:leading-[var(--line-height-body-l)] font-normal text-[var(--foreground-neutral-light)]",
        className
      )}
      {...props}
    />
  );
}

export function TypographyP({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-[length:var(--font-size-label-l)] leading-[var(--line-height-label-l)] font-normal text-[var(--foreground-neutral-light)]",
        className
      )}
      {...props}
    />
  );
}

export function TypographyTitleP({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-[length:var(--font-size-label-l)] leading-[var(--line-height-label-l)] font-semibold text-[var(--foreground-neutral-default)]",
        className
      )}
      {...props}
    />
  );
}

export function TypographySubTitleP({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-[length:var(--font-size-label-l)] leading-[var(--line-height-label-l)] font-normal text-[var(--foreground-neutral-lighter)]",
        className
      )}
      {...props}
    />
  );
}
