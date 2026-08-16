import type { ProductBadge, StockStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const BADGE_STYLE: Record<ProductBadge, string> = {
  new: "bg-ink text-chalk",
  bestseller: "bg-iris-soft text-iris",
  sale: "bg-sale text-white",
  "low-stock": "bg-warning-soft text-warning",
  "back-in-stock": "bg-success-soft text-success",
};

const BADGE_LABEL: Record<ProductBadge, string> = {
  new: "New",
  bestseller: "Bestseller",
  sale: "Sale",
  "low-stock": "Almost gone",
  "back-in-stock": "Back in stock",
};

export function Badge({ badge, className }: { badge: ProductBadge; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xs px-1.5 py-1 font-mono text-[0.625rem] uppercase leading-none tracking-[0.14em]",
        BADGE_STYLE[badge],
        className,
      )}
    >
      {BADGE_LABEL[badge]}
    </span>
  );
}

const STOCK_STYLE: Record<StockStatus, string> = {
  "in-stock": "text-success",
  "low-stock": "text-warning",
  "out-of-stock": "text-clay",
  preorder: "text-iris",
};

const STOCK_TEXT: Record<StockStatus, string> = {
  "in-stock": "In stock",
  "low-stock": "Only a few left",
  "out-of-stock": "Sold out",
  preorder: "Pre-order",
};

export function StockPill({ status, className }: { status: StockStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[0.8125rem]", STOCK_STYLE[status], className)}>
      <span
        aria-hidden="true"
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "in-stock" && "bg-success",
          status === "low-stock" && "bg-warning",
          status === "out-of-stock" && "bg-clay",
          status === "preorder" && "bg-iris",
        )}
      />
      {STOCK_TEXT[status]}
    </span>
  );
}

/** Small caps label used as a section eyebrow. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-eyebrow", className)}>{children}</p>;
}
