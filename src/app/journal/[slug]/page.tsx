import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentBlocks } from "@/components/content/content-blocks";
import { Breadcrumbs } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { PortraitMedia } from "@/components/ui/media";
import { ProductRail } from "@/features/catalog/product-rail";
import {
  getAllBlogSlugs,
  getBlogPost,
  getCharacter,
  getProductSummaries,
} from "@/lib/api/server-data";
import { formatDate } from "@/lib/format";
import { articleSchema, breadcrumbSchema, metadataFromSeo } from "@/lib/seo";

export const revalidate = 600;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return metadataFromSeo(post.seo, `/journal/${slug}`, {
    openGraph: {
      type: "article",
      title: post.seo.title,
      description: post.seo.description,
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
  });
}

export default async function JournalPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const [character, related, inlineProducts] = await Promise.all([
    post.characterSlug ? getCharacter(post.characterSlug) : Promise.resolve(null),
    getProductSummaries(post.relatedProductSlugs),
    getProductSummaries(
      post.body.filter((block) => block.type === "product").map((block) => block.productSlug),
    ),
  ]);

  const trail = [
    { label: "Home", href: "/" },
    { label: "Journal", href: "/journal" },
    { label: post.title, href: `/journal/${slug}` },
  ];

  return (
    <>
      <article className="shell pt-6">
        <Breadcrumbs trail={trail} className="mb-8" />

        <header className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-clay">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingMinutes} min read</span>
            {post.tags.map((tag) => (
              <span key={tag}>
                <span aria-hidden="true" className="me-3">
                  ·
                </span>
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mt-5 text-display">{post.title}</h1>
          <p className="mt-5 text-lede text-graphite">{post.excerpt}</p>

          {character ? (
            <Link
              href={`/characters/${character.slug}`}
              className="group mt-8 flex items-center gap-4 border-y border-mist py-4"
            >
              <PortraitMedia
                asset={character.portrait}
                name={character.name}
                accent={character.accent}
                alt=""
                aspect="1 / 1"
                sizes="48px"
                className="w-12 shrink-0 rounded-full"
              />
              <span>
                <span className="block text-[0.9375rem] text-ink transition-colors group-hover:text-iris">
                  Filed under {character.name}
                </span>
                <span className="block text-[0.8125rem] text-clay">{character.title}</span>
              </span>
            </Link>
          ) : null}
        </header>

        <div className="mx-auto mt-10 max-w-3xl">
          <ContentBlocks blocks={post.body} products={new Map(inlineProducts.map((p) => [p.slug, p]))} />
        </div>

        {post.tips.length > 0 ? (
          <aside className="mx-auto mt-14 max-w-3xl rounded-lg bg-chalk p-6 sm:p-8">
            <h2 className="text-eyebrow mb-5">Two things to remember</h2>
            <dl className="grid gap-6 sm:grid-cols-2">
              {post.tips.map((tip) => (
                <div key={tip.title}>
                  <dt className="text-heading">{tip.title}</dt>
                  <dd className="mt-2 text-[0.9375rem] leading-relaxed text-graphite">{tip.body}</dd>
                </div>
              ))}
            </dl>
          </aside>
        ) : null}
      </article>

      {related.length > 0 ? (
        <section className="shell py-16 lg:py-20">
          <h2 className="text-title mb-8">What this piece is about</h2>
          <ProductRail products={related} />
        </section>
      ) : null}

      <JsonLd data={[articleSchema(post), breadcrumbSchema(trail)]} />
    </>
  );
}
