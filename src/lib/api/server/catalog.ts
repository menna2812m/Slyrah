import type {
  FacetValue,
  Product,
  ProductFacets,
  ProductListResponse,
  ProductQuery,
  ProductSummary,
  SortKey,
} from "@/lib/api/types";
import { PRODUCTS, toSummary } from "@/mocks/products";
import { CLOSURES, COLORS, CUTS, MATERIALS, SIZES_BOTTOM, SIZES_BRA, characterBySlug } from "@/mocks/taxonomy";

/**
 * The listing engine. In production this logic lives behind the Admin API —
 * it is reproduced here so the storefront can be developed and tested against
 * the same response shape.
 */

const ALL_SIZES = [...SIZES_BOTTOM, ...SIZES_BRA];

function sellableVariants(product: Product) {
  return product.variants.filter((v) => v.stockStatus !== "out-of-stock");
}

function productSizeIds(product: Product) {
  return new Set(sellableVariants(product).map((v) => v.sizeId));
}

function productColorIds(product: Product) {
  return new Set(sellableVariants(product).map((v) => v.colorId));
}

function isOnSale(product: Product) {
  return Boolean(product.compareAtPrice && product.compareAtPrice.amount > product.price.amount);
}

/** Each predicate is separable so facet counts can exclude their own dimension. */
type Predicate = (product: Product) => boolean;

function buildPredicates(query: ProductQuery): Record<string, Predicate> {
  const preset = query.character ? characterBySlug.get(query.character)?.discovery : undefined;

  const materials = query.materials?.length ? query.materials : preset?.materialSlugs;
  const cuts = query.cuts?.length ? query.cuts : preset?.cutSlugs;
  const closures = query.closures?.length ? query.closures : preset?.closureSlugs;

  return {
    collection: (p) => (query.collection ? p.collectionSlugs.includes(query.collection) : true),
    character: (p) => (query.character ? p.characterSlugs.includes(query.character) || Boolean(preset) : true),
    materials: (p) => (materials?.length ? materials.includes(p.materialSlug) : true),
    cuts: (p) => (cuts?.length ? cuts.includes(p.cutSlug) : true),
    closures: (p) => {
      if (!closures?.length) return true;
      const slug = CLOSURES.find((c) => c.id === p.closureId)?.slug;
      return slug ? closures.includes(slug) : false;
    },
    sizes: (p) => {
      if (!query.sizes?.length) return true;
      const available = productSizeIds(p);
      return query.sizes.some((label) => {
        const size = ALL_SIZES.find((s) => s.label.toLowerCase() === label.toLowerCase());
        return size ? available.has(size.id) : false;
      });
    },
    colors: (p) => {
      if (!query.colors?.length) return true;
      const available = productColorIds(p);
      return query.colors.some((slug) => {
        const color = COLORS.find((c) => c.slug === slug);
        return color ? available.has(color.id) : false;
      });
    },
    price: (p) => {
      if (query.priceMin != null && p.price.amount < query.priceMin) return false;
      if (query.priceMax != null && p.price.amount > query.priceMax) return false;
      return true;
    },
    stock: (p) => (query.inStockOnly ? p.stockStatus !== "out-of-stock" : true),
    sale: (p) => (query.onSaleOnly ? isOnSale(p) : true),
    search: (p) => {
      if (!query.search?.trim()) return true;
      const needle = query.search.trim().toLowerCase();
      const haystack = [p.name, p.subtitle, p.sku, p.description, p.materialSlug, p.cutSlug, ...p.collectionSlugs]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    },
  };
}

function matchesAllExcept(product: Product, predicates: Record<string, Predicate>, except: string) {
  return Object.entries(predicates).every(([key, fn]) => (key === except ? true : fn(product)));
}

const SORTERS: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: (a, b) => badgeWeight(b) - badgeWeight(a) || (b.rating?.average ?? 0) - (a.rating?.average ?? 0),
  newest: (a, b) => Number(b.badges.includes("new")) - Number(a.badges.includes("new")) || a.name.localeCompare(b.name),
  "price-asc": (a, b) => a.price.amount - b.price.amount,
  "price-desc": (a, b) => b.price.amount - a.price.amount,
  rating: (a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0),
  bestselling: (a, b) => (b.rating?.count ?? 0) - (a.rating?.count ?? 0),
};

function badgeWeight(product: Product) {
  let weight = 0;
  if (product.badges.includes("bestseller")) weight += 3;
  if (product.badges.includes("new")) weight += 2;
  if (product.badges.includes("sale")) weight += 1;
  if (product.stockStatus === "out-of-stock") weight -= 10;
  return weight;
}

function facet(
  id: string,
  slug: string,
  label: string,
  count: number,
  extra?: Partial<FacetValue>,
): FacetValue {
  return { id, slug, label, count, disabled: count === 0, ...extra };
}

function buildFacets(query: ProductQuery): ProductFacets {
  const predicates = buildPredicates(query);

  const forDimension = (dimension: string) =>
    PRODUCTS.filter((p) => matchesAllExcept(p, predicates, dimension));

  const materialPool = forDimension("materials");
  const cutPool = forDimension("cuts");
  const closurePool = forDimension("closures");
  const sizePool = forDimension("sizes");
  const colorPool = forDimension("colors");
  const pricePool = forDimension("price");

  const prices = pricePool.map((p) => p.price.amount);

  return {
    materials: MATERIALS.map((m) =>
      facet(m.id, m.slug, m.name, materialPool.filter((p) => p.materialSlug === m.slug).length),
    ),
    cuts: CUTS.map((c) => facet(c.id, c.slug, c.name, cutPool.filter((p) => p.cutSlug === c.slug).length)),
    closures: CLOSURES.map((c) =>
      facet(c.id, c.slug, c.name, closurePool.filter((p) => p.closureId === c.id).length),
    ),
    sizes: ALL_SIZES.map((s) =>
      facet(s.id, s.label.toLowerCase(), s.label, sizePool.filter((p) => productSizeIds(p).has(s.id)).length),
    ),
    colors: COLORS.map((c) =>
      facet(c.id, c.slug, c.name, colorPool.filter((p) => productColorIds(p).has(c.id)).length, {
        swatchHex: c.hex,
        swatchHexShift: c.hexShift ?? null,
      }),
    ),
    priceRange: {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
    },
  };
}

export function queryProducts(query: ProductQuery): ProductListResponse {
  const predicates = buildPredicates(query);
  const matched = PRODUCTS.filter((p) => Object.values(predicates).every((fn) => fn(p)));

  const sort: SortKey = query.sort ?? "featured";
  const sorted = [...matched].sort(SORTERS[sort] ?? SORTERS.featured);

  const perPage = Math.min(Math.max(query.perPage ?? 24, 1), 60);
  const page = Math.max(query.page ?? 1, 1);
  const start = (page - 1) * perPage;

  return {
    items: sorted.slice(start, start + perPage).map(toSummary) as ProductSummary[],
    facets: buildFacets(query),
    total: sorted.length,
    page,
    perPage,
    appliedSort: sort,
  };
}

export function getProductsBySlugs(slugs: string[]): ProductSummary[] {
  return slugs
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p))
    .map(toSummary) as ProductSummary[];
}
