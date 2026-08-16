"use client";

import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Media } from "@/components/ui/media";
import { Price } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";
import { SwatchRow } from "@/features/catalog/butterfly-swatch";
import { QuickAddSheet } from "@/features/catalog/quick-add";
import { WishlistButton } from "@/features/wishlist/wishlist-button";
import type { ProductSummary } from "@/lib/api/types";
import { cn } from "@/lib/utils";

/**
 * Image-first. The card carries only what changes a decision at grid level:
 * what it looks like, what it’s made of, what it costs, and whether her colour
 * is even available. Everything else waits for the product page.
 */
export function ProductCard({
  product,
  priority = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw",
  showRating = true,
  tone = "light",
  className,
}: {
  product: ProductSummary;
  priority?: boolean;
  sizes?: string;
  showRating?: boolean;
  /** Cards sit on the aubergine panels too, so text colour is a prop rather
   *  than an override that has to out-specify the defaults. */
  tone?: "light" | "dark";
  className?: string;
}) {
  const [quickAdd, setQuickAdd] = useState(false);
  const [hovering, setHovering] = useState(false);

  const soldOut = product.stockStatus === "out-of-stock";
  const primaryColor = product.colors[0]?.hex ?? "#E4DCD3";
  const secondaryColor = product.colors[1]?.hex ?? primaryColor;

  return (
    <>
      <article
        className={cn("group relative flex flex-col", className)}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div className="relative overflow-hidden rounded-md bg-shell">
          <Link href={`/products/${product.slug}`} className="block" tabIndex={-1} aria-hidden="true">
            {/* Back view sits underneath and is revealed on hover. */}
            <Media
              asset={product.secondaryImage}
              weave={product.materialWeave}
              tone={secondaryColor}
              alt=""
              aspect="4 / 5"
              sizes={sizes}
              className="absolute inset-0 h-full w-full"
            />
            <Media
              asset={product.primaryImage}
              weave={product.materialWeave}
              tone={primaryColor}
              alt={product.name}
              aspect="4 / 5"
              sizes={sizes}
              priority={priority}
              className={cn(
                "relative transition-opacity duration-500 ease-[var(--ease-drape)]",
                hovering && !soldOut ? "opacity-0" : "opacity-100",
              )}
            />
          </Link>

          {product.badges.length > 0 ? (
            <div className="pointer-events-none absolute start-2.5 top-2.5 flex flex-col items-start gap-1.5">
              {product.badges.slice(0, 2).map((badge) => (
                <Badge key={badge} badge={badge} />
              ))}
            </div>
          ) : null}

          <WishlistButton
            slug={product.slug}
            productName={product.name}
            className="absolute end-2.5 top-2.5 z-20 opacity-0 transition-opacity duration-200 focus-visible:opacity-100 group-hover:opacity-100 max-lg:opacity-100"
          />

          {soldOut ? (
            <div className="absolute inset-x-0 bottom-0 bg-chalk/90 py-2 text-center text-[0.8125rem] text-clay backdrop-blur-sm">
              Sold out
            </div>
          ) : (
            <div className="absolute inset-x-2.5 bottom-2.5 z-20 translate-y-2 opacity-0 transition-all duration-300 ease-[var(--ease-drape)] group-hover:translate-y-0 group-hover:opacity-100 max-lg:hidden">
              <button
                type="button"
                onClick={() => setQuickAdd(true)}
                className="w-full rounded-sm bg-chalk/95 py-2.5 text-[0.8125rem] text-ink backdrop-blur-sm transition-colors hover:bg-chalk"
              >
                Quick add
              </button>
            </div>
          )}
        </div>

        <div className="mt-3.5 flex flex-1 flex-col gap-1.5">
          <h3 className="text-[0.9375rem] leading-snug">
            <Link
              href={`/products/${product.slug}`}
              className={cn(
                "transition-colors",
                tone === "dark" ? "text-chalk hover:text-peony" : "text-ink hover:text-iris",
              )}
            >
              {/* The whole card is clickable without nesting interactive elements. */}
              <span className="absolute inset-0 z-10" aria-hidden="true" />
              {product.name}
            </Link>
          </h3>

          <p className={cn("text-[0.8125rem]", tone === "dark" ? "text-chalk/50" : "text-clay")}>
            {product.subtitle}
          </p>

          <Price
            price={product.price}
            compareAt={product.compareAtPrice}
            size="sm"
            className={cn("mt-0.5", tone === "dark" && "[&>span:first-child]:text-chalk")}
          />

          <div className="mt-1.5 flex items-center justify-between gap-3">
            <SwatchRow colors={product.colors} unavailableIds={product.unavailableColorIds} />
            {showRating && product.rating ? (
              <Rating value={product.rating.average} count={product.rating.count} showCount={false} />
            ) : null}
          </div>
        </div>
      </article>

      {/* Rendered outside the card so the sheet isn’t inside a hover region. */}
      {quickAdd ? <QuickAddSheet slug={product.slug} open onClose={() => setQuickAdd(false)} /> : null}
    </>
  );
}

export function ProductGrid({
  products,
  priorityCount = 4,
  className,
}: {
  products: ProductSummary[];
  priorityCount?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 lg:grid-cols-4", className)}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < priorityCount} />
      ))}
    </div>
  );
}
