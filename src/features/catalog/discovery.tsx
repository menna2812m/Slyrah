"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

import { Button, buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Drawer } from "@/components/ui/overlay";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { FilterPanel } from "@/features/catalog/filter-panel";
import { MaterialSelector } from "@/features/catalog/material-selector";
import { ProductGrid } from "@/features/catalog/product-card";
import { serializeProductQuery } from "@/lib/api/query";
import type { ProductListResponse, ProductQuery, SortKey } from "@/lib/api/types";
import { pluralize } from "@/lib/format";
import { cn } from "@/lib/utils";

const SORT_LABELS: Record<SortKey, string> = {
  featured: "Featured",
  newest: "Newest",
  bestselling: "Bestselling",
  rating: "Best rated",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

/**
 * The shared discovery experience. Collection pages, character pages and the
 * full shop all use this — the only difference is which part of the query is
 * fixed by the route and therefore not offered as a filter.
 *
 * Filter state lives in the URL, so a filtered view is shareable, linkable and
 * indexable rather than trapped in component state.
 */
export function ProductDiscovery({
  response,
  query,
  /** Query keys the route owns. `collection` on a collection page, etc. */
  locked = [],
  showMaterials = true,
  emptyAction,
}: {
  response: ProductListResponse;
  query: ProductQuery;
  locked?: (keyof ProductQuery)[];
  showMaterials?: boolean;
  emptyAction?: { label: string; href: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const apply = useCallback(
    (patch: Partial<ProductQuery>) => {
      const next: ProductQuery = { ...query, ...patch, page: 1 };
      for (const key of locked) delete next[key];

      const serialized = serializeProductQuery(next);
      startTransition(() => {
        router.replace(serialized ? `${pathname}?${serialized}` : pathname, { scroll: false });
      });
    },
    [query, locked, pathname, router],
  );

  const activeCount =
    (query.cuts?.length ?? 0) +
    (query.closures?.length ?? 0) +
    (query.sizes?.length ?? 0) +
    (query.colors?.length ?? 0) +
    (query.priceMin != null || query.priceMax != null ? 1 : 0) +
    (query.inStockOnly ? 1 : 0) +
    (query.onSaleOnly ? 1 : 0);

  const materialCount = query.materials?.length ?? 0;

  function clearAll() {
    const next: ProductQuery = { sort: query.sort };
    for (const key of locked) {
      // Keep whatever the route itself pinned.
      (next as Record<string, unknown>)[key] = query[key];
    }
    const serialized = serializeProductQuery(next);
    startTransition(() => {
      router.replace(serialized ? `${pathname}?${serialized}` : pathname, { scroll: false });
    });
  }

  function toggleMaterial(slug: string) {
    const current = query.materials ?? [];
    apply({ materials: current.includes(slug) ? current.filter((m) => m !== slug) : [...current, slug] });
  }

  return (
    <div>
      {showMaterials ? (
        <MaterialSelector
          materials={response.facets.materials}
          selected={query.materials ?? []}
          onToggle={toggleMaterial}
          className="mb-9"
        />
      ) : null}

      <div className="sticky top-[var(--header-height)] z-40 -mx-[var(--spacing-gutter)] mb-8 border-y border-mist bg-oyster/90 px-[var(--spacing-gutter)] py-3 backdrop-blur-md">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="quiet" size="sm" onClick={() => setFiltersOpen(true)} className="lg:hidden">
              Filters
              {activeCount > 0 ? (
                <span className="ms-1.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-ink px-1 font-mono text-[0.5625rem] text-chalk">
                  {activeCount}
                </span>
              ) : null}
            </Button>

            <p aria-live="polite" className="font-mono text-[0.75rem] text-clay" data-numeric>
              {pending ? "Updating…" : pluralize(response.total, "piece")}
            </p>

            {activeCount + materialCount > 0 ? (
              <button
                type="button"
                onClick={clearAll}
                className="hidden text-[0.8125rem] text-clay underline-offset-4 hover:text-ink hover:underline lg:inline"
              >
                Clear filters
              </button>
            ) : null}
          </div>

          <label className="flex items-center gap-2 text-[0.8125rem] text-clay">
            <span className="hidden sm:inline">Sort</span>
            <select
              value={query.sort ?? "featured"}
              onChange={(event) => apply({ sort: event.target.value as SortKey })}
              className="rounded-sm border border-mist bg-chalk px-2.5 py-1.5 text-[0.8125rem] text-ink focus:outline-none focus-visible:border-iris"
            >
              {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                <option key={key} value={key}>
                  {SORT_LABELS[key]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-12">
        <aside className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-height)+5rem)] max-h-[calc(100vh-var(--header-height)-7rem)] overflow-y-auto pe-2">
            <FilterPanel facets={response.facets} query={query} onChange={apply} />
          </div>
        </aside>

        <div className={cn("transition-opacity duration-200", pending && "opacity-45")}>
          {pending && response.items.length === 0 ? (
            <ProductGridSkeleton />
          ) : response.items.length === 0 ? (
            <EmptyState
              title="Nothing matches all of that"
              body="Loosen one filter — colour and size together rule out most of the range. Or clear them and start from the fabric."
              action={emptyAction ?? { label: "Clear filters", href: pathname }}
              secondary={
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-[0.875rem] text-clay underline underline-offset-4 hover:text-ink"
                >
                  Clear every filter
                </button>
              }
            />
          ) : (
            <>
              <ProductGrid products={response.items} />

              {response.total > response.items.length ? (
                <Pagination
                  page={response.page}
                  perPage={response.perPage}
                  total={response.total}
                  pathname={pathname}
                  searchParams={searchParams}
                />
              ) : null}
            </>
          )}
        </div>
      </div>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        side="bottom"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" size="lg" onClick={clearAll} className="flex-1">
              Clear
            </Button>
            <Button size="lg" onClick={() => setFiltersOpen(false)} className="flex-[2]">
              Show {pluralize(response.total, "piece")}
            </Button>
          </div>
        }
      >
        <FilterPanel facets={response.facets} query={query} onChange={apply} />
      </Drawer>
    </div>
  );
}

function Pagination({
  page,
  perPage,
  total,
  pathname,
  searchParams,
}: {
  page: number;
  perPage: number;
  total: number;
  pathname: string;
  searchParams: URLSearchParams;
}) {
  const lastPage = Math.ceil(total / perPage);

  function href(target: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (target <= 1) params.delete("page");
    else params.set("page", String(target));
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  return (
    <nav aria-label="Pagination" className="mt-14 flex items-center justify-between gap-4 border-t border-mist pt-7">
      {page > 1 ? (
        <a href={href(page - 1)} className={buttonClasses("secondary", "sm")}>
          Previous
        </a>
      ) : (
        <span />
      )}

      <p className="font-mono text-[0.75rem] text-clay" data-numeric>
        Page {page} of {lastPage}
      </p>

      {page < lastPage ? (
        <a href={href(page + 1)} className={buttonClasses("secondary", "sm")}>
          Next
        </a>
      ) : (
        <span />
      )}
    </nav>
  );
}
