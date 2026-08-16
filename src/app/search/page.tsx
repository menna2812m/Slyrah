import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { weaveStyle } from "@/components/ui/media";
import { PortraitMedia } from "@/components/ui/media";
import { ProductGrid } from "@/features/catalog/product-card";
import { search } from "@/lib/api/server-data";
import { pluralize } from "@/lib/format";

type SearchParams = Promise<{ q?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : "Search",
    description: "Search Slyrah by product, fabric, cut, collection or SKU.",
    // Search result pages are per-visitor, not per-page — keep them out of the index.
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const { q = "" } = await searchParams;
  const results = await search(q);

  const secondary =
    results.characters.length + results.materials.length + results.collections.length + results.posts.length;

  return (
    <div className="shell">
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Search", href: "/search" },
        ]}
        title={q ? `“${q}”` : "Search"}
        lede={
          q
            ? `${pluralize(results.products.length, "product")}${secondary ? `, plus ${secondary} other matches` : ""}.`
            : "Search by product name, fabric, cut, collection or SKU."
        }
      />

      <form action="/search" role="search" className="mb-12 max-w-xl">
        <label htmlFor="search-q" className="text-eyebrow mb-2 block">
          Search again
        </label>
        <div className="edge-iris flex items-center gap-3 rounded-sm bg-chalk px-3.5">
          <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 shrink-0 text-clay">
            <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            id="search-q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Product, fabric, size or SKU"
            className="h-12 w-full bg-transparent text-[1rem] text-ink placeholder:text-clay focus:outline-none"
          />
        </div>
      </form>

      {!q ? (
        <div className="pb-24">
          <p className="text-eyebrow mb-4">Try one of these</p>
          <ul className="flex flex-wrap gap-2">
            {results.suggestions.map((term) => (
              <li key={term}>
                <Link
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="inline-block rounded-full border border-mist px-3.5 py-2 text-[0.875rem] text-graphite transition-colors hover:border-iris hover:text-iris"
                >
                  {term}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : results.total === 0 ? (
        <EmptyState
          title={`Nothing matches “${q}”`}
          body="Try a fabric or a shape — “cotton”, “high waist”, “wireless”. Or browse everything and filter from there."
          action={{ label: "Shop everything", href: "/shop" }}
          className="my-10"
        />
      ) : (
        <div className="flex flex-col gap-16 pb-24">
          {results.products.length > 0 ? (
            <section>
              <h2 className="text-title mb-8">Products</h2>
              <ProductGrid products={results.products} />
            </section>
          ) : null}

          {results.characters.length > 0 ? (
            <section>
              <h2 className="text-title mb-8">People</h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {results.characters.map((character) => (
                  <li key={character.id}>
                    <Link href={`/characters/${character.slug}`} className="group block overflow-hidden rounded-md">
                      <div className="relative">
                        <PortraitMedia
                          asset={character.portrait}
                          name={character.name}
                          accent={character.accent}
                          alt={character.name}
                          aspect="3 / 4"
                          sizes="(max-width: 640px) 92vw, 24vw"
                        />
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-aubergine-deep/70 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-4">
                          <p className="text-eyebrow text-chalk/60">{character.name}</p>
                          <p className="mt-1.5 font-display text-[1.1rem] leading-tight text-chalk">{character.title}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {results.materials.length > 0 ? (
            <section>
              <h2 className="text-title mb-8">Fabrics</h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.materials.map((material) => (
                  <li key={material.id}>
                    <Link
                      href={`/fabrics/${material.slug}`}
                      className="flex h-full flex-col overflow-hidden rounded-md border border-mist bg-chalk transition-colors hover:border-clay"
                    >
                      <span aria-hidden="true" className="block h-20 w-full" style={weaveStyle(material.weave, "#DED6D2")} />
                      <span className="p-4">
                        <span className="block text-[0.9375rem] text-ink">{material.name}</span>
                        <span className="mt-1 block text-[0.8125rem] text-clay">{material.tagline}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {results.collections.length > 0 || results.posts.length > 0 ? (
            <section>
              <h2 className="text-title mb-8">Elsewhere on the site</h2>
              <ul className="flex flex-col divide-y divide-mist border-y border-mist">
                {results.collections.map((collection) => (
                  <li key={collection.id}>
                    <Link
                      href={`/collections/${collection.slug}`}
                      className="flex items-baseline justify-between gap-4 py-3.5"
                    >
                      <span className="text-[0.9375rem] text-ink">{collection.title}</span>
                      <span className="text-[0.8125rem] text-clay">Collection</span>
                    </Link>
                  </li>
                ))}
                {results.posts.map((post) => (
                  <li key={post.id}>
                    <Link href={`/journal/${post.slug}`} className="flex items-baseline justify-between gap-4 py-3.5">
                      <span className="text-[0.9375rem] text-ink">{post.title}</span>
                      <span className="text-[0.8125rem] text-clay">Journal</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
