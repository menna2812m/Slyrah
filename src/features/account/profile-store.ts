"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * A local profile.
 *
 * Real accounts are created from a confirmed order (see the confirmation
 * page) and will be served by the Admin API. Until someone does that, the
 * things that only need to live on this device — saved sizes, the phone she
 * tracks orders with — are kept here so the account page is useful on day one
 * rather than an empty shell. When sign-in lands, this becomes the local
 * cache in front of it.
 */

interface ProfileState {
  firstName: string;
  phone: string;
  /** Keyed by cut family: { briefs: "M", bras: "34B" } */
  savedSizes: Record<string, string>;
  hydrated: boolean;

  setDetails: (details: { firstName?: string; phone?: string }) => void;
  setSize: (family: string, size: string) => void;
  removeSize: (family: string) => void;
  clear: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      firstName: "",
      phone: "",
      savedSizes: {},
      hydrated: false,

      setDetails: (details) => set((state) => ({ ...state, ...details })),

      setSize: (family, size) =>
        set((state) => ({ savedSizes: { ...state.savedSizes, [family]: size } })),

      removeSize: (family) =>
        set((state) => {
          const next = { ...state.savedSizes };
          delete next[family];
          return { savedSizes: next };
        }),

      clear: () => set({ firstName: "", phone: "", savedSizes: {} }),
    }),
    {
      name: "slyrah.profile",
      version: 1,
      partialize: (state) => ({
        firstName: state.firstName,
        phone: state.phone,
        savedSizes: state.savedSizes,
      }),
      onRehydrateStorage: () => () => {
        useProfileStore.setState({ hydrated: true });
      },
    },
  ),
);
