"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge, StockPill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity";
import { Rating } from "@/components/ui/rating";
import { toast } from "@/components/ui/toast";
import { ButterflySwatch } from "@/features/catalog/butterfly-swatch";
import { SizePicker } from "@/features/catalog/size-picker";
import { useVariantSelection } from "@/features/catalog/use-variant-selection";
import { useCartStore } from "@/features/cart/store";
import { useRecentlyViewedStore } from "@/features/catalog/recently-viewed";
import { ProductGallery } from "@/features/product/gallery";
import { NotifyMe } from "@/features/product/notify-me";
import { ShareMenu } from "@/features/product/share-menu";
import { SizeGuideModal } from "@/features/product/size-guide-modal";
import { WishlistButton } from "@/features/wishlist/wishlist-button";
import { ApiError } from "@/lib/api/client";
import type { Product, SizeGuide } from "@/lib/api/types";
import { formatMoney, savingAmount } from "@/lib/format";

export function ProductDetail({ product, sizeGuide }: { product: Product; sizeGuide: SizeGuide | null }) {
  const router = useRouter();
  const selection = useVariantSelection(product);
  const addLine = useCartStore((s) => s.addLine);
  const record = useRecentlyViewedStore((s) => s.record);

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);

  useEffect(() => {
    record(product.slug);
  }, [product.slug, record]);

  const price = selection.variant?.price ?? product.price;
  const compareAt = selection.variant?.compareAtPrice ?? product.compareAtPrice;
  const saving = savingAmount(price, compareAt);
  const soldOut = selection.variant?.stockStatus === "out-of-stock";

  async function add(): Promise<boolean> {
    if (!selection.variant) {
      setSizeError("Choose a size first.");
      document.getElementById("size-picker")?.scrollIntoView({ block: "center", behavior: "smooth" });
      return false;
    }
    try {
      await addLine({ productSlug: product.slug, variantId: selection.variant.id, quantity });
      return true;
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "We couldn’t add that to your bag. Try again.");
      return false;
    }
  }

  async function onAdd() {
    setAdding(true);
    const ok = await add();
    setAdding(false);
    if (ok) {
      toast.success(`Added ${product.name} to your bag`, {
        detail: `${selection.selectedColor?.name} · Size ${selection.selectedSize?.label} · ${quantity > 1 ? `${quantity} pairs` : "1"}`,
        action: { label: "Check out", href: "/checkout" },
      });
    }
  }

  async function onBuyNow() {
    setBuying(true);
    const ok = await add();
    setBuying(false);
    if (ok) router.push("/checkout");
  }

  return (
    // Capped rather than full-bleed: product photography is 4:5, and across a
    // 1440px column that becomes a 1400px-tall image with the buy panel
    // stranded beside it.
    <div className="mx-auto grid max-w-[74rem] gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-12">
      <ProductGallery product={product} selectedColor={selection.selectedColor} />

      <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
        {product.badges.length > 0 ? (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {product.badges.map((badge) => (
              <Badge key={badge} badge={badge} />
            ))}
          </div>
        ) : null}

        <h1 className="text-title">{product.name}</h1>
        <p className="mt-2 text-[0.9375rem] text-clay">{product.subtitle}</p>

        {product.rating ? (
          <a href="#reviews" className="mt-3 inline-flex items-center gap-2">
            <Rating value={product.rating.average} count={product.rating.count} />
            <span className="text-[0.8125rem] text-clay underline underline-offset-4">Read them</span>
          </a>
        ) : null}

        <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-display text-[1.9rem] leading-none text-ink" data-numeric>
            {formatMoney(price)}
          </span>
          {compareAt && saving ? (
            <>
              <s className="font-mono text-[1rem] text-clay">{formatMoney(compareAt)}</s>
              <span className="rounded-xs bg-sale/10 px-2 py-1 font-mono text-[0.75rem] text-sale" data-numeric>
                You save {formatMoney(saving)}
              </span>
            </>
          ) : null}
        </div>

        <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-clay" data-numeric>
          SKU {selection.variant?.sku ?? product.sku}
        </p>

        {/* Colour */}
        <div className="mt-8">
          <p className="mb-3 flex items-baseline gap-2 text-[0.875rem] text-graphite">
            Colour
            <span className="text-ink">{selection.selectedColor?.name}</span>
          </p>
          <div role="radiogroup" aria-label="Colour" className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <ButterflySwatch
                key={color.id}
                color={color}
                size="lg"
                selected={selection.colorId === color.id}
                unavailable={selection.colorUnavailable.has(color.id)}
                onSelect={(c) => selection.selectColor(c.id)}
              />
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="mt-8" id="size-picker">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <p className="text-[0.875rem] text-graphite">
              Size{selection.selectedSize ? <span className="ms-2 text-ink">{selection.selectedSize.label}</span> : null}
            </p>
            {sizeGuide ? <SizeGuideModal guide={sizeGuide} /> : null}
          </div>

          <SizePicker
            sizes={product.sizes}
            selectedId={selection.sizeId}
            availability={selection.sizeAvailability}
            onSelect={(id) => {
              setSizeError(null);
              selection.selectSize(id);
            }}
          />

          {sizeError ? (
            <p role="alert" className="mt-2.5 text-[0.8125rem] text-danger">
              {sizeError}
            </p>
          ) : null}

          {selection.variant ? <StockPill status={selection.variant.stockStatus} className="mt-3.5" /> : null}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3">
          {soldOut && selection.variant ? (
            <NotifyMe
              productSlug={product.slug}
              variantId={selection.variant.id}
              productName={product.name}
              sizeLabel={selection.selectedSize?.label ?? ""}
            />
          ) : (
            <>
              <div className="flex gap-3">
                <QuantityStepper value={quantity} onChange={setQuantity} max={10} className="h-[3.25rem]" />
                <Button onClick={onAdd} loading={adding} loadingLabel="Adding" size="lg" className="flex-1">
                  Add to bag
                </Button>
              </div>
              <Button onClick={onBuyNow} loading={buying} loadingLabel="Taking you to checkout" variant="secondary" size="lg" fullWidth>
                Buy now
              </Button>
            </>
          )}

          <div className="flex items-center gap-3">
            <WishlistButton slug={product.slug} productName={product.name} variant="labelled" className="flex-1" />
          </div>

          <div className="mt-1 flex items-center justify-between gap-4">
            <ShareMenu title={product.name} path={`/products/${product.slug}`} />
            <p className="text-[0.8125rem] text-clay">Cash on delivery</p>
          </div>
        </div>

        <p className="mt-7 border-t border-mist pt-5 text-[0.875rem] leading-relaxed text-graphite">
          {product.deliveryNote}
        </p>
      </div>
    </div>
  );
}
