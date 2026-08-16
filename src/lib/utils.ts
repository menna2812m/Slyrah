import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Stable ids for optimistic cart lines and DOM ids. */
export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/**
 * Darkens a hex colour toward its shadow side. Used to derive the second wing
 * of a butterfly swatch when Admin hasn’t uploaded a shifted tone.
 */
export function shiftHex(hex: string, amount = -0.14): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = Number.parseInt(full, 16);
  if (Number.isNaN(num)) return hex;

  const channels = [(num >> 16) & 255, (num >> 8) & 255, num & 255].map((channel) => {
    const next = amount < 0 ? channel * (1 + amount) : channel + (255 - channel) * amount;
    return clamp(Math.round(next), 0, 255);
  });

  return `#${channels.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/** Relative luminance, so swatch borders and check marks stay legible. */
export function isLightHex(hex: string): boolean {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = Number.parseInt(full, 16);
  if (Number.isNaN(num)) return true;
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b) > 0.55;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
