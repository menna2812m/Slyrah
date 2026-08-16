"use client";

import type { ProductVariant, SizeOption } from "@/lib/api/types";
import { cn } from "@/lib/utils";

/**
 * Sizes are set in the mono face so the grid reads like a spec table, and
 * every unavailable size stays visible but disabled — a size that vanishes is
 * a size you keep looking for.
 */
export function SizePicker({
  sizes,
  selectedId,
  availability,
  onSelect,
  className,
}: {
  sizes: SizeOption[];
  selectedId: string | null;
  availability: Map<string, ProductVariant | undefined>;
  onSelect: (sizeId: string) => void;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label="Size" className={cn("flex flex-wrap gap-2", className)}>
      {[...sizes]
        .sort((a, b) => a.order - b.order)
        .map((size) => {
          const variant = availability.get(size.id);
          const soldOut = !variant || variant.stockStatus === "out-of-stock";
          const low = variant?.stockStatus === "low-stock";
          const selected = selectedId === size.id;

          return (
            <button
              key={size.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`Size ${size.label}${soldOut ? " — sold out" : low ? " — only a few left" : ""}`}
              disabled={soldOut}
              onClick={() => onSelect(size.id)}
              className={cn(
                "relative min-w-[3.25rem] rounded-sm border px-3 py-2.5 font-mono text-[0.8125rem] tabular-nums transition-all duration-200",
                selected
                  ? "border-ink bg-ink text-chalk"
                  : soldOut
                    ? "border-mist text-clay/60"
                    : "border-mist text-ink hover:border-ink/60",
              )}
            >
              {size.label}
              {soldOut ? (
                <svg viewBox="0 0 60 40" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full text-clay/45" preserveAspectRatio="none">
                  <path d="M4 36L56 4" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                </svg>
              ) : low && !selected ? (
                // Sits inside the button — a dot floating outside it reads as
                // a stray mark rather than a note about this size.
                <span aria-hidden="true" className="absolute end-1 top-1 h-1 w-1 rounded-full bg-warning" />
              ) : null}
            </button>
          );
        })}
    </div>
  );
}
