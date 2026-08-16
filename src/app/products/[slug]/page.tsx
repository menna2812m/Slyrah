import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Accordion } from "@/components/ui/accordion";
import { ProductRail } from "@/features/catalog/product-rail";
import { RecentlyViewedRail } from "@/features/catalog/recently-viewed-rail";
import { ProductDetail } from "@/features/product/product-detail";
import { ReviewsBlock } from "@/features/reviews/reviews-block";
import {
  getAllProductSlugs,
  getMaterial,
  getProduct,
  getProductReviews,
  getProductSummaries,
  getSizeGuide,
} from "@/lib/api/server-data";
import { formatMoney } from "@/lib/format";
import { breadcrumbSchema, metadataFromSeo, productSchema } from "@/lib/seo";

export const revalidate = 120;

type Params = Promise<{ slug: string }>;

const REVIEWS_PER_PAGE = 6;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return metadataFromSeo(product.seo, `/products/${slug}`, {
    other: {
      "product:price:amount": (product.price.amount / 100).toFixed(2),
      "product:price:currency": product.price.currency,
    },
  });
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [material, sizeGuide, reviews, related, bundleProducts] = await Promise.all([
    getMaterial(product.materialSlug),
    getSizeGuide(product.sizeGuideSlug),
    getProductReviews(slug, 1, REVIEWS_PER_PAGE),
    getProductSummaries(product.relatedProductSlugs),
    getProductSummaries(product.bundles.flatMap((bundle) => bundle.productSlugs)),
  ]);

  const trail = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: material?.name ?? "Fabric", href: `/shop?materials=${product.materialSlug}` },
    { label: product.name, href: `/products/${slug}` },
  ];

  const bundleBySlug = new Map(bundleProducts.map((p) => [p.slug, p]));

  return (
    <>
      <div className="shell pt-6 pb-16 lg:pb-24">
        <Breadcrumbs trail={trail} className="mb-8" />
        <ProductDetail product={product} sizeGuide={sizeGuide} />
      </div>

      {/* Everything you’d want before deciding, in one place */}
      <section className="bg-chalk py-14 lg:py-20">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <h2 className="text-title">The details</h2>
            <p className="mt-4 max-w-md text-lede text-graphite">{product.description}</p>

            {material ? (
              <Link
                href={`/fabrics/${material.slug}`}
                className="mt-6 inline-block border-b border-ink/25 pb-1 text-[0.9375rem] text-ink transition-colors hover:border-ink"
              >
                More about {material.name}
              </Link>
            ) : null}
          </div>

          <div className="lg:col-span-7">
            <Accordion
              defaultOpenId="features"
              items={[
                {
                  id: "features",
                  question: "What’s in it",
                  answer: (
                    <ul className="flex max-w-2xl flex-col gap-2">
                      {product.features.map((feature) => (
                        <li key={feature} className="flex gap-3">
                          <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-peony" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  ),
                },
                {
                  id: "fabric",
                  question: "Fabric and composition",
                  answer: (
                    <div className="max-w-2xl">
                      <p className="font-mono text-[0.875rem] text-ink">{product.fabricComposition}</p>
                      {material ? <p className="mt-3">{material.description}</p> : null}
                    </div>
                  ),
                },
                {
                  id: "care",
                  question: "How to wash it",
                  answer: (
                    <ul className="flex max-w-2xl flex-col gap-2">
                      {product.careInstructions.map((line) => (
                        <li key={line} className="flex gap-3">
                          <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-iris" />
                          {line}
                        </li>
                      ))}
                    </ul>
                  ),
                },
                {
                  id: "delivery",
                  question: "Delivery and returns",
                  answer: (
                    <div className="max-w-2xl space-y-3">
                      <p>{product.deliveryNote}</p>
                      <p>{product.returnsNote}</p>
                      <Link href="/pages/shipping-policy" className="inline-block text-ink underline underline-offset-4">
                        Full shipping policy
                      </Link>
                    </div>
                  ),
                },
                ...product.faqs.map((faq) => ({
                  id: faq.id,
                  question: faq.question,
                  answer: <p className="max-w-2xl">{faq.answer}</p>,
                  meta: <span className="text-eyebrow hidden sm:block">{faq.category}</span>,
                })),
              ]}
            />
          </div>
        </div>
      </section>

      {/* Bundles */}
      {product.bundles.length > 0 ? (
        <section className="shell py-14 lg:py-20">
          {product.bundles.map((bundle) => (
            <div key={bundle.id} className="edge-iris rounded-lg bg-chalk p-6 sm:p-9">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-4">
                  <p className="text-eyebrow text-peony">Bundle</p>
                  <h2 className="mt-3 text-heading">{bundle.title}</h2>
                  <p className="mt-2.5 text-[0.9375rem] text-graphite">{bundle.description}</p>
                  <p className="mt-4 font-mono text-[0.9375rem] text-sale" data-numeric>
                    Saves {formatMoney(bundle.saving)}
                  </p>
                </div>
                <ul className="grid grid-cols-3 gap-4 lg:col-span-8">
                  {bundle.productSlugs.map((bundleSlug) => {
                    const item = bundleBySlug.get(bundleSlug);
                    if (!item) return null;
                    return (
                      <li key={bundleSlug}>
                        <Link href={`/products/${bundleSlug}`} className="text-[0.875rem] text-ink hover:text-iris">
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </section>
      ) : null}

      {/* Reviews */}
      <section className="shell py-14 lg:py-20">
        <ReviewsBlock
          productSlug={slug}
          productName={product.name}
          initial={reviews.items}
          summary={reviews.summary}
          total={reviews.total}
          perPage={REVIEWS_PER_PAGE}
        />
      </section>

      {/* Related */}
      {related.length > 0 ? (
        <section className="shell py-14 lg:py-20">
          <h2 className="text-title mb-8">You may also like</h2>
          <ProductRail products={related} />
        </section>
      ) : null}

      <RecentlyViewedRail exclude={slug} />

      <JsonLd data={[productSchema(product, reviews.items), breadcrumbSchema(trail)]} />
    </>
  );
}
