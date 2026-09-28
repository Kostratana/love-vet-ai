import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------------- Glass card ---------------- */

export const panelVariants = cva("rounded-xl", {
  variants: {
    variant: {
      glass: "glass",
      solid: "glass-solid",
      ice: "surface-ice border border-silver-strong/50 shadow-[var(--shadow-glass)]",
    },
    glow: { true: "glow-panel", false: "" },
    pad: { none: "", sm: "p-4", md: "p-5 sm:p-6", lg: "p-6 sm:p-8" },
  },
  defaultVariants: { variant: "glass", glow: false, pad: "md" },
});

export function GlassCard({
  className,
  variant,
  glow,
  pad,
  children,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof panelVariants>) {
  return (
    <div className={cn(panelVariants({ variant, glow, pad }), className)} {...props}>
      {children}
    </div>
  );
}

/* ---------------- Buttons ---------------- */

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-0",
  {
    variants: {
      variant: {
        primary:
          "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--glow-primary)] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-12px_oklch(0.4637_0.0709_240.7_/_55%),0_0_0_1px_oklch(0.4637_0.0709_240.7_/_35%)]",
        secondary:
          "glass text-navy hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)]",
        ghost: "text-graphite hover:bg-silver-white hover:text-navy",
        critical:
          "bg-destructive text-destructive-foreground shadow-[0_10px_26px_-12px_oklch(0.5785_0.2061_23.19_/_55%)] hover:-translate-y-0.5",
        outline:
          "border border-silver-strong/70 bg-card text-navy hover:-translate-y-0.5 hover:shadow-[var(--shadow-glass)]",
      },
      size: {
        sm: "h-9 px-3.5",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-[0.95rem]",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function GlowButton({
  className,
  variant,
  size,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

/* ---------------- Status badge ---------------- */

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.08em] uppercase",
  {
    variants: {
      tone: {
        neutral: "border-silver-strong/60 bg-silver-white text-graphite",
        info: "border-ice-lum/70 bg-ice text-deep",
        attention: "border-silver-strong bg-card text-navy",
        critical: "border-destructive/40 bg-destructive/8 text-destructive",
        success: "border-ice-lum/70 bg-ice text-deep",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function StatusBadge({
  children,
  tone,
  className,
}: { children: ReactNode; className?: string } & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)}>{children}</span>;
}

export function priorityTone(priority: string) {
  switch (priority) {
    case "EMERGENCY":
      return "critical" as const;
    case "NEEDS ATTENTION":
      return "attention" as const;
    case "SAME-DAY":
      return "info" as const;
    default:
      return "neutral" as const;
  }
}

/* ---------------- Small typographic helpers ---------------- */

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-graphite",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-graphite">
      {children}
    </p>
  );
}

export function LanguageIndicator({ from, to }: { from: string; to?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-silver-strong/60 bg-card px-2 py-1 text-xs font-medium text-graphite">
      <span className="size-1.5 rounded-full bg-ice-lum" aria-hidden />
      {from}
      {to ? <span className="text-silver-strong">→</span> : null}
      {to ? <span className="text-navy">{to}</span> : null}
    </span>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs leading-relaxed text-graphite">
      {children}
    </p>
  );
}
