import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentBlocks } from "@/components/content/content-blocks";
import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllStaticPageSlugs, getStaticPage } from "@/lib/api/server-data";
import { formatDate } from "@/lib/format";
import { breadcrumbSchema, metadataFromSeo } from "@/lib/seo";

export const revalidate = 3600;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await getAllStaticPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getStaticPage(slug);
  if (!page) return {};
  return metadataFromSeo(page.seo, `/pages/${slug}`);
}

export default async function StaticPageRoute({ params }: { params: Params }) {
  const { slug } = await params;
  const page = await getStaticPage(slug);
  if (!page) notFound();

  const trail = [
    { label: "Home", href: "/" },
    { label: page.title, href: `/pages/${slug}` },
  ];

  const showToc = page.sections.length > 2;

  return (
    <div className="shell">
      <PageHeader trail={trail} title={page.title} lede={page.lede} />

      <div className="grid gap-10 pb-24 lg:grid-cols-12 lg:gap-14">
        {showToc ? (
          <nav aria-label="On this page" className="lg:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
              <p className="text-eyebrow mb-3">On this page</p>
              <ul className="flex flex-col gap-2">
                {page.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="text-[0.9375rem] text-graphite transition-colors hover:text-ink">
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        ) : null}

        <div className={showToc ? "lg:col-span-8 lg:col-start-5" : "lg:col-span-8"}>
          <div className="flex flex-col gap-14">
            {page.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-title mb-6">{section.heading}</h2>
                <ContentBlocks blocks={section.blocks} />
              </section>
            ))}
          </div>

          <p className="mt-14 border-t border-mist pt-5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-clay">
            Last updated {formatDate(page.updatedAt)}
          </p>
        </div>
      </div>

      <JsonLd data={breadcrumbSchema(trail)} />
    </div>
  );
}
