import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Media } from "@/components/ui/media";
import { ProductDiscovery } from "@/features/catalog/discovery";
import { queryFromSearchParams } from "@/lib/api/query";
import { getAllCollectionSlugs, getCollection, getProducts } from "@/lib/api/server-data";
import { formatDate, pluralize } from "@/lib/format";
import { breadcrumbSchema, collectionSchema, metadataFromSeo } from "@/lib/seo";
import type { WeavePattern } from "@/lib/api/types";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const TEXTURE: Record<string, { weave: WeavePattern; tone: string }> = {
  "first-light": { weave: "microfibre", tone: "#DCD3D8" },
  "everyday-essentials": { weave: "jersey", tone: "#D8D2C9" },
  "forty-degrees": { weave: "mesh", tone: "#A9B3A3" },
  "lace-archive": { weave: "lace", tone: "#8E6478" },
};

export async function generateStaticParams() {
  const slugs = await getAllCollectionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) return {};
  return metadataFromSeo(collection.seo, `/collections/${slug}`);
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) notFound();

  const query = { ...queryFromSearchParams(await searchParams), collection: slug };
  const response = await getProducts(query);
  const texture = TEXTURE[slug] ?? { weave: "jersey" as WeavePattern, tone: "#D8D2C9" };

  const trail = [
    { label: "Home", href: "/" },
    { label: "Collections", href: "/collections" },
    { label: collection.title, href: `/collections/${slug}` },
  ];

  return (
    <>
      <div className="shell">
        <PageHeader
          trail={trail}
          eyebrow={collection.isDrop ? "Drop" : "Permanent collection"}
          title={collection.title}
          lede={collection.description}
          meta={
            <dl className="flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <dt className="text-eyebrow">In this collection</dt>
                <dd className="mt-1.5 font-mono text-lg text-ink" data-numeric>
                  {pluralize(collection.productCount, "piece")}
                </dd>
              </div>
              {collection.releasedAt ? (
                <div>
                  <dt className="text-eyebrow">Released</dt>
                  <dd className="mt-1.5 font-mono text-lg text-ink" data-numeric>
                    {formatDate(collection.releasedAt)}
                  </dd>
                </div>
              ) : null}
            </dl>
          }
        />
      </div>

      <div className="shell">
        <Media
          asset={collection.heroImage}
          weave={texture.weave}
          tone={texture.tone}
          alt={`${collection.title} campaign image`}
          aspect="21 / 9"
          sizes="100vw"
          priority
          className="mb-14 rounded-lg"
          label={collection.title}
        />

        <ProductDiscovery response={response} query={query} locked={["collection"]} />

        <div className="h-20" />
      </div>

      <JsonLd
        data={[
          collectionSchema(collection, response.items.map((item) => item.slug)),
          breadcrumbSchema(trail),
        ]}
      />
    </>
  );
}
