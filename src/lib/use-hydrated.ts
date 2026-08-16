"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * True once the client has taken over.
 *
 * Anything read from local storage — the bag, the wishlist, saved sizes — is
 * absent during server rendering, so components gate on this before trusting
 * it. `useSyncExternalStore` gives the answer without a setState-in-effect,
 * which would cost an extra render on every one of these components.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
