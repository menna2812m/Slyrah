import type { Metadata } from "next";

import type {
  BlogPost,
  Collection,
  FaqItem,
  Order,
  Product,
  Review,
  SeoMeta,
} from "@/lib/api/types";
import { ORDER_STATUS_LABEL } from "@/lib/format";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://slyrah.com";
export const SITE_NAME = "Slyrah";

/**
 * Every page’s metadata is derived from the `seo` block the API returns.
 * Nothing here is hard-coded per route — add a field to `SeoMeta` and Admin
 * controls it.
 */
export function metadataFromSeo(seo: SeoMeta, path: string, extra?: Partial<Metadata>): Metadata {
  const canonical = seo.canonicalPath ?? path;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical },
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: seo.title,
      description: seo.description,
      url: `${SITE_URL}${canonical}`,
      images: seo.ogImage ? [{ url: seo.ogImage.url, width: seo.ogImage.width, height: seo.ogImage.height, alt: seo.ogImage.alt }] : undefined,
      locale: "en_EG",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage.url] : undefined,
    },
    ...extra,
  };
}

/* -------------------------------------------------------------------------- */
/* Structured data                                                             */
/* -------------------------------------------------------------------------- */

type Json = Record<string, unknown>;

export function organizationSchema(contact: { phone: string; email: string }): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: "Women’s underwear made in Egypt from long-staple cotton, ribbed modal, seamless microfibre and cotton-backed lace.",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: contact.phone,
        email: contact.email,
        contactType: "customer service",
        areaServed: "EG",
        availableLanguage: ["en", "ar"],
      },
    ],
  };
}

export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

const AVAILABILITY: Record<string, string> = {
  "in-stock": "https://schema.org/InStock",
  "low-stock": "https://schema.org/LimitedAvailability",
  "out-of-stock": "https://schema.org/OutOfStock",
  preorder: "https://schema.org/PreOrder",
};

/**
 * Price, availability and rating are read off the live product — never
 * hard-coded — so the rich result matches what the page actually shows.
 */
export function productSchema(product: Product, reviews: Review[]): Json {
  const url = `${SITE_URL}/products/${product.slug}`;
  const inStockVariants = product.variants.filter((v) => v.stockStatus !== "out-of-stock");
  const prices = product.variants.map((v) => v.price.amount / 100);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    url,
    brand: { "@type": "Brand", name: SITE_NAME },
    material: product.fabricComposition,
    image: product.images.length ? product.images.map((image) => image.url) : undefined,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: product.price.currency,
      lowPrice: prices.length ? Math.min(...prices) : product.price.amount / 100,
      highPrice: prices.length ? Math.max(...prices) : product.price.amount / 100,
      offerCount: product.variants.length,
      availability: AVAILABILITY[inStockVariants.length ? "in-stock" : "out-of-stock"],
      url,
      seller: { "@type": "Organization", name: SITE_NAME },
    },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating.average,
          reviewCount: product.rating.count,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    review: reviews.slice(0, 5).map((review) => ({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5 },
      author: { "@type": "Person", name: review.authorName },
      datePublished: review.createdAt,
      name: review.title ?? undefined,
      reviewBody: review.body,
    })),
  };
}

export function collectionSchema(collection: Collection, productSlugs: string[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.title,
    description: collection.description,
    url: `${SITE_URL}/collections/${collection.slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: productSlugs.length,
      itemListElement: productSlugs.map((slug, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/products/${slug}`,
      })),
    },
  };
}

export function articleSchema(post: BlogPost): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    url: `${SITE_URL}/journal/${post.slug}`,
    image: post.featuredImage?.url,
    publisher: { "@type": "Organization", name: SITE_NAME },
    keywords: post.tags.join(", "),
  };
}

export function faqSchema(faqs: FaqItem[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function breadcrumbSchema(trail: { label: string; href: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `${SITE_URL}${crumb.href}`,
    })),
  };
}

export function orderStatusText(order: Order) {
  return ORDER_STATUS_LABEL[order.status];
}
