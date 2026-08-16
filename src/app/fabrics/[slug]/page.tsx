import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { buttonClasses } from "@/components/ui/button";
import { weaveStyle } from "@/components/ui/media";
import { ProductGrid } from "@/features/catalog/product-card";
import { getMaterial, getMaterials, getProducts } from "@/lib/api/server-data";
import { pluralize } from "@/lib/format";
import { breadcrumbSchema, metadataFromSeo } from "@/lib/seo";

export const revalidate = 600;

type Params = Promise<{ slug: string }>;

const FABRIC_TONE: Record<string, string> = {
  "egyptian-cotton": "#E2D9CD",
  "ribbed-modal": "#D6CBD3",
  "seamless-microfibre": "#DED6D2",
  "cotton-lace": "#B78397",
  "airy-mesh": "#A8B3A6",
  "washed-satin": "#C0A8B8",
};

export async function generateStaticParams() {
  const materials = await getMaterials();
  return materials.map((material) => ({ slug: material.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const material = await getMaterial(slug);
  if (!material) return {};

  return metadataFromSeo(
    {
      title: `${material.name} — ${material.tagline}`,
      description: `${material.description.slice(0, 150)}`,
    },
    `/fabrics/${slug}`,
  );
}

export default async function FabricPage({ params }: { params: Params }) {
  const { slug } = await params;
  const material = await getMaterial(slug);
  if (!material) notFound();

  const products = await getProducts({ materials: [slug], perPage: 12 });
  const tone = FABRIC_TONE[slug] ?? "#DED6D2";

  const trail = [
    { label: "Home", href: "/" },
    { label: "Fabrics", href: "/fabrics" },
    { label: material.name, href: `/fabrics/${slug}` },
  ];

  return (
    <>
      <div className="shell">
        <PageHeader trail={trail} eyebrow="Fabric" title={material.name} lede={material.tagline} />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <div
              aria-hidden="true"
              className="h-64 w-full rounded-lg lg:h-80"
              style={weaveStyle(material.weave, tone)}
            />
            <p className="mt-3 text-[0.8125rem] text-clay">
              Weave rendering. Macro photography of the real cloth replaces this once it’s shot.
            </p>
          </div>

          <div className="lg:col-span-7">
            <p className="text-lede text-graphite">{material.description}</p>

            <dl className="mt-8">
              <dt className="text-eyebrow mb-4">How it behaves</dt>
              <dd>
                <ul className="flex flex-col gap-3.5">
                  {material.properties.map((property) => (
                    <li key={property.label} className="flex items-center gap-4">
                      <span className="w-32 shrink-0 text-[0.875rem] text-graphite">{property.label}</span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-mist">
                        <span
                          className="block h-full rounded-full"
                          style={{
                            width: `${property.value}%`,
                            background: "linear-gradient(90deg, var(--color-iris), var(--color-peony))",
                          }}
                        />
                      </span>
                      <span className="w-9 text-end font-mono text-[0.75rem] text-clay" data-numeric>
                        {property.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>

            <dl className="mt-9 grid gap-7 sm:grid-cols-2">
              <div>
                <dt className="text-eyebrow mb-2.5">Composition</dt>
                <dd className="font-mono text-[0.9375rem] text-ink">{material.composition}</dd>
              </div>
              <div>
                <dt className="text-eyebrow mb-2.5">How to wash it</dt>
                <dd>
                  <ul className="flex flex-col gap-1.5 text-[0.9375rem] text-graphite">
                    {material.careInstructions.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>

            <Link href={`/shop?materials=${slug}`} className={buttonClasses("primary", "lg", "mt-9")}>
              Shop {pluralize(material.productCount, "piece")} in {material.name}
            </Link>
          </div>
        </div>

        <section className="mt-20 pb-20">
          <h2 className="text-title mb-8">Everything in {material.name}</h2>
          <ProductGrid products={products.items} />
        </section>
      </div>

      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
