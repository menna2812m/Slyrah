"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Wishlist for guests.
 *
 * Kept in local storage so it works without an account. When someone creates
 * an account we send this list up and it becomes theirs — nothing is lost, and
 * nobody is asked to sign in before they can save something.
 */

interface WishlistState {
  slugs: string[];
  hydrated: boolean;
  toggle: (slug: string) => boolean;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  has: (slug: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      slugs: [],
      hydrated: false,

      toggle: (slug) => {
        const exists = get().slugs.includes(slug);
        set((state) => ({
          slugs: exists ? state.slugs.filter((s) => s !== slug) : [slug, ...state.slugs].slice(0, 200),
        }));
        return !exists;
      },

      add: (slug) =>
        set((state) => ({
          slugs: state.slugs.includes(slug) ? state.slugs : [slug, ...state.slugs].slice(0, 200),
        })),

      remove: (slug) => set((state) => ({ slugs: state.slugs.filter((s) => s !== slug) })),

      has: (slug) => get().slugs.includes(slug),

      clear: () => set({ slugs: [] }),
    }),
    {
      name: "slyrah.wishlist",
      version: 1,
      partialize: (state) => ({ slugs: state.slugs }),
      onRehydrateStorage: () => () => {
        useWishlistStore.setState({ hydrated: true });
      },
    },
  ),
);
