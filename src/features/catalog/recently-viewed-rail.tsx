"use client";

import { StoredProductRail } from "@/features/catalog/product-rail";
import { useRecentlyViewedStore } from "@/features/catalog/recently-viewed";
import { useHydrated } from "@/lib/use-hydrated";

/**
 * Only rendered once there is genuinely something to show — an empty
 * "Recently viewed" heading is noise on a first visit.
 */
export function RecentlyViewedRail({ exclude, title = "Recently viewed" }: { exclude?: string; title?: string }) {
  const slugs = useRecentlyViewedStore((s) => s.slugs);
  const hydrated = useHydrated();

  const visible = slugs.filter((slug) => slug !== exclude);
  if (!hydrated || visible.length === 0) return null;

  return (
    <section className="shell py-14 lg:py-20">
      <h2 className="text-title mb-8">{title}</h2>
      <StoredProductRail slugs={slugs} exclude={exclude} />
    </section>
  );
}
