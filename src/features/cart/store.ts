"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { ApiError, cartApi } from "@/lib/api/client";
import type { Cart, CartLineInput } from "@/lib/api/types";
import { uid } from "@/lib/utils";

/**
 * The bag.
 *
 * Line quantities are kept locally so a guest’s bag survives a refresh, but
 * every price, discount and total comes back from the server — the client
 * never computes a number it then sends back.
 */

interface CartState {
  cartId: string;
  lines: CartLineInput[];
  codes: string[];
  governorateId: string | null;

  cart: Cart | null;
  status: "idle" | "syncing" | "ready" | "error";
  error: string | null;
  hydrated: boolean;

  sync: () => Promise<void>;
  addLine: (line: CartLineInput) => Promise<void>;
  setQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeLine: (variantId: string) => Promise<void>;
  applyCode: (code: string) => Promise<void>;
  removeCode: (code: string) => Promise<void>;
  setGovernorate: (governorateId: string | null) => Promise<void>;
  clear: () => void;
}

function mergeLines(lines: CartLineInput[], incoming: CartLineInput): CartLineInput[] {
  const existing = lines.find((l) => l.variantId === incoming.variantId);
  if (!existing) return [...lines, incoming];
  return lines.map((l) =>
    l.variantId === incoming.variantId ? { ...l, quantity: Math.min(20, l.quantity + incoming.quantity) } : l,
  );
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: uid("cart"),
      lines: [],
      codes: [],
      governorateId: null,
      cart: null,
      status: "idle",
      error: null,
      hydrated: false,

      sync: async () => {
        const { cartId, lines, codes, governorateId } = get();
        set({ status: "syncing", error: null });
        try {
          let cart = await cartApi.setLines(cartId, lines);
          for (const code of codes) {
            try {
              cart = await cartApi.applyDiscount(cartId, code);
            } catch {
              // A code that no longer applies is dropped quietly on sync —
              // it is surfaced loudly only when someone types it in.
              set((s) => ({ codes: s.codes.filter((c) => c !== code) }));
            }
          }
          if (governorateId) cart = await cartApi.setGovernorate(cartId, governorateId);
          set({ cart, status: "ready" });
        } catch (error) {
          set({
            status: "error",
            error: error instanceof ApiError ? error.message : "We couldn’t load your bag. Try again.",
          });
        }
      },

      addLine: async (line) => {
        set((state) => ({ lines: mergeLines(state.lines, line) }));
        await get().sync();
      },

      setQuantity: async (variantId, quantity) => {
        set((state) => ({
          lines: state.lines
            .map((l) => (l.variantId === variantId ? { ...l, quantity } : l))
            .filter((l) => l.quantity > 0),
        }));
        await get().sync();
      },

      removeLine: async (variantId) => {
        set((state) => ({ lines: state.lines.filter((l) => l.variantId !== variantId) }));
        await get().sync();
      },

      applyCode: async (code) => {
        const normalized = code.trim().toUpperCase();
        const cart = await cartApi.applyDiscount(get().cartId, normalized);
        set((state) => ({
          codes: state.codes.includes(normalized) ? state.codes : [...state.codes, normalized],
          cart,
        }));
      },

      removeCode: async (code) => {
        set((state) => ({ codes: state.codes.filter((c) => c !== code) }));
        await get().sync();
      },

      setGovernorate: async (governorateId) => {
        set({ governorateId });
        const cart = await cartApi.setGovernorate(get().cartId, governorateId);
        set({ cart });
      },

      clear: () => set({ lines: [], codes: [], cart: null, status: "idle" }),
    }),
    {
      name: "slyrah.bag",
      version: 1,
      partialize: (state) => ({
        cartId: state.cartId,
        lines: state.lines,
        codes: state.codes,
        governorateId: state.governorateId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.sync();
        useCartStore.setState({ hydrated: true });
      },
    },
  ),
);

/** Item count for the header badge. Reads the local lines so it never flickers. */
export function useCartCount() {
  return useCartStore((state) => state.lines.reduce((sum, line) => sum + line.quantity, 0));
}
