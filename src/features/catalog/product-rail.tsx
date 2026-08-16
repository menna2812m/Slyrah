"use client";

import { useEffect, useState } from "react";

import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/features/catalog/product-card";
import { catalogApi } from "@/lib/api/client";
import type { ProductSummary } from "@/lib/api/types";
import { cn } from "@/lib/utils";

/**
 * Horizontal rail used for related, recently viewed and wishlist rows. Snaps
 * on touch, scrolls freely with a trackpad, and never traps vertical scroll.
 */
export function ProductRail({
  products,
  className,
}: {
  products: ProductSummary[];
  className?: string;
}) {
  if (products.length === 0) return null;

  return (
    <ul
      className={cn(
        "rail scrollbar-none -mx-[var(--spacing-gutter)] gap-4 px-[var(--spacing-gutter)] pb-2",
        className,
      )}
    >
      {products.map((product) => (
        <li key={product.id} className="w-[62vw] sm:w-[38vw] lg:w-[19rem]">
          <ProductCard product={product} sizes="(max-width: 640px) 62vw, 19rem" />
        </li>
      ))}
    </ul>
  );
}

/** Client-side rail for lists that only exist on this device. */
export function StoredProductRail({
  slugs,
  exclude,
  limit = 8,
  emptyFallback = null,
}: {
  slugs: string[];
  exclude?: string;
  limit?: number;
  emptyFallback?: React.ReactNode;
}) {
  const [loaded, setLoaded] = useState<ProductSummary[] | null>(null);
  const wanted = slugs.filter((slug) => slug !== exclude).slice(0, limit);
  const key = wanted.join(",");

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    catalogApi
      .bySlugs(key.split(","))
      .then((data) => {
        if (!cancelled) setLoaded(data.items);
      })
      .catch(() => {
        if (!cancelled) setLoaded([]);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  // Nothing to ask for means the answer is already known.
  const products = key ? loaded : [];

  if (products === null) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: Math.min(4, wanted.length || 4) }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) return <>{emptyFallback}</>;

  return <ProductRail products={products} />;
}
