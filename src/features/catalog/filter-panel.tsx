"use client";

import { Butterfly } from "@/components/ui/butterfly";
import type { ProductFacets, ProductQuery } from "@/lib/api/types";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Everything after fabric. Order follows the discovery hierarchy — cut, then
 * closure, then size, then colour — and unavailable values stay in place,
 * disabled, so the list never reshuffles under your finger.
 */

const PRICE_BANDS: { label: string; min?: number; max?: number }[] = [
  { label: "Under 400", max: 40000 },
  { label: "400 – 700", min: 40000, max: 70000 },
  { label: "700 – 1,200", min: 70000, max: 120000 },
  { label: "1,200 +", min: 120000 },
];

export function FilterPanel({
  facets,
  query,
  onChange,
  className,
}: {
  facets: ProductFacets;
  query: ProductQuery;
  onChange: (next: Partial<ProductQuery>) => void;
  className?: string;
}) {
  function toggleList(key: "cuts" | "closures" | "sizes" | "colors", value: string) {
    const current = query[key] ?? [];
    onChange({
      [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    });
  }

  const activePriceBand = PRICE_BANDS.find(
    (band) => band.min === query.priceMin && band.max === query.priceMax,
  );

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <FilterGroup title="Cut">
        <ChipList>
          {facets.cuts.map((cut) => (
            <Chip
              key={cut.id}
              label={cut.label}
              count={cut.count}
              selected={(query.cuts ?? []).includes(cut.slug)}
              disabled={cut.disabled}
              onClick={() => toggleList("cuts", cut.slug)}
            />
          ))}
        </ChipList>
      </FilterGroup>

      <FilterGroup title="Closure">
        <ChipList>
          {facets.closures.map((closure) => (
            <Chip
              key={closure.id}
              label={closure.label}
              count={closure.count}
              selected={(query.closures ?? []).includes(closure.slug)}
              disabled={closure.disabled}
              onClick={() => toggleList("closures", closure.slug)}
            />
          ))}
        </ChipList>
      </FilterGroup>

      <FilterGroup title="Size">
        <div className="flex flex-wrap gap-2">
          {facets.sizes.map((size) => {
            const selected = (query.sizes ?? []).includes(size.slug);
            return (
              <button
                key={size.id}
                type="button"
                aria-pressed={selected}
                disabled={size.disabled && !selected}
                onClick={() => toggleList("sizes", size.slug)}
                className={cn(
                  "min-w-[3rem] rounded-sm border px-2.5 py-2 font-mono text-[0.75rem] tabular-nums transition-colors",
                  selected
                    ? "border-ink bg-ink text-chalk"
                    : size.disabled
                      ? "border-mist text-clay/50"
                      : "border-mist text-ink hover:border-ink/60",
                )}
              >
                {size.label}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Colour">
        {/* One column: colour names like "Cotton White" and "Deep Plum" truncate
            in two, and a truncated colour name is useless. */}
        <ul className="flex flex-col gap-1">
          {facets.colors.map((color) => {
            const selected = (query.colors ?? []).includes(color.slug);
            return (
              <li key={color.id}>
                <button
                  type="button"
                  aria-pressed={selected}
                  disabled={color.disabled && !selected}
                  onClick={() => toggleList("colors", color.slug)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-sm px-1.5 py-1.5 text-start transition-colors",
                    selected ? "bg-shell" : "hover:bg-shell/60",
                    color.disabled && !selected && "cursor-not-allowed opacity-45",
                  )}
                >
                  <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full", selected && "edge-iris")}>
                    <Butterfly hex={color.swatchHex ?? "#ccc"} hexShift={color.swatchHexShift} className="h-4.5 w-4.5" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[0.875rem] text-ink">{color.label}</span>
                  <span className="font-mono text-[0.6875rem] text-clay" data-numeric>
                    {color.count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      <FilterGroup title="Price">
        <ChipList>
          {PRICE_BANDS.map((band) => {
            const selected = activePriceBand?.label === band.label;
            return (
              <Chip
                key={band.label}
                label={band.label}
                selected={selected}
                onClick={() =>
                  onChange(
                    selected
                      ? { priceMin: undefined, priceMax: undefined }
                      : { priceMin: band.min, priceMax: band.max },
                  )
                }
              />
            );
          })}
        </ChipList>
        <p className="mt-2.5 text-[0.75rem] text-clay">
          Everything here runs {formatMoney({ amount: facets.priceRange.min, currency: "EGP" })} to{" "}
          {formatMoney({ amount: facets.priceRange.max, currency: "EGP" })}.
        </p>
      </FilterGroup>

      <FilterGroup title="Availability">
        <ChipList>
          <Chip
            label="In stock only"
            selected={Boolean(query.inStockOnly)}
            onClick={() => onChange({ inStockOnly: !query.inStockOnly })}
          />
          <Chip
            label="On sale"
            selected={Boolean(query.onSaleOnly)}
            onClick={() => onChange({ onSaleOnly: !query.onSaleOnly })}
          />
        </ChipList>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-eyebrow mb-3">{title}</h3>
      {children}
    </section>
  );
}

function ChipList({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Chip({
  label,
  count,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  count?: number;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled && !selected}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.8125rem] transition-colors",
        selected
          ? "border-ink bg-ink text-chalk"
          : disabled
            ? "border-mist text-clay/50"
            : "border-mist text-graphite hover:border-ink/50 hover:text-ink",
      )}
    >
      {label}
      {count != null ? (
        <span className={cn("font-mono text-[0.625rem]", selected ? "text-chalk/60" : "text-clay")} data-numeric>
          {count}
        </span>
      ) : null}
    </button>
  );
}
