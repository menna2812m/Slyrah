"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { AnnouncementItem } from "@/lib/api/types";
import { cn } from "@/lib/utils";

/**
 * Content and cadence both come from Admin. The bar cross-fades rather than
 * sliding — a slide at this height reads as jitter on a phone.
 */
export function AnnouncementBar({
  items,
  intervalMs = 5000,
}: {
  items: AnnouncementItem[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [items.length, intervalMs, paused]);

  if (items.length === 0) return null;

  return (
    <div
      className="relative z-50 bg-aubergine text-chalk"
      style={{ height: "var(--announcement-height)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="shell flex h-full items-center justify-center">
        {items.map((item, i) => {
          const content = (
            <span className="text-eyebrow text-chalk/85">{item.text}</span>
          );
          return (
            <div
              key={item.id}
              aria-hidden={i !== index}
              className={cn(
                "absolute inset-0 flex items-center justify-center px-4 transition-opacity duration-500 ease-[var(--ease-drape)]",
                i === index ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              {item.href ? (
                <Link
                  href={item.href}
                  tabIndex={i === index ? 0 : -1}
                  className="border-b border-chalk/25 pb-px transition-colors hover:border-chalk/70"
                >
                  {content}
                </Link>
              ) : (
                content
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
