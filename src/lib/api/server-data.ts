import "server-only";

import { queryProducts } from "@/lib/api/server/catalog";
import { buildHomePage, searchEverything } from "@/lib/api/server/content";
import type {
  BlogPost,
  BlogPostSummary,
  Character,
  CharacterSummary,
  Collection,
  CollectionSummary,
  Cut,
  EducationItem,
  FaqItem,
  Governorate,
  HomePage,
  Material,
  PaymentMethod,
  Product,
  ProductListResponse,
  ProductQuery,
  ProductSummary,
  Promotion,
  Review,
  ReviewListResponse,
  SearchResults,
  ShippingSettings,
  SizeGuide,
  StaticPage,
  StoreSettings,
  VideoTestimonial,
} from "@/lib/api/types";
import {
  PAYMENT_METHODS,
  PROMOTIONS,
  SHIPPING_SETTINGS,
  reviewsByProduct,
} from "@/mocks/commerce";
import {
  BLOG_SUMMARIES,
  EDUCATION_ITEMS,
  FAQS,
  SIZE_GUIDES,
  STATIC_PAGES,
  STORE_SETTINGS,
  VIDEO_TESTIMONIALS,
  blogBySlug,
  staticPageBySlug,
} from "@/mocks/content";
import { COLLECTIONS, COLLECTION_SUMMARIES, PRODUCTS, collectionBySlug, productBySlug, toSummary } from "@/mocks/products";
import { CHARACTERS, CHARACTER_SUMMARIES, CUTS, MATERIALS, characterBySlug, materialBySlug } from "@/mocks/taxonomy";

/**
 * Server-side data access.
 *
 * Server Components read through these functions rather than fetching the
 * storefront’s own HTTP routes — one less hop, and pages stay statically
 * renderable. To move onto the real Admin API, replace each body with a
 * `fetch(process.env.API_BASE_URL + …)`; the signatures do not change.
 */

export async function getStoreSettings(): Promise<StoreSettings> {
  return STORE_SETTINGS;
}

export async function getHomePage(): Promise<HomePage> {
  return buildHomePage();
}

export async function getProducts(query: ProductQuery): Promise<ProductListResponse> {
  return queryProducts(query);
}

export async function getProduct(slug: string): Promise<Product | null> {
  return productBySlug.get(slug) ?? null;
}

export async function getProductSummaries(slugs: string[]): Promise<ProductSummary[]> {
  return slugs
    .map((slug) => productBySlug.get(slug))
    .filter((p): p is Product => Boolean(p))
    .map(toSummary) as ProductSummary[];
}

export async function getAllProductSlugs(): Promise<string[]> {
  return PRODUCTS.map((p) => p.slug);
}

export async function getProductReviews(slug: string, page = 1, perPage = 6): Promise<ReviewListResponse> {
  const product = productBySlug.get(slug);
  const items: Review[] = [...(reviewsByProduct[slug] ?? [])].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  return {
    items: items.slice((page - 1) * perPage, page * perPage),
    summary: product?.rating ?? { average: 0, count: 0, distribution: [0, 0, 0, 0, 0] },
    total: items.length,
    page,
    perPage,
  };
}

export async function getCollections(): Promise<CollectionSummary[]> {
  return COLLECTION_SUMMARIES;
}

export async function getCollection(slug: string): Promise<Collection | null> {
  return collectionBySlug.get(slug) ?? null;
}

export async function getAllCollectionSlugs(): Promise<string[]> {
  return COLLECTIONS.map((c) => c.slug);
}

export async function getCharacters(): Promise<CharacterSummary[]> {
  return CHARACTER_SUMMARIES;
}

export async function getCharacter(slug: string): Promise<Character | null> {
  return characterBySlug.get(slug) ?? null;
}

export async function getAllCharacterSlugs(): Promise<string[]> {
  return CHARACTERS.map((c) => c.slug);
}

export async function getMaterials(): Promise<Material[]> {
  return MATERIALS;
}

export async function getMaterial(slug: string): Promise<Material | null> {
  return materialBySlug.get(slug) ?? null;
}

export async function getCuts(): Promise<Cut[]> {
  return CUTS;
}

export async function getShippingSettings(): Promise<ShippingSettings> {
  return SHIPPING_SETTINGS;
}

export async function getGovernorates(): Promise<Governorate[]> {
  return SHIPPING_SETTINGS.governorates.filter((g) => g.active);
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  return PAYMENT_METHODS;
}

export async function getPromotions(): Promise<Promotion[]> {
  return PROMOTIONS;
}

export async function getActiveFlashSale(): Promise<Promotion | null> {
  const now = Date.now();
  return (
    PROMOTIONS.find(
      (p) =>
        p.type === "flash-sale" &&
        p.endsAt != null &&
        new Date(p.endsAt).getTime() > now &&
        (!p.startsAt || new Date(p.startsAt).getTime() <= now),
    ) ?? null
  );
}

export async function getEducationItems(): Promise<EducationItem[]> {
  return EDUCATION_ITEMS;
}

export async function getFaqs(): Promise<FaqItem[]> {
  return FAQS;
}

export async function getVideoTestimonials(): Promise<VideoTestimonial[]> {
  return VIDEO_TESTIMONIALS;
}

export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  return BLOG_SUMMARIES;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return blogBySlug.get(slug) ?? null;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  return BLOG_SUMMARIES.map((p) => p.slug);
}

export async function getStaticPage(slug: string): Promise<StaticPage | null> {
  return staticPageBySlug.get(slug) ?? null;
}

export async function getAllStaticPageSlugs(): Promise<string[]> {
  return STATIC_PAGES.map((p) => p.slug);
}

export async function getSizeGuides(): Promise<SizeGuide[]> {
  return SIZE_GUIDES;
}

export async function getSizeGuide(slug: string): Promise<SizeGuide | null> {
  return SIZE_GUIDES.find((g) => g.slug === slug) ?? null;
}

export async function getAllReviews(): Promise<Review[]> {
  return Object.values(reviewsByProduct).flat();
}

export async function search(query: string): Promise<SearchResults> {
  return searchEverything(query);
}
