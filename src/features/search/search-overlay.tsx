"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ButterflyLoader } from "@/components/ui/butterfly";
import { Media } from "@/components/ui/media";
import { Drawer } from "@/components/ui/overlay";
import { Price } from "@/components/ui/price";
import { ApiError, catalogApi } from "@/lib/api/client";
import type { SearchResults } from "@/lib/api/types";

/**
 * Search runs as you type after a short pause. It shows products first,
 * because that is what almost everyone is looking for, then the other things
 * a query can mean.
 */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  /** Whatever came back last, tagged with the query that produced it. */
  const [outcome, setOutcome] = useState<
    { query: string; data: SearchResults } | { query: string; error: string } | null
  >(null);

  const trimmed = query.trim();

  // Derived: a result only counts as current if it answers what’s typed now.
  const current = outcome && outcome.query === trimmed ? outcome : null;
  const status =
    trimmed.length < 2 ? "idle" : current ? ("error" in current ? "error" : "ready") : "searching";
  const results = current && "data" in current ? current.data : null;
  const error = current && "error" in current ? current.error : null;

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open || trimmed.length < 2) return;

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      catalogApi
        .search(trimmed)
        .then((data) => {
          if (!controller.signal.aborted) setOutcome({ query: trimmed, data });
        })
        .catch((err: unknown) => {
          if (controller.signal.aborted) return;
          setOutcome({
            query: trimmed,
            error: err instanceof ApiError ? err.message : "Search isn’t responding. Try again in a moment.",
          });
        });
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [trimmed, open]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  const hasResults =
    results &&
    (results.products.length ||
      results.characters.length ||
      results.materials.length ||
      results.collections.length ||
      results.posts.length);

  return (
    <Drawer open={open} onClose={onClose} title="Search" hideTitle className="sm:max-w-[32rem]">
      <form onSubmit={submit} role="search" className="sticky top-0 -mt-1 bg-chalk pb-4">
        <div className="edge-iris flex items-center gap-3 rounded-sm bg-oyster px-3.5">
          <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 shrink-0 text-clay">
            <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Product, fabric, size or SKU"
            aria-label="Search Slyrah"
            className="h-12 w-full bg-transparent text-[1rem] text-ink placeholder:text-clay focus:outline-none"
          />
        </div>
      </form>

      {status === "idle" ? (
        <div>
          <p className="text-eyebrow mb-3">Try</p>
          <ul className="flex flex-wrap gap-2">
            {["high waist brief", "seamless thong", "wireless bra", "Egyptian cotton", "lace bralette", "mesh"].map(
              (term) => (
                <li key={term}>
                  <button
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-mist px-3 py-1.5 text-[0.8125rem] text-graphite transition-colors hover:border-iris hover:text-iris"
                  >
                    {term}
                  </button>
                </li>
              ),
            )}
          </ul>
        </div>
      ) : status === "searching" ? (
        <div className="grid place-items-center py-12">
          <ButterflyLoader label="Searching" />
        </div>
      ) : status === "error" ? (
        <p className="py-10 text-center text-[0.9375rem] text-danger">{error}</p>
      ) : !hasResults ? (
        <div className="py-12 text-center">
          <p className="text-heading">Nothing matches “{results?.query}”</p>
          <p className="mx-auto mt-2 max-w-xs text-[0.9375rem] text-clay">
            Try a fabric or a shape — “cotton”, “high waist”, “wireless” — or browse everything.
          </p>
          <Link
            href="/shop"
            onClick={onClose}
            className="mt-4 inline-block border-b border-ink/30 pb-px text-[0.9375rem] text-ink hover:border-ink"
          >
            Shop everything
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-7 pb-4">
          {results.products.length > 0 ? (
            <section>
              <p className="text-eyebrow mb-3">Products</p>
              <ul className="flex flex-col">
                {results.products.slice(0, 6).map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-sm py-2.5 transition-colors hover:bg-oyster"
                    >
                      <Media
                        asset={product.primaryImage}
                        tone={product.colors[0]?.hex ?? "#E4DCD3"}
                        alt={product.name}
                        aspect="1 / 1"
                        className="w-12 shrink-0 rounded-xs"
                        sizes="48px"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.9375rem] text-ink">{product.name}</span>
                        <span className="block truncate text-[0.8125rem] text-clay">{product.subtitle}</span>
                      </span>
                      <Price price={product.price} compareAt={product.compareAtPrice} size="sm" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {results.characters.length > 0 ? (
            <SearchGroup title="People">
              {results.characters.map((c) => (
                <SearchLink key={c.id} href={`/characters/${c.slug}`} onClick={onClose} label={c.name} detail={c.title} />
              ))}
            </SearchGroup>
          ) : null}

          {results.materials.length > 0 ? (
            <SearchGroup title="Fabrics">
              {results.materials.map((m) => (
                <SearchLink key={m.id} href={`/fabrics/${m.slug}`} onClick={onClose} label={m.name} detail={m.tagline} />
              ))}
            </SearchGroup>
          ) : null}

          {results.collections.length > 0 ? (
            <SearchGroup title="Collections">
              {results.collections.map((c) => (
                <SearchLink
                  key={c.id}
                  href={`/collections/${c.slug}`}
                  onClick={onClose}
                  label={c.title}
                  detail={`${c.productCount} pieces`}
                />
              ))}
            </SearchGroup>
          ) : null}

          {results.posts.length > 0 ? (
            <SearchGroup title="Journal">
              {results.posts.map((p) => (
                <SearchLink key={p.id} href={`/journal/${p.slug}`} onClick={onClose} label={p.title} detail={`${p.readingMinutes} min read`} />
              ))}
            </SearchGroup>
          ) : null}

          <Link
            href={`/search?q=${encodeURIComponent(results.query)}`}
            onClick={onClose}
            className="border-t border-mist pt-4 text-[0.9375rem] text-ink hover:text-iris"
          >
            See all {results.total} results for “{results.query}”
          </Link>
        </div>
      )}
    </Drawer>
  );
}

function SearchGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="text-eyebrow mb-2">{title}</p>
      <ul className="flex flex-col">{children}</ul>
    </section>
  );
}

function SearchLink({
  href,
  label,
  detail,
  onClick,
}: {
  href: string;
  label: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="flex items-baseline justify-between gap-4 rounded-sm py-2 transition-colors hover:bg-oyster"
      >
        <span className="text-[0.9375rem] text-ink">{label}</span>
        <span className="shrink-0 text-[0.8125rem] text-clay">{detail}</span>
      </Link>
    </li>
  );
}
