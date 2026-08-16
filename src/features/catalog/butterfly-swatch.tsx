"use client";

import { Butterfly } from "@/components/ui/butterfly";
import type { ColorOption } from "@/lib/api/types";
import { cn } from "@/lib/utils";

/**
 * The colour chooser.
 *
 * Each swatch is one butterfly whose two wings carry the same colour at two
 * light angles — the flat face and the shadow side. That is what the fabric
 * actually does, so the swatch previews the thing it is naming rather than
 * flattening it to a dot. Selecting opens the wings; iridescence appears on
 * the ring, never as a fill.
 */
export function ButterflySwatch({
  color,
  selected,
  unavailable,
  size = "md",
  onSelect,
  name = "color",
}: {
  color: ColorOption;
  selected: boolean;
  unavailable?: boolean;
  size?: "sm" | "md" | "lg";
  onSelect: (color: ColorOption) => void;
  name?: string;
}) {
  const box = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const wing = size === "sm" ? "h-5 w-5" : size === "lg" ? "h-8 w-8" : "h-6.5 w-6.5";

  return (
    <button
      type="button"
      role="radio"
      name={name}
      aria-checked={selected}
      aria-label={`${color.name}${unavailable ? " — sold out" : ""}`}
      title={color.name}
      disabled={unavailable}
      onClick={() => onSelect(color)}
      className={cn(
        "relative grid shrink-0 place-items-center rounded-full transition-transform duration-300 ease-[var(--ease-wing)]",
        box,
        selected && "edge-iris scale-105",
        !selected && !unavailable && "hover:scale-105",
        unavailable && "cursor-not-allowed opacity-45",
      )}
    >
      <Butterfly hex={color.hex} hexShift={color.hexShift} className={wing} animate={selected} />

      {unavailable ? (
        <svg viewBox="0 0 40 40" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full text-ink/45">
          <path d="M8 32L32 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ) : null}
    </button>
  );
}

/** Compact, non-interactive version for product cards. */
export function SwatchRow({
  colors,
  unavailableIds = [],
  max = 5,
  className,
}: {
  colors: ColorOption[];
  unavailableIds?: string[];
  max?: number;
  className?: string;
}) {
  const shown = colors.slice(0, max);
  const overflow = colors.length - shown.length;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="sr-only">
        Available in {colors.map((c) => c.name).join(", ")}
        {unavailableIds.length ? `. Sold out: ${colors.filter((c) => unavailableIds.includes(c.id)).map((c) => c.name).join(", ")}` : ""}
      </span>
      {shown.map((color) => (
        <span
          key={color.id}
          aria-hidden="true"
          title={color.name}
          className={cn("block", unavailableIds.includes(color.id) && "opacity-35")}
        >
          <Butterfly hex={color.hex} hexShift={color.hexShift} className="h-4 w-4" />
        </span>
      ))}
      {overflow > 0 ? (
        <span aria-hidden="true" className="ms-0.5 font-mono text-[0.6875rem] text-clay">
          +{overflow}
        </span>
      ) : null}
    </div>
  );
}
