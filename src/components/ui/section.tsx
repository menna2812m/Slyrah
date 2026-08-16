import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * One section header, used everywhere. The eyebrow, title and link always sit
 * in the same relationship so the page has a single rhythm as you scroll.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  cta,
  align = "start",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string | null;
  cta?: { label: string; href: string } | null;
  align?: "start" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "sm:mx-auto")}>
        {eyebrow ? (
          <p className={cn("text-eyebrow mb-3", tone === "dark" && "text-chalk/55")}>{eyebrow}</p>
        ) : null}
        <h2 className={cn("text-title", tone === "dark" && "text-chalk")}>{title}</h2>
        {description ? (
          <p className={cn("mt-3 text-lede text-graphite", tone === "dark" && "text-chalk/70")}>{description}</p>
        ) : null}
      </div>

      {cta ? (
        <Link
          href={cta.href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-2 self-start border-b pb-1 text-[0.9375rem] transition-colors sm:self-end",
            tone === "dark"
              ? "border-chalk/30 text-chalk hover:border-chalk"
              : "border-ink/25 text-ink hover:border-ink",
          )}
        >
          {cta.label}
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3 transition-transform group-hover:translate-x-0.5">
            <path d="M2 8h12M9.5 3.5L14 8l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      ) : null}
    </div>
  );
}
