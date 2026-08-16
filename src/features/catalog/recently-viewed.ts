"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentlyViewedState {
  slugs: string[];
  hydrated: boolean;
  record: (slug: string) => void;
  clear: () => void;
}

const MAX = 12;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      slugs: [],
      hydrated: false,
      record: (slug) =>
        set((state) => ({ slugs: [slug, ...state.slugs.filter((s) => s !== slug)].slice(0, MAX) })),
      clear: () => set({ slugs: [] }),
    }),
    {
      name: "slyrah.recently-viewed",
      version: 1,
      partialize: (state) => ({ slugs: state.slugs }),
      onRehydrateStorage: () => () => {
        useRecentlyViewedStore.setState({ hydrated: true });
      },
    },
  ),
);
