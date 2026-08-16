"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { StockPill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButterflyLoader } from "@/components/ui/butterfly";
import { ErrorState } from "@/components/ui/empty-state";
import { Media } from "@/components/ui/media";
import { Drawer } from "@/components/ui/overlay";
import { Price } from "@/components/ui/price";
import { toast } from "@/components/ui/toast";
import { ButterflySwatch } from "@/features/catalog/butterfly-swatch";
import { SizePicker } from "@/features/catalog/size-picker";
import { useVariantSelection } from "@/features/catalog/use-variant-selection";
import { useCartStore } from "@/features/cart/store";
import { ApiError } from "@/lib/api/client";
import type { Product } from "@/lib/api/types";

/**
 * Adding from the grid without losing your place. It asks for exactly the two
 * things a bag line needs — colour and size — and nothing else.
 */
export function QuickAddSheet({
  slug,
  open,
  onClose,
}: {
  slug: string;
  open: boolean;
  onClose: () => void;
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // Status is derived rather than stored, so there is no state to keep in step
  // with the fetch.
  const status = product ? "ready" : failed ? "error" : "loading";

  useEffect(() => {
    if (!open || product) return;
    let cancelled = false;

    fetch(`/api/products/${slug}`)
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<Product>;
      })
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [open, slug, product, attempt]);

  return (
    <Drawer open={open} onClose={onClose} title={product?.name ?? "Add to bag"} side="bottom">
      {status === "loading" ? (
        <div className="grid place-items-center py-14">
          <ButterflyLoader label="Loading sizes" />
        </div>
      ) : status === "error" || !product ? (
        <ErrorState
          body="We couldn’t load the sizes for this one. Open the full product page instead."
          onRetry={() => {
            setFailed(false);
            setAttempt((n) => n + 1);
          }}
        />
      ) : (
        <QuickAddBody product={product} onDone={onClose} />
      )}
    </Drawer>
  );
}

function QuickAddBody({ product, onDone }: { product: Product; onDone: () => void }) {
  const selection = useVariantSelection(product);
  const addLine = useCartStore((s) => s.addLine);
  const [adding, setAdding] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);

  async function add() {
    if (!selection.variant) {
      setSizeError("Choose a size first.");
      return;
    }
    setAdding(true);
    try {
      await addLine({ productSlug: product.slug, variantId: selection.variant.id, quantity: 1 });
      toast.success(`Added ${product.name} to your bag`, {
        detail: `${selection.selectedColor?.name} · Size ${selection.selectedSize?.label}`,
        action: { label: "Check out", href: "/checkout" },
      });
      onDone();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "We couldn’t add that. Try again.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-2">
      <div className="flex gap-4">
        <Media
          asset={product.primaryImage}
          weave={product.materialWeave}
          tone={selection.selectedColor?.hex ?? product.colors[0]?.hex}
          alt={product.name}
          aspect="4 / 5"
          className="w-20 shrink-0 rounded-sm"
          sizes="80px"
        />
        <div className="min-w-0 flex-1">
          <Link href={`/products/${product.slug}`} className="text-heading hover:text-iris">
            {product.name}
          </Link>
          <p className="mt-0.5 text-[0.875rem] text-clay">{product.subtitle}</p>
          <Price price={product.price} compareAt={product.compareAtPrice} className="mt-2" />
        </div>
      </div>

      <div>
        <p className="mb-2.5 flex items-baseline gap-2 text-[0.875rem] text-graphite">
          Colour
          <span className="text-clay">{selection.selectedColor?.name}</span>
        </p>
        <div role="radiogroup" aria-label="Colour" className="flex flex-wrap gap-1.5">
          {product.colors.map((color) => (
            <ButterflySwatch
              key={color.id}
              color={color}
              selected={selection.colorId === color.id}
              unavailable={selection.colorUnavailable.has(color.id)}
              onSelect={(c) => selection.selectColor(c.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2.5 flex items-baseline justify-between gap-3">
          <p className="text-[0.875rem] text-graphite">Size</p>
          <Link href={`/pages/size-guide`} className="text-[0.8125rem] text-clay underline underline-offset-4 hover:text-ink">
            Size guide
          </Link>
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
        {sizeError ? <p className="mt-2 text-[0.8125rem] text-danger">{sizeError}</p> : null}
        {selection.variant ? <StockPill status={selection.variant.stockStatus} className="mt-3" /> : null}
      </div>

      <div className="flex flex-col gap-2">
        <Button
          onClick={add}
          loading={adding}
          loadingLabel="Adding"
          size="lg"
          fullWidth
          disabled={selection.variant?.stockStatus === "out-of-stock"}
        >
          {selection.variant?.stockStatus === "out-of-stock" ? "Sold out in this size" : "Add to bag"}
        </Button>
        <Link
          href={`/products/${product.slug}`}
          className="py-2 text-center text-[0.875rem] text-clay underline-offset-4 hover:text-ink hover:underline"
        >
          See fabric, fit and reviews
        </Link>
      </div>
    </div>
  );
}
