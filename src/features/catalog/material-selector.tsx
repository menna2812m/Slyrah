"use client";

import { weaveStyle } from "@/components/ui/media";
import type { FacetValue, WeavePattern } from "@/lib/api/types";
import { cn } from "@/lib/utils";

/**
 * The first layer of discovery.
 *
 * Fabric is the decision that actually changes how a piece feels, so it gets
 * the whole width and a real preview of the weave rather than an icon. Choosing
 * one narrows everything below it; the active chip gets the iridescent edge.
 */

const WEAVE_BY_SLUG: Record<string, { weave: WeavePattern; tone: string; note: string }> = {
  "egyptian-cotton": { weave: "jersey", tone: "#E2D9CD", note: "Breathes best" },
  "ribbed-modal": { weave: "rib", tone: "#D6CBD3", note: "Holds its shape" },
  "seamless-microfibre": { weave: "microfibre", tone: "#DED6D2", note: "Shows nothing" },
  "cotton-lace": { weave: "lace", tone: "#B78397", note: "Soft-ground" },
  "airy-mesh": { weave: "mesh", tone: "#A8B3A6", note: "For the heat" },
  "washed-satin": { weave: "satin", tone: "#C0A8B8", note: "Matte, not shiny" },
};

export function MaterialSelector({
  materials,
  selected,
  onToggle,
  className,
}: {
  materials: FacetValue[];
  selected: string[];
  onToggle: (slug: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("", className)}>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 className="text-eyebrow">Start with the fabric</h2>
        {selected.length > 0 ? (
          <button
            type="button"
            onClick={() => selected.forEach(onToggle)}
            className="text-[0.8125rem] text-clay underline-offset-4 hover:text-ink hover:underline"
          >
            Show all fabrics
          </button>
        ) : null}
      </div>

      <ul className="rail scrollbar-none -mx-[var(--spacing-gutter)] gap-2.5 px-[var(--spacing-gutter)] pb-1 lg:mx-0 lg:grid lg:grid-cols-6 lg:px-0">
        {materials.map((material) => {
          const texture = WEAVE_BY_SLUG[material.slug] ?? { weave: "jersey" as WeavePattern, tone: "#DED6D2", note: "" };
          const isSelected = selected.includes(material.slug);

          return (
            <li key={material.id} className="w-[9.5rem] lg:w-auto">
              <button
                type="button"
                aria-pressed={isSelected}
                disabled={material.disabled && !isSelected}
                onClick={() => onToggle(material.slug)}
                className={cn(
                  "group flex w-full flex-col overflow-hidden rounded-md border bg-chalk text-start transition-all duration-300",
                  isSelected ? "edge-iris border-transparent" : "border-mist hover:border-clay/60",
                  material.disabled && !isSelected && "cursor-not-allowed opacity-40",
                )}
              >
                <span
                  aria-hidden="true"
                  className="block h-16 w-full transition-transform duration-500 ease-[var(--ease-drape)] group-hover:scale-105"
                  style={weaveStyle(texture.weave, texture.tone)}
                />
                <span className="flex flex-col gap-0.5 p-3">
                  <span className="text-[0.875rem] leading-tight text-ink">{material.label}</span>
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-clay" data-numeric>
                    {material.count} {material.count === 1 ? "piece" : "pieces"}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
