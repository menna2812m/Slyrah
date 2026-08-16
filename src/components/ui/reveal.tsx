"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for the whole document rather than one per section.
 * Elements opt in with `data-reveal`; without JS or with reduced motion they
 * are simply visible, so nothing depends on this running.
 */
export function RevealObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        el.dataset.revealed = "true";
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const delay = Number(el.dataset.revealDelay ?? 0);
          window.setTimeout(() => {
            el.dataset.revealed = "true";
          }, delay);
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    const scan = () => {
      document
        .querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed="true"])')
        .forEach((el) => observer.observe(el));
    };

    scan();
    const mutation = new MutationObserver(scan);
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);

  return null;
}
