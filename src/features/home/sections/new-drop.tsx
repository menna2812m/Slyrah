import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { Media } from "@/components/ui/media";
import { ProductCard } from "@/features/catalog/product-card";
import type { NewDropSection as NewDropData } from "@/lib/api/types";
import { formatDate } from "@/lib/format";

export function NewDropSection({ section }: { section: NewDropData }) {
  const { collection, products } = section;

  return (
    <section className="grain relative overflow-hidden bg-aubergine py-16 text-chalk/75 sm:py-20 lg:py-28">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start" data-reveal>
            <p className="text-eyebrow text-chalk/50">{section.eyebrow}</p>
            <h2 className="mt-4 text-display text-chalk">{collection.title}</h2>
            <p className="mt-5 max-w-md text-lede text-chalk/70">
              {section.description ?? collection.shortDescription}
            </p>

            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-chalk/12 pt-6">
              <div>
                <dt className="text-eyebrow text-chalk/45">Pieces</dt>
                <dd className="mt-1.5 font-mono text-lg text-chalk" data-numeric>
                  {collection.productCount}
                </dd>
              </div>
              {collection.releasedAt ? (
                <div>
                  <dt className="text-eyebrow text-chalk/45">Dropped</dt>
                  <dd className="mt-1.5 font-mono text-lg text-chalk" data-numeric>
                    {formatDate(collection.releasedAt)}
                  </dd>
                </div>
              ) : null}
            </dl>

            {section.cta ? (
              <Link href={section.cta.href} className={buttonClasses("inverse", "lg", "mt-8")}>
                {section.cta.label}
              </Link>
            ) : null}
          </div>

          <div className="lg:col-span-7">
            <Media
              asset={collection.heroImage}
              weave="satin"
              tone="#B79FB0"
              alt={`${collection.title} campaign image`}
              aspect="16 / 10"
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="rounded-md"
              label="First Light"
            />

            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3" data-reveal>
              {products.slice(0, 6).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showRating={false}
                  tone="dark"
                  sizes="(max-width: 640px) 45vw, 20vw"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
