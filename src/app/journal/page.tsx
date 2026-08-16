import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Media } from "@/components/ui/media";
import { getBlogPosts, getCharacters } from "@/lib/api/server-data";
import { formatDate } from "@/lib/format";
import { metadataFromSeo } from "@/lib/seo";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromSeo(
    {
      title: "Journal",
      description:
        "Fit, fabric and care, written from the point of view of the four women the range is built around. No sales pitch attached.",
    },
    "/journal",
  );
}

export default async function JournalPage() {
  const [posts, characters] = await Promise.all([getBlogPosts(), getCharacters()]);
  const characterBySlug = new Map(characters.map((c) => [c.slug, c]));

  return (
    <div className="shell">
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Journal", href: "/journal" },
        ]}
        title="Written by the four of them"
        lede="Everything here answers a question we’ve actually been asked. Each piece is filed under whoever asks it most."
      />

      <ul className="grid gap-x-8 gap-y-12 pb-20 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => {
          const character = post.characterSlug ? characterBySlug.get(post.characterSlug) : undefined;
          return (
            <li key={post.id} className="group flex flex-col" data-reveal data-reveal-delay={index * 60}>
              <Link href={`/journal/${post.slug}`} className="block overflow-hidden rounded-md">
                <Media
                  asset={post.featuredImage}
                  weave="jersey"
                  tone={character?.accent.from ?? "#D5CDD3"}
                  alt={post.title}
                  aspect="16 / 10"
                  sizes="(max-width: 768px) 92vw, 30vw"
                  priority={index < 3}
                  className="transition-transform duration-700 ease-[var(--ease-drape)] group-hover:scale-[1.03]"
                />
              </Link>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-clay">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readingMinutes} min</span>
                {character ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <Link href={`/characters/${character.slug}`} className="hover:text-ink">
                      {character.name}
                    </Link>
                  </>
                ) : null}
              </div>

              <h2 className="mt-2.5 text-heading">
                <Link href={`/journal/${post.slug}`} className="transition-colors hover:text-iris">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-graphite">{post.excerpt}</p>

              {post.tags.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <li key={tag} className="rounded-full border border-mist px-2.5 py-1 text-[0.6875rem] text-clay">
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
