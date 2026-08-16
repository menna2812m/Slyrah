"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { ProductGrid } from "@/features/catalog/product-card";
import { useWishlistStore } from "@/features/wishlist/store";
import { catalogApi } from "@/lib/api/client";
import type { ProductSummary } from "@/lib/api/types";
import { pluralize } from "@/lib/format";
import { useHydrated } from "@/lib/use-hydrated";

export function WishlistView() {
  const slugs = useWishlistStore((s) => s.slugs);
  const clear = useWishlistStore((s) => s.clear);
  const hydrated = useHydrated();
  const [loaded, setLoaded] = useState<ProductSummary[] | null>(null);

  const key = slugs.join(",");

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

  // An empty list needs no request — it’s already the answer.
  const products = key ? loaded : [];

  if (!hydrated || products === null) {
    return (
      <div className="pb-20">
        <ProductGridSkeleton count={4} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="Nothing saved yet"
        body="Tap the butterfly on anything you want to come back to. It stays here on this device until you create an account."
        action={{ label: "Shop everything", href: "/shop" }}
        className="my-10"
      />
    );
  }

  return (
    <div className="pb-20">
      <div className="mb-8 flex items-center justify-between gap-4">
        <p className="font-mono text-[0.75rem] text-clay" data-numeric>
          {pluralize(products.length, "piece")}
        </p>
        <div className="flex items-center gap-5">
          <Link href="/account" className="text-[0.875rem] text-ink underline underline-offset-4">
            Save this to an account
          </Link>
          <button
            type="button"
            onClick={clear}
            className="text-[0.875rem] text-clay underline-offset-4 hover:text-danger hover:underline"
          >
            Clear all
          </button>
        </div>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
