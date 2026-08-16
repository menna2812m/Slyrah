/**
 * Deterministic pseudo-randomness for the development fixtures, so the server
 * and the client always agree on stock levels and generated content.
 *
 * FNV-1a alone is not enough here: our seeds differ only in their last
 * character ("…:body:0", "…:body:1"), and FNV's final multiply leaves the high
 * bits almost untouched, so scaling the word to a float returns nearly the same
 * number every time. The xorshift finalizer below diffuses the low bits back
 * across the word before we take the float.
 */
export function seeded(seed: string): number {
  let h = 2166136261;

  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  // Avalanche, so a one-character change moves the whole value.
  h ^= h >>> 16;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  h ^= h >>> 16;

  return (h >>> 0) / 4294967296;
}

/** Picks an item from a list using the seed. Never returns undefined. */
export function seededPick<T>(seed: string, items: readonly T[], fallback: T): T {
  if (items.length === 0) return fallback;
  return items[Math.floor(seeded(seed) * items.length)] ?? fallback;
}
