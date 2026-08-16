import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Butterfly } from "@/components/ui/butterfly";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "quiet" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-ink text-chalk hover:bg-aubergine active:bg-aubergine-deep",
  secondary: "bg-transparent text-ink border border-ink/25 hover:border-ink/60 hover:bg-ink/[0.03]",
  quiet: "bg-chalk text-ink border border-mist hover:border-clay/60 shadow-[0_1px_2px_rgb(34_29_35_/_0.04)]",
  ghost: "bg-transparent text-graphite hover:text-ink hover:bg-ink/[0.04]",
  inverse: "bg-chalk text-ink hover:bg-white",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[0.8125rem] gap-1.5",
  md: "h-11 px-5 text-[0.9375rem] gap-2",
  lg: "h-[3.25rem] px-7 text-base gap-2.5",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex select-none items-center justify-center rounded-sm font-medium leading-none",
    "transition-[background-color,border-color,color,transform] duration-200 ease-[var(--ease-drape)]",
    "active:translate-y-px disabled:pointer-events-none disabled:opacity-40",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  /** Shown in place of children while `loading`. Keep the same verb tense. */
  loadingLabel?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  loadingLabel,
  icon,
  fullWidth,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses(variant, size, cn(fullWidth && "w-full", className))}
    >
      {loading ? (
        <>
          <Butterfly
            variant={variant === "primary" ? "outline" : "duochrome"}
            filled={variant !== "primary"}
            className="h-4 w-4 motion-safe:[animation:slyrah-wing_1.2s_var(--ease-drape)_infinite]"
          />
          {loadingLabel ?? children}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}
