import type { MetadataRoute } from "next";

import {
  getAllBlogSlugs,
  getAllCharacterSlugs,
  getAllCollectionSlugs,
  getAllProductSlugs,
  getAllStaticPageSlugs,
  getMaterials,
} from "@/lib/api/server-data";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, characters, posts, staticPages, materials] = await Promise.all([
    getAllProductSlugs(),
    getAllCollectionSlugs(),
    getAllCharacterSlugs(),
    getAllBlogSlugs(),
    getAllStaticPageSlugs(),
    getMaterials(),
  ]);

  const now = new Date();

  const entry = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    entry("/", 1, "daily"),
    entry("/shop", 0.9, "daily"),
    entry("/characters", 0.9, "weekly"),
    entry("/collections", 0.8, "weekly"),
    entry("/fabrics", 0.8, "monthly"),
    entry("/journal", 0.7, "weekly"),
    entry("/pages/size-guide", 0.7, "monthly"),
    entry("/pages/faqs", 0.6, "monthly"),
    entry("/pages/reviews", 0.6, "weekly"),
    entry("/track", 0.4, "yearly"),
    ...products.map((slug) => entry(`/products/${slug}`, 0.9, "daily")),
    ...collections.map((slug) => entry(`/collections/${slug}`, 0.8, "weekly")),
    ...characters.map((slug) => entry(`/characters/${slug}`, 0.8, "monthly")),
    ...materials.map((material) => entry(`/fabrics/${material.slug}`, 0.7, "monthly")),
    ...posts.map((slug) => entry(`/journal/${slug}`, 0.6, "monthly")),
    ...staticPages.map((slug) => entry(`/pages/${slug}`, 0.5, "yearly")),
  ];
}
