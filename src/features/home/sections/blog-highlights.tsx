import Link from "next/link";

import { Media } from "@/components/ui/media";
import { SectionHeader } from "@/components/ui/section";
import type { BlogHighlightsSection as BlogData } from "@/lib/api/types";
import { formatDate } from "@/lib/format";

export function BlogHighlightsSection({ section }: { section: BlogData }) {
  return (
    <section className="bg-chalk py-16 sm:py-20 lg:py-24">
      <div className="shell">
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title ?? ""}
          description={section.description}
          cta={section.cta}
        />

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {section.posts.map((post, index) => (
            <article key={post.id} className="group flex flex-col" data-reveal data-reveal-delay={index * 70}>
              <Link href={`/journal/${post.slug}`} className="block overflow-hidden rounded-md">
                <Media
                  asset={post.featuredImage}
                  weave="jersey"
                  tone="#D5CDD3"
                  alt={post.title}
                  aspect="16 / 10"
                  sizes="(max-width: 768px) 90vw, 30vw"
                  className="transition-transform duration-700 ease-[var(--ease-drape)] group-hover:scale-[1.03]"
                />
              </Link>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-clay">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readingMinutes} min</span>
                {post.characterSlug ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>With {post.characterSlug}</span>
                  </>
                ) : null}
              </div>

              <h3 className="mt-2.5 text-heading">
                <Link href={`/journal/${post.slug}`} className="transition-colors hover:text-iris">
                  {post.title}
                </Link>
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-graphite">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
