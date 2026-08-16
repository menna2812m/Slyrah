import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { buttonClasses } from "@/components/ui/button";
import { Media, PortraitMedia } from "@/components/ui/media";
import { SectionHeader } from "@/components/ui/section";
import { ProductGrid } from "@/features/catalog/product-card";
import { formatDuration } from "@/lib/format";
import {
  getAllCharacterSlugs,
  getCharacter,
  getProducts,
  getProductSummaries,
} from "@/lib/api/server-data";
import { breadcrumbSchema, metadataFromSeo } from "@/lib/seo";
import { serializeProductQuery } from "@/lib/api/query";

export const revalidate = 600;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await getAllCharacterSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const character = await getCharacter(slug);
  if (!character) return {};
  return metadataFromSeo(character.seo, `/characters/${slug}`);
}

export default async function CharacterPage({ params }: { params: Params }) {
  const { slug } = await params;
  const character = await getCharacter(slug);
  if (!character) notFound();

  const recommended = await getProducts({ character: slug, perPage: 8 });

  // The products she names as answers, in the order she names them.
  const answerSlugs = Array.from(new Set(character.needs.flatMap((need) => need.productSlugs)));
  const answerProducts = await getProductSummaries(answerSlugs);
  const answerBySlug = new Map(answerProducts.map((p) => [p.slug, p]));

  const trail = [
    { label: "Home", href: "/" },
    { label: "Who you are", href: "/characters" },
    { label: character.name, href: `/characters/${slug}` },
  ];

  const discoveryHref = `/shop?${serializeProductQuery({
    materials: character.discovery.materialSlugs,
    cuts: character.discovery.cutSlugs,
  })}`;

  return (
    <>
      {/* Hero — editorial, not a category banner */}
      <section className="grain relative bg-aubergine text-chalk/75">
        <div className="shell pt-8 pb-14 lg:pb-20">
          <Breadcrumbs
            trail={trail}
            className="mb-10 [&_a]:text-chalk/45 [&_a:hover]:text-chalk [&_span]:text-chalk/70"
          />

          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
            <div className="lg:col-span-5">
              <PortraitMedia
                asset={character.portrait}
                name={character.name}
                accent={character.accent}
                alt={`${character.name} — ${character.title}`}
                aspect="3 / 4"
                sizes="(max-width: 1024px) 92vw, 40vw"
                priority
                className="rounded-md"
              />
            </div>

            <div className="lg:col-span-7">
              <span
                aria-hidden="true"
                className="mb-6 block h-[2px] w-16"
                style={{ background: `linear-gradient(90deg, ${character.accent.from}, ${character.accent.to})` }}
              />
              <p className="text-eyebrow text-chalk/50">{character.name}</p>
              <h1 className="mt-4 text-hero text-chalk">{character.title}</h1>
              <p className="mt-6 max-w-xl text-lede text-chalk/70">{character.shortDescription}</p>

              <Link href={discoveryHref} className={buttonClasses("inverse", "lg", "mt-9")}>
                Shop what she wears
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="shell py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <h2 className="text-eyebrow">Her story</h2>
          </div>
          <div className="lg:col-span-8">
            <div className="max-w-2xl space-y-5">
              {character.story.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={index === 0 ? "font-display text-[clamp(1.25rem,1.05rem+0.9vw,1.7rem)] leading-[1.35] text-ink" : "text-lede text-graphite"}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle */}
      <section className="bg-chalk py-16 lg:py-24">
        <div className="shell">
          <SectionHeader eyebrow="Her day" title="What it actually looks like" />
          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            {character.lifestyle.map((item, index) => (
              <li key={item.label} data-reveal data-reveal-delay={index * 70}>
                <Media
                  asset={item.image}
                  weave="jersey"
                  tone={index % 2 === 0 ? character.accent.from : character.accent.to}
                  alt={item.label}
                  aspect="4 / 3"
                  sizes="(max-width: 640px) 92vw, 30vw"
                  className="rounded-md"
                />
                <h3 className="mt-4 text-heading">{item.label}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-graphite">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Problems and answers — the heart of the page */}
      <section className="shell py-16 lg:py-24">
        <SectionHeader
          eyebrow="What she came here to solve"
          title="Three problems, three answers"
          description="Each one names the piece that fixes it. If none of these is your problem, one of the other three probably has it."
        />

        <ol className="mt-12 flex flex-col gap-12 lg:gap-16">
          {character.needs.map((need, index) => (
            <li key={need.problem} className="grid gap-6 lg:grid-cols-12 lg:gap-10" data-reveal>
              <div className="lg:col-span-5">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-clay">
                  Problem {index + 1}
                </p>
                <h3 className="mt-3 font-display text-[clamp(1.35rem,1.1rem+1.1vw,1.95rem)] leading-[1.15] text-ink">
                  “{need.problem}”
                </h3>
              </div>

              <div className="lg:col-span-7">
                <p className="max-w-xl text-lede text-graphite">{need.answer}</p>

                <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
                  {need.productSlugs.map((productSlug) => {
                    const product = answerBySlug.get(productSlug);
                    if (!product) return null;
                    return (
                      <li key={productSlug}>
                        <Link href={`/products/${productSlug}`} className="group block">
                          <Media
                            asset={product.primaryImage}
                            weave={product.materialWeave}
                            tone={product.colors[0]?.hex}
                            alt={product.name}
                            aspect="4 / 5"
                            sizes="(max-width: 640px) 45vw, 18vw"
                            className="rounded-sm transition-transform duration-500 ease-[var(--ease-drape)] group-hover:scale-[1.03]"
                          />
                          <p className="mt-2.5 text-[0.875rem] text-ink transition-colors group-hover:text-iris">
                            {product.name}
                          </p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Video */}
      {character.video ? (
        <section className="shell pb-16 lg:pb-24">
          <div className="overflow-hidden rounded-lg bg-aubergine">
            {character.video.url ? (
              <video controls preload="none" playsInline poster={character.video.poster.url || undefined} className="aspect-video w-full">
                <source src={character.video.url} />
              </video>
            ) : (
              <Media
                asset={character.video.poster}
                weave="satin"
                tone={character.accent.to}
                alt={character.video.poster.alt}
                aspect="16 / 9"
                sizes="100vw"
                label={`${character.video.title}${character.video.durationSeconds ? ` · ${formatDuration(character.video.durationSeconds)}` : ""}`}
              />
            )}
          </div>
        </section>
      ) : null}

      {/* Tips */}
      <section className="bg-chalk py-16 lg:py-24">
        <div className="shell">
          <SectionHeader eyebrow="Tips & tricks" title={`What ${character.name} would tell you`} />
          <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-3">
            {character.tips.map((tip) => (
              <li key={tip.title} className="border-t border-mist pt-5">
                <h3 className="text-heading">{tip.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-graphite">{tip.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recommended */}
      <section className="shell py-16 lg:py-24">
        <SectionHeader
          eyebrow="Her drawer"
          title={`Everything ${character.name} wears`}
          description="Filtered to the fabrics and cuts that solve her problems. Adjust it from here if yours are different."
          cta={{ label: "Open in full shop", href: discoveryHref }}
        />
        <ProductGrid products={recommended.items} className="mt-10" />
      </section>

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
