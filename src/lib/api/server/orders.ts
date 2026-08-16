import type { AccountClaimDraft, CheckoutDraft, Customer, Order, OrderEvent } from "@/lib/api/types";
import { getCart } from "@/lib/api/server/cart";
import { ORDER_STORE, governorateById } from "@/mocks/commerce";
import { productBySlug } from "@/mocks/products";

const CUSTOMERS = new Map<string, Customer>();

function nextOrderNumber(): string {
  const sequence = 4472 + ORDER_STORE.size;
  return `SLY-2608-${sequence}`;
}

export function createOrder(draft: CheckoutDraft): Order {
  const cart = getCart(draft.cartId);

  if (cart.lines.length === 0) {
    throw new OrderError("EMPTY_CART", "Your bag is empty. Add something before checking out.");
  }

  const governorate = governorateById.get(draft.address.governorateId);
  if (!governorate || !governorate.active) {
    throw new OrderError("UNSUPPORTED_GOVERNORATE", "We don’t deliver to that governorate yet. Pick another or message us.", {
      governorateId: "Choose a governorate we deliver to.",
    });
  }

  const city = governorate.cities.find((c) => c.id === draft.address.cityId);
  if (!city) {
    throw new OrderError("UNKNOWN_CITY", "Choose a city inside your governorate.", {
      cityId: "Choose a city.",
    });
  }

  const soldOut = cart.lines.filter((line) => line.stockStatus === "out-of-stock");
  if (soldOut.length > 0) {
    throw new OrderError(
      "OUT_OF_STOCK",
      `${soldOut[0]!.name} in ${soldOut[0]!.colorName}, size ${soldOut[0]!.sizeLabel} sold out while you were checking out. Remove it to continue.`,
    );
  }

  // Shipping is recalculated against the chosen governorate, never trusted
  // from the client.
  const freeShipping = cart.totals.freeShippingRemaining === null;
  const shipping = { amount: freeShipping ? 0 : governorate.fee.amount, currency: "EGP" as const };
  const total = {
    amount: cart.totals.subtotal.amount - cart.totals.discount.amount + shipping.amount,
    currency: "EGP" as const,
  };

  const placedAt = new Date().toISOString();
  const timeline: OrderEvent[] = [{ status: "pending", at: placedAt, note: "Order received. We’ll call to confirm." }];

  const order: Order = {
    id: `ord-${Date.now().toString(36)}`,
    orderNumber: nextOrderNumber(),
    status: "pending",
    placedAt,
    lines: cart.lines.map((line) => ({
      productSlug: line.productSlug,
      name: line.name,
      image: productBySlug.get(line.productSlug)?.primaryImage ?? null,
      colorName: line.colorName,
      sizeLabel: line.sizeLabel,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      lineTotal: line.lineTotal,
    })),
    totals: { ...cart.totals, shipping, total },
    discounts: cart.discounts,
    address: draft.address,
    governorateName: governorate.name,
    cityName: city.name,
    paymentMethod: draft.paymentMethod,
    timeline,
    deliveryAttempts: [],
    estimatedDelivery: null,
    isGuest: true,
  };

  ORDER_STORE.set(order.orderNumber, order);
  return order;
}

export function getOrder(orderNumber: string, phone?: string): Order | null {
  const order = ORDER_STORE.get(orderNumber.trim().toUpperCase());
  if (!order) return null;
  // Guest tracking requires the phone on the order — an order number alone is
  // guessable.
  if (phone && order.address.phone.replace(/\D/g, "") !== phone.replace(/\D/g, "")) return null;
  return order;
}

export function claimAccount(draft: AccountClaimDraft): { customer: Customer; order: Order } {
  const order = ORDER_STORE.get(draft.orderNumber.trim().toUpperCase());
  if (!order) {
    throw new OrderError("ORDER_NOT_FOUND", "We couldn’t find that order number.", {
      orderNumber: "Check the number in your confirmation message.",
    });
  }
  if (order.address.phone.replace(/\D/g, "") !== draft.phone.replace(/\D/g, "")) {
    throw new OrderError("PHONE_MISMATCH", "That phone number doesn’t match the one on the order.", {
      phone: "Use the number you gave at checkout.",
    });
  }

  const customer: Customer = {
    id: `cus-${Date.now().toString(36)}`,
    firstName: draft.firstName,
    lastName: draft.lastName,
    phone: draft.phone,
    email: draft.email ?? order.address.email ?? null,
    savedSizes: Object.fromEntries(
      order.lines.map((line) => [productBySlug.get(line.productSlug)?.cutSlug ?? "other", line.sizeLabel]),
    ),
    addresses: [
      {
        ...order.address,
        id: "adr-1",
        label: "Home",
        isDefault: true,
      },
    ],
    createdAt: new Date().toISOString(),
  };

  CUSTOMERS.set(customer.id, customer);
  // The guest order is now owned by the account.
  order.isGuest = false;
  ORDER_STORE.set(order.orderNumber, order);

  return { customer, order };
}

export function getCustomer(id: string): Customer | null {
  return CUSTOMERS.get(id) ?? null;
}

export function listOrdersForPhone(phone: string): Order[] {
  const digits = phone.replace(/\D/g, "");
  return Array.from(ORDER_STORE.values())
    .filter((order) => order.address.phone.replace(/\D/g, "") === digits)
    .sort((a, b) => b.placedAt.localeCompare(a.placedAt));
}

export class OrderError extends Error {
  constructor(
    public code: string,
    message: string,
    public fields?: Record<string, string>,
  ) {
    super(message);
    this.name = "OrderError";
  }
}
