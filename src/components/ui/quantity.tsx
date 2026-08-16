"use client";

import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  min = 1,
  max = 20,
  onChange,
  label = "Quantity",
  size = "md",
  disabled,
  className,
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
  label?: string;
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
}) {
  const button =
    "grid place-items-center text-ink transition-colors hover:bg-shell disabled:pointer-events-none disabled:text-clay/50";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm border border-mist bg-chalk",
        disabled && "opacity-50",
        className,
      )}
    >
      <button
        type="button"
        className={cn(button, size === "sm" ? "h-9 w-9" : "h-11 w-11", "rounded-s-sm")}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        aria-label={`Decrease ${label.toLowerCase()}`}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3">
          <path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <span
        className={cn("min-w-8 text-center font-mono text-[0.9375rem] text-ink", size === "sm" && "text-[0.8125rem]")}
        data-numeric
        aria-live="polite"
      >
        <span className="sr-only">{label}: </span>
        {value}
      </span>

      <button
        type="button"
        className={cn(button, size === "sm" ? "h-9 w-9" : "h-11 w-11", "rounded-e-sm")}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
