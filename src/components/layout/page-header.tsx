import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Breadcrumbs({ trail, className }: { trail: { label: string; href: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-clay">
        {trail.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {index === trail.length - 1 ? (
              <span aria-current="page" className="text-graphite">
                {crumb.label}
              </span>
            ) : (
              <Link href={crumb.href} className="transition-colors hover:text-ink">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({
  trail,
  eyebrow,
  title,
  lede,
  meta,
  children,
  className,
}: {
  trail?: { label: string; href: string }[];
  eyebrow?: string;
  title: string;
  lede?: string | null;
  meta?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("pt-8 pb-10 sm:pt-10 sm:pb-12", className)}>
      {trail ? <Breadcrumbs trail={trail} className="mb-7" /> : null}
      {eyebrow ? <p className="text-eyebrow mb-3">{eyebrow}</p> : null}
      <h1 className="text-display max-w-3xl">{title}</h1>
      {lede ? <p className="mt-5 max-w-2xl text-lede text-graphite">{lede}</p> : null}
      {meta ? <div className="mt-6">{meta}</div> : null}
      {children}
    </header>
  );
}
