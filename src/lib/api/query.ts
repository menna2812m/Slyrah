import type { ProductQuery, SortKey } from "@/lib/api/types";

/**
 * Query-string ⇄ ProductQuery, in one client-safe place so filter controls,
 * page links and the API all agree on the same URL shape.
 */

const VALID_SORTS: SortKey[] = ["featured", "newest", "price-asc", "price-desc", "rating", "bestselling"];

export function parseProductQuery(params: URLSearchParams): ProductQuery {
  const list = (key: string) =>
    params
      .getAll(key)
      .flatMap((value) => value.split(","))
      .map((value) => value.trim())
      .filter(Boolean);

  const num = (key: string) => {
    const raw = params.get(key);
    if (!raw) return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const sort = params.get("sort");

  return {
    collection: params.get("collection") ?? undefined,
    character: params.get("character") ?? undefined,
    materials: list("materials"),
    cuts: list("cuts"),
    closures: list("closures"),
    sizes: list("sizes"),
    colors: list("colors"),
    priceMin: num("priceMin"),
    priceMax: num("priceMax"),
    inStockOnly: params.get("inStock") === "1",
    onSaleOnly: params.get("onSale") === "1",
    search: params.get("q") ?? undefined,
    sort: sort && (VALID_SORTS as string[]).includes(sort) ? (sort as SortKey) : undefined,
    page: num("page"),
    perPage: num("perPage"),
  };
}

export function serializeProductQuery(query: ProductQuery): string {
  const params = new URLSearchParams();
  const push = (key: string, values?: string[]) => {
    if (values?.length) params.set(key, values.join(","));
  };

  if (query.collection) params.set("collection", query.collection);
  if (query.character) params.set("character", query.character);
  push("materials", query.materials);
  push("cuts", query.cuts);
  push("closures", query.closures);
  push("sizes", query.sizes);
  push("colors", query.colors);
  if (query.priceMin != null) params.set("priceMin", String(query.priceMin));
  if (query.priceMax != null) params.set("priceMax", String(query.priceMax));
  if (query.inStockOnly) params.set("inStock", "1");
  if (query.onSaleOnly) params.set("onSale", "1");
  if (query.search) params.set("q", query.search);
  if (query.sort && query.sort !== "featured") params.set("sort", query.sort);
  if (query.page && query.page > 1) params.set("page", String(query.page));

  return params.toString();
}

export function countActiveFilters(query: ProductQuery): number {
  return (
    (query.materials?.length ?? 0) +
    (query.cuts?.length ?? 0) +
    (query.closures?.length ?? 0) +
    (query.sizes?.length ?? 0) +
    (query.colors?.length ?? 0) +
    (query.priceMin != null || query.priceMax != null ? 1 : 0) +
    (query.inStockOnly ? 1 : 0) +
    (query.onSaleOnly ? 1 : 0)
  );
}

/** Turns Next’s `searchParams` prop into the same shape. */
export function queryFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): ProductQuery {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value == null) continue;
    if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
    else params.append(key, value);
  }
  return parseProductQuery(params);
}
