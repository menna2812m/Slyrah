"use client";

import Link from "next/link";
import { useEffect } from "react";
import { create } from "zustand";

import { Butterfly } from "@/components/ui/butterfly";
import { CloseButton } from "@/components/ui/overlay";
import { cn, uid } from "@/lib/utils";

/**
 * Every async action reports back here. No browser alerts anywhere in the app.
 * Toast copy keeps the verb of the control that produced it: "Add to bag"
 * produces "Added to your bag".
 */

export type ToastTone = "success" | "error" | "info";

export interface Toast {
  id: string;
  tone: ToastTone;
  message: string;
  detail?: string;
  action?: { label: string; href: string };
  durationMs: number;
}

interface ToastStore {
  toasts: Toast[];
  push: (toast: Omit<Toast, "id" | "durationMs"> & { durationMs?: number }) => string;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = uid("toast");
    const durationMs = toast.durationMs ?? (toast.tone === "error" ? 7000 : 4500);
    set((state) => ({ toasts: [...state.toasts.slice(-2), { ...toast, id, durationMs }] }));
    return id;
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (message: string, extra?: Partial<Toast>) =>
    useToastStore.getState().push({ tone: "success", message, ...extra }),
  error: (message: string, extra?: Partial<Toast>) =>
    useToastStore.getState().push({ tone: "error", message, ...extra }),
  info: (message: string, extra?: Partial<Toast>) =>
    useToastStore.getState().push({ tone: "info", message, ...extra }),
};

function ToastRow({ item }: { item: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss);

  useEffect(() => {
    const timer = window.setTimeout(() => dismiss(item.id), item.durationMs);
    return () => window.clearTimeout(timer);
  }, [item.id, item.durationMs, dismiss]);

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full items-start gap-3 rounded-md border bg-chalk px-4 py-3 shadow-lift",
        "motion-safe:animate-[slyrah-rise_.3s_var(--ease-drape)]",
        item.tone === "error" ? "border-danger/30" : "border-mist",
      )}
    >
      <span className="mt-0.5 shrink-0">
        {item.tone === "success" ? (
          <Butterfly variant="duochrome" className="h-4.5 w-4.5" animate />
        ) : item.tone === "error" ? (
          <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4.5 w-4.5 text-danger">
            <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10 6v5M10 13.6v.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        ) : (
          <Butterfly variant="outline" filled={false} className="h-4.5 w-4.5 text-clay" />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className={cn("text-[0.9375rem] leading-snug", item.tone === "error" ? "text-danger" : "text-ink")}>
          {item.message}
        </p>
        {item.detail ? <p className="mt-0.5 text-[0.8125rem] text-clay">{item.detail}</p> : null}
        {item.action ? (
          <Link
            href={item.action.href}
            onClick={() => dismiss(item.id)}
            className="mt-2 inline-block border-b border-ink/30 pb-px text-[0.8125rem] text-ink transition-colors hover:border-ink"
          >
            {item.action.label}
          </Link>
        ) : null}
      </div>

      <CloseButton onClick={() => dismiss(item.id)} label="Dismiss" />
    </div>
  );
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-80 flex flex-col items-center gap-2 p-3 sm:inset-x-auto sm:end-0 sm:max-w-sm sm:items-end sm:p-5"
    >
      {toasts.map((item) => (
        <ToastRow key={item.id} item={item} />
      ))}
    </div>
  );
}
