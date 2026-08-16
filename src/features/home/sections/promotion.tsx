import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { ProductCard } from "@/features/catalog/product-card";
import { Countdown } from "@/features/promotions/countdown";
import type { PromotionSection as PromotionData } from "@/lib/api/types";

export function PromotionSection({ section }: { section: PromotionData }) {
  const { promotion } = section;

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="shell">
        <div className="edge-iris rounded-lg bg-chalk p-6 sm:p-10 lg:p-12" data-reveal>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
            <div className="lg:col-span-5">
              <p className="text-eyebrow text-sale">{section.eyebrow}</p>
              <h2 className="mt-4 text-title">{promotion.title}</h2>
              <p className="mt-4 max-w-md text-lede text-graphite">{promotion.description}</p>

              {promotion.endsAt ? <Countdown endsAt={promotion.endsAt} className="mt-7" /> : null}

              {promotion.code ? (
                <p className="mt-6 text-[0.875rem] text-graphite">
                  Code{" "}
                  <span className="rounded-xs bg-oyster px-2 py-1 font-mono text-ink" data-numeric>
                    {promotion.code}
                  </span>{" "}
                  at checkout
                </p>
              ) : (
                <p className="mt-6 text-[0.875rem] text-clay">Applied automatically. No code needed.</p>
              )}

              {section.cta ? (
                <Link href={section.cta.href} className={buttonClasses("primary", "lg", "mt-7")}>
                  {section.cta.label}
                </Link>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:col-span-7 lg:grid-cols-4">
              {section.products.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showRating={false}
                  sizes="(max-width: 640px) 45vw, 18vw"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
