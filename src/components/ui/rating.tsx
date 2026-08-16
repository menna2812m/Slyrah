import { cn } from "@/lib/utils";

const STAR_PATH = "M10 1.6l2.47 5.3 5.53.62-4.1 3.9 1.09 5.58L10 14.2l-4.99 2.8L6.1 11.4 2 7.52l5.53-.62z";

/**
 * Partial stars are clipped rather than gradient-filled — a gradient needs an
 * id, and ids repeat once there is more than one rating on a page.
 */
function Star({ fill }: { fill: number }) {
  return (
    <span className="relative inline-block h-3.5 w-3.5 shrink-0">
      <svg viewBox="0 0 20 20" aria-hidden="true" className="absolute inset-0 h-full w-full">
        <path d={STAR_PATH} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      </svg>
      {fill > 0 ? (
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          style={{ clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }}
        >
          <path d={STAR_PATH} fill="currentColor" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  );
}

export function Rating({
  value,
  count,
  showCount = true,
  className,
}: {
  value: number;
  count?: number;
  showCount?: boolean;
  className?: string;
}) {
  const label = count != null ? `${value} out of 5, from ${count} reviews` : `${value} out of 5`;

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-peony", className)} title={label}>
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="inline-flex gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} fill={Math.max(0, Math.min(1, value - i))} />
        ))}
      </span>
      {showCount && count != null ? (
        <span aria-hidden="true" className="font-mono text-[0.75rem] text-clay" data-numeric>
          {value.toFixed(1)} ({count})
        </span>
      ) : null}
    </span>
  );
}
