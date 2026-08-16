import type {
  AppliedDiscount,
  Cart,
  CartLine,
  CartLineInput,
  CartTotals,
  Money,
} from "@/lib/api/types";
import { DISCOUNT_CODES, FREE_SHIPPING_THRESHOLD, governorateById } from "@/mocks/commerce";
import { productBySlug } from "@/mocks/products";
import { colorById, sizeById } from "@/mocks/taxonomy";

/**
 * Cart pricing. Deliberately server-side: the client never computes a total it
 * then sends back. When the real Admin API lands, this file is deleted and the
 * same shapes come over the wire.
 */

interface StoredCart {
  id: string;
  lines: CartLineInput[];
  codes: string[];
  governorateId: string | null;
}

const CARTS = new Map<string, StoredCart>();

const egp = (amount: number): Money => ({ amount, currency: "EGP" });

export function getStoredCart(cartId: string): StoredCart {
  let cart = CARTS.get(cartId);
  if (!cart) {
    cart = { id: cartId, lines: [], codes: [], governorateId: null };
    CARTS.set(cartId, cart);
  }
  return cart;
}

export function mutateCart(cartId: string, mutate: (cart: StoredCart) => void): Cart {
  const cart = getStoredCart(cartId);
  mutate(cart);
  cart.lines = cart.lines.filter((line) => line.quantity > 0);
  return priceCart(cart);
}

export function replaceCartLines(cartId: string, lines: CartLineInput[]): Cart {
  return mutateCart(cartId, (cart) => {
    cart.lines = lines.filter((line) => line.quantity > 0);
  });
}

function resolveLine(input: CartLineInput): CartLine | null {
  const product = productBySlug.get(input.productSlug);
  if (!product) return null;
  const variant = product.variants.find((v) => v.id === input.variantId);
  if (!variant) return null;

  const color = colorById.get(variant.colorId);
  const size = sizeById.get(variant.sizeId);
  const maxQuantity = variant.stockQuantity;
  const quantity = maxQuantity == null ? input.quantity : Math.min(input.quantity, Math.max(maxQuantity, 0));

  return {
    id: `${input.productSlug}:${input.variantId}`,
    productSlug: product.slug,
    variantId: variant.id,
    name: product.name,
    subtitle: product.subtitle,
    sku: variant.sku,
    image: product.primaryImage,
    colorName: color?.name ?? "—",
    colorHex: color?.hex ?? "#cccccc",
    sizeLabel: size?.label ?? "—",
    quantity,
    unitPrice: variant.price,
    unitCompareAtPrice: variant.compareAtPrice,
    lineTotal: egp(variant.price.amount * quantity),
    stockStatus: variant.stockStatus,
    maxQuantity,
  };
}

function applyDiscounts(lines: CartLine[], codes: string[], subtotal: Money) {
  const discounts: AppliedDiscount[] = [];
  let freeShipping = false;

  for (const rawCode of codes) {
    const code = rawCode.toUpperCase();
    const rule = DISCOUNT_CODES[code];
    if (!rule) continue;

    if (rule.type === "percentage" && rule.percentage) {
      discounts.push({
        code,
        label: rule.label,
        amount: egp(Math.round((subtotal.amount * rule.percentage) / 100)),
        type: "percentage",
      });
    } else if (rule.type === "fixed" && rule.fixed) {
      if (rule.minSubtotal && subtotal.amount < rule.minSubtotal) continue;
      discounts.push({ code, label: rule.label, amount: egp(rule.fixed), type: "fixed" });
    } else if (rule.type === "free-shipping") {
      freeShipping = true;
      discounts.push({ code, label: rule.label, amount: egp(0), type: "free-shipping" });
    } else if (rule.type === "buy-x-get-y") {
      // Three briefs, pay for two: the cheapest unit in every group of three
      // comes off. Expanded per unit so quantities count correctly.
      const units = lines
        .flatMap((line) => Array.from({ length: line.quantity }, () => line.unitPrice.amount))
        .sort((a, b) => a - b);
      const freeCount = Math.floor(units.length / 3);
      if (freeCount > 0) {
        const amount = units.slice(0, freeCount).reduce((sum, price) => sum + price, 0);
        discounts.push({ code, label: rule.label, amount: egp(amount), type: "buy-x-get-y" });
      }
    }
  }

  return { discounts, freeShipping };
}

export function priceCart(stored: StoredCart): Cart {
  const lines = stored.lines
    .map(resolveLine)
    .filter((line): line is CartLine => Boolean(line));

  const subtotal = egp(lines.reduce((sum, line) => sum + line.lineTotal.amount, 0));
  const { discounts, freeShipping } = applyDiscounts(lines, stored.codes, subtotal);

  const discountTotal = egp(
    Math.min(
      subtotal.amount,
      discounts.reduce((sum, d) => sum + d.amount.amount, 0),
    ),
  );

  const discountedSubtotal = subtotal.amount - discountTotal.amount;
  const qualifiesForFreeShipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD.amount;

  const governorate = stored.governorateId ? governorateById.get(stored.governorateId) : undefined;
  let shipping: Money | null = null;
  if (governorate) {
    shipping = freeShipping || qualifiesForFreeShipping ? egp(0) : governorate.fee;
  }

  const totals: CartTotals = {
    subtotal,
    discount: discountTotal,
    shipping,
    total: egp(discountedSubtotal + (shipping?.amount ?? 0)),
    freeShippingRemaining:
      lines.length === 0 || qualifiesForFreeShipping || freeShipping
        ? null
        : egp(FREE_SHIPPING_THRESHOLD.amount - discountedSubtotal),
  };

  return {
    id: stored.id,
    lines,
    totals,
    discounts,
    shippingGovernorateId: stored.governorateId,
    currency: "EGP",
  };
}

export function getCart(cartId: string): Cart {
  return priceCart(getStoredCart(cartId));
}

export function isKnownDiscountCode(code: string) {
  return Boolean(DISCOUNT_CODES[code.toUpperCase()]);
}
