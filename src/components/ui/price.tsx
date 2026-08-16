import type { Money } from "@/lib/api/types";
import { discountPercent, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Prices are set in the mono face with tabular figures so a column of them
 * lines up and a discount is legible at a glance.
 */
export function Price({
  price,
  compareAt,
  size = "md",
  className,
}: {
  price: Money;
  compareAt?: Money | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const percent = discountPercent(price, compareAt);

  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5 font-mono tabular-nums",
        size === "sm" && "text-[0.8125rem]",
        size === "md" && "text-[0.9375rem]",
        size === "lg" && "text-lg",
        className,
      )}
      data-numeric
    >
      <span className={cn(percent ? "text-sale" : "text-ink")}>{formatMoney(price)}</span>
      {percent ? (
        <>
          <s className="text-clay decoration-clay/60">{formatMoney(compareAt)}</s>
          <span className="text-[0.6875rem] uppercase tracking-[0.1em] text-sale">−{percent}%</span>
        </>
      ) : null}
    </span>
  );
}
