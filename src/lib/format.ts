import type { Money, OrderStatus, StockStatus } from "@/lib/api/types";

const moneyFormatter = new Intl.NumberFormat("en-EG", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const moneyFormatterPrecise = new Intl.NumberFormat("en-EG", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Egyptian pricing is nearly always whole pounds, so we hide `.00` and only
 * show piastres when they exist. "1,299 EGP" reads faster than "EGP 1,299.00".
 */
export function formatMoney(money: Money | null | undefined): string {
  if (!money) return "—";
  const major = money.amount / 100;
  const body = Number.isInteger(major)
    ? moneyFormatter.format(major)
    : moneyFormatterPrecise.format(major);
  return `${body} ${money.currency}`;
}

export function formatMoneyValue(money: Money | null | undefined): string {
  if (!money) return "—";
  const major = money.amount / 100;
  return Number.isInteger(major) ? moneyFormatter.format(major) : moneyFormatterPrecise.format(major);
}

export function addMoney(a: Money, b: Money): Money {
  return { amount: a.amount + b.amount, currency: a.currency };
}

export function subtractMoney(a: Money, b: Money): Money {
  return { amount: Math.max(0, a.amount - b.amount), currency: a.currency };
}

export function multiplyMoney(money: Money, factor: number): Money {
  return { amount: Math.round(money.amount * factor), currency: money.currency };
}

export function zeroMoney(currency: Money["currency"] = "EGP"): Money {
  return { amount: 0, currency };
}

/** Whole-percent saving, floored so we never overstate a discount. */
export function discountPercent(price: Money, compareAt: Money | null | undefined): number | null {
  if (!compareAt || compareAt.amount <= price.amount) return null;
  return Math.floor(((compareAt.amount - price.amount) / compareAt.amount) * 100);
}

export function savingAmount(price: Money, compareAt: Money | null | undefined): Money | null {
  if (!compareAt || compareAt.amount <= price.amount) return null;
  return { amount: compareAt.amount - price.amount, currency: price.currency };
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : dateTimeFormatter.format(date);
}

export function formatDuration(seconds: number | undefined): string {
  if (!seconds) return "";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export const STOCK_LABEL: Record<StockStatus, string> = {
  "in-stock": "In stock",
  "low-stock": "Only a few left",
  "out-of-stock": "Sold out",
  preorder: "Pre-order",
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  "ready-to-ship": "Ready to ship",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
  refunded: "Refunded",
};

/** The happy path, in order. Cancelled/returned/refunded sit outside it. */
export const ORDER_PROGRESSION: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready-to-ship",
  "out-for-delivery",
  "delivered",
];

export function isTerminalStatus(status: OrderStatus) {
  return status === "cancelled" || status === "returned" || status === "refunded";
}

/** "01 : 12 : 44" parts for the flash-sale countdown. */
export function countdownParts(msRemaining: number) {
  const total = Math.max(0, Math.floor(msRemaining / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    expired: total <= 0,
  };
}

/** Egyptian mobile numbers: 010/011/012/015 + 8 digits. */
export function normalizeEgyptianPhone(input: string): string {
  const digits = input.replace(/[^\d+]/g, "");
  if (digits.startsWith("+20")) return `0${digits.slice(3)}`;
  if (digits.startsWith("20") && digits.length === 12) return `0${digits.slice(2)}`;
  return digits;
}

export function isValidEgyptianPhone(input: string): boolean {
  return /^01[0125]\d{8}$/.test(normalizeEgyptianPhone(input));
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
