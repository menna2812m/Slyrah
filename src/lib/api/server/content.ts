import type { HomePage, HomeSection, SearchResults } from "@/lib/api/types";
import { queryProducts } from "@/lib/api/server/catalog";
import { PROMOTIONS, REVIEWS } from "@/mocks/commerce";
import { BLOG_SUMMARIES, EDUCATION_ITEMS, FAQS, VIDEO_TESTIMONIALS } from "@/mocks/content";
import { COLLECTION_SUMMARIES, PRODUCTS, collectionBySlug, toSummary } from "@/mocks/products";
import { CHARACTER_SUMMARIES, MATERIALS } from "@/mocks/taxonomy";

/**
 * The homepage is composed, ordered and toggled here so Admin owns the page
 * structure. The storefront renders `sections` in the order it receives them
 * and ignores any type it does not recognise.
 */
export function buildHomePage(): HomePage {
  const drop = collectionBySlug.get("first-light")!;
  const dropProducts = queryProducts({ collection: "first-light", perPage: 8 }).items;
  const lacePromo = PROMOTIONS.find((p) => p.type === "flash-sale")!;
  const laceProducts = queryProducts({ collection: "lace-archive", perPage: 4 }).items;

  // One review per product and per piece of text, so the wall doesn’t repeat
  // itself — the most helpful six are useless if three of them say the same
  // thing.
  const seenBody = new Set<string>();
  const seenProduct = new Set<string>();
  const featuredReviews = [...REVIEWS]
    .filter((r) => r.verifiedPurchase && r.rating >= 4)
    .sort((a, b) => b.helpfulCount - a.helpfulCount)
    .filter((review) => {
      if (seenBody.has(review.body) || seenProduct.has(review.productSlug)) return false;
      seenBody.add(review.body);
      seenProduct.add(review.productSlug);
      return true;
    })
    .slice(0, 6);

  const allRated = PRODUCTS.filter((p) => p.rating);
  const totalCount = allRated.reduce((sum, p) => sum + (p.rating?.count ?? 0), 0);
  const weighted = allRated.reduce((sum, p) => sum + (p.rating?.average ?? 0) * (p.rating?.count ?? 0), 0);

  const sections: HomeSection[] = [
    {
      id: "sec-hero",
      type: "hero",
      order: 1,
      visible: true,
      headline: "Which one of these is your day?",
      sublines: [
        "Four women. Four different problems with underwear.",
        "Pick the one whose day looks like yours — the fabric and the cut follow from there.",
      ],
      characters: CHARACTER_SUMMARIES,
    },
    {
      id: "sec-drop",
      type: "new-drop",
      order: 2,
      visible: true,
      eyebrow: "New drop",
      title: drop.title,
      description: drop.shortDescription,
      cta: { label: "See all of First Light", href: "/collections/first-light" },
      collection: {
        id: drop.id,
        slug: drop.slug,
        title: drop.title,
        shortDescription: drop.shortDescription,
        heroImage: drop.heroImage,
        productCount: drop.productCount,
        isDrop: drop.isDrop,
        releasedAt: drop.releasedAt,
      },
      products: dropProducts,
    },
    {
      id: "sec-education",
      type: "education",
      order: 3,
      visible: true,
      eyebrow: "Before you buy",
      title: "The things nobody explains",
      description: "Nine straight answers about fabric, fit and washing. No sales pitch attached.",
      cta: { label: "Read all the fabric notes", href: "/fabrics" },
      items: EDUCATION_ITEMS,
    },
    {
      id: "sec-reviews",
      type: "reviews",
      order: 4,
      visible: true,
      eyebrow: "From your feedback",
      title: "What changed because of you",
      description: "Every note below is from a confirmed order. The unverified ones are marked as such elsewhere on the site.",
      cta: { label: "Read all reviews", href: "/pages/reviews" },
      reviews: featuredReviews,
      summary: {
        average: totalCount ? Math.round((weighted / totalCount) * 10) / 10 : 0,
        count: totalCount,
        distribution: [0, 0, 0, 0, 0],
      },
    },
    {
      id: "sec-videos",
      type: "video-testimonials",
      order: 5,
      visible: true,
      eyebrow: "In her words",
      title: "Three minutes, three customers",
      description: null as unknown as string,
      testimonials: VIDEO_TESTIMONIALS,
    },
    {
      id: "sec-promo",
      type: "promotion",
      order: 6,
      visible: true,
      eyebrow: "Flash sale",
      title: lacePromo.title,
      description: lacePromo.description,
      cta: { label: "Shop the Archive", href: "/collections/lace-archive" },
      promotion: lacePromo,
      products: laceProducts,
    },
    {
      id: "sec-collections",
      type: "collection-highlights",
      order: 7,
      visible: true,
      eyebrow: "Collections",
      title: "Four ways in",
      cta: { label: "Shop everything", href: "/shop" },
      collections: COLLECTION_SUMMARIES,
    },
    {
      id: "sec-blog",
      type: "blog-highlights",
      order: 8,
      visible: true,
      eyebrow: "Journal",
      title: "Written by the four of them",
      cta: { label: "Read the Journal", href: "/journal" },
      posts: BLOG_SUMMARIES.slice(0, 3),
    },
    {
      id: "sec-faq",
      type: "faq-preview",
      order: 9,
      visible: true,
      eyebrow: "Questions",
      title: "Asked most often",
      cta: { label: "All questions", href: "/pages/faqs" },
      faqs: FAQS.slice(0, 5),
    },
  ];

  return {
    sections: sections.filter((s) => s.visible).sort((a, b) => a.order - b.order),
    seo: {
      title: "Slyrah — underwear made in Egypt, for the way you actually spend a day",
      description:
        "Egyptian cotton, ribbed modal, seamless microfibre and cotton-backed lace. Start with the woman whose day looks like yours. Free shipping over 1,200 EGP, cash on delivery across all 27 governorates.",
    },
  };
}

