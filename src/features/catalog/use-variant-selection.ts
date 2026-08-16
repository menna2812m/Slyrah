"use client";

import { useMemo, useState } from "react";

import type { Product, ProductVariant } from "@/lib/api/types";

/**
 * Colour and size are chosen against real variant stock, so an unavailable
 * combination is visibly unavailable before it is tapped rather than after.
 */
export function useVariantSelection(product: Product) {
  const firstAvailable = useMemo(
    () => product.variants.find((v) => v.stockStatus !== "out-of-stock") ?? product.variants[0],
    [product.variants],
  );

  const [colorId, setColorId] = useState<string | null>(firstAvailable?.colorId ?? null);
  const [sizeId, setSizeId] = useState<string | null>(null);

  const variant: ProductVariant | null = useMemo(() => {
    if (!colorId || !sizeId) return null;
    return product.variants.find((v) => v.colorId === colorId && v.sizeId === sizeId) ?? null;
  }, [product.variants, colorId, sizeId]);

  const sizeAvailability = useMemo(() => {
    const map = new Map<string, ProductVariant | undefined>();
    for (const size of product.sizes) {
      map.set(size.id, product.variants.find((v) => v.colorId === colorId && v.sizeId === size.id));
    }
    return map;
  }, [product.sizes, product.variants, colorId]);

  const colorUnavailable = useMemo(() => {
    const ids = new Set<string>();
    for (const color of product.colors) {
      const has = product.variants.some((v) => v.colorId === color.id && v.stockStatus !== "out-of-stock");
      if (!has) ids.add(color.id);
    }
    return ids;
  }, [product.colors, product.variants]);

  function selectColor(nextColorId: string) {
    setColorId(nextColorId);
    // Keep the chosen size if it exists in the new colour, otherwise clear it
    // rather than silently switching to something she didn’t pick.
    if (sizeId) {
      const stillThere = product.variants.find(
        (v) => v.colorId === nextColorId && v.sizeId === sizeId && v.stockStatus !== "out-of-stock",
      );
      if (!stillThere) setSizeId(null);
    }
  }

  const selectedColor = product.colors.find((c) => c.id === colorId) ?? null;
  const selectedSize = product.sizes.find((s) => s.id === sizeId) ?? null;

  return {
    colorId,
    sizeId,
    selectedColor,
    selectedSize,
    variant,
    sizeAvailability,
    colorUnavailable,
    selectColor,
    selectSize: setSizeId,
  };
}