const SUGGESTIONS = [
  "high waist brief",
  "seamless thong",
  "wireless bra",
  "Egyptian cotton",
  "lace bralette",
  "mesh for summer",
];

export function searchEverything(rawQuery: string): SearchResults {
  const query = rawQuery.trim();
  if (!query) {
    return {
      query,
      products: [],
      collections: [],
      characters: [],
      materials: [],
      posts: [],
      suggestions: SUGGESTIONS,
      total: 0,
    };
  }

  const needle = query.toLowerCase();
  const products = queryProducts({ search: query, perPage: 12 }).items;

  const collections = COLLECTION_SUMMARIES.filter((c) =>
    `${c.title} ${c.shortDescription}`.toLowerCase().includes(needle),
  );

  const characters = CHARACTER_SUMMARIES.filter((c) =>
    `${c.name} ${c.title} ${c.shortDescription}`.toLowerCase().includes(needle),
  );

  const materials = MATERIALS.filter((m) =>
    `${m.name} ${m.tagline} ${m.composition}`.toLowerCase().includes(needle),
  );

  const posts = BLOG_SUMMARIES.filter((p) =>
    `${p.title} ${p.excerpt} ${p.tags.join(" ")}`.toLowerCase().includes(needle),
  );

  // SKU lookups should land straight on the product.
  const bySku = PRODUCTS.filter((p) =>
    p.sku.toLowerCase().includes(needle) || p.variants.some((v) => v.sku.toLowerCase().includes(needle)),
  ).map(toSummary);

  const merged = [...products];
  for (const item of bySku) {
    if (!merged.some((p) => p.slug === item.slug)) merged.push(item);
  }

  return {
    query,
    products: merged,
    collections,
    characters,
    materials,
    posts,
    suggestions: SUGGESTIONS,
    total: merged.length + collections.length + characters.length + materials.length + posts.length,
  };
}
