import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Media } from "@/components/ui/media";
import { getCollections } from "@/lib/api/server-data";
import { formatDate, pluralize } from "@/lib/format";
import { metadataFromSeo } from "@/lib/seo";
import type { WeavePattern } from "@/lib/api/types";

export const revalidate = 600;

const TEXTURE: Record<string, { weave: WeavePattern; tone: string }> = {
  "first-light": { weave: "microfibre", tone: "#DCD3D8" },
  "everyday-essentials": { weave: "jersey", tone: "#D8D2C9" },
  "forty-degrees": { weave: "mesh", tone: "#A9B3A3" },
  "lace-archive": { weave: "lace", tone: "#8E6478" },
};

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromSeo(
    {
      title: "Collections",
      description:
        "Four ways in: the August drop, the permanent essentials, mesh built for Egyptian summer, and the cotton-backed lace archive.",
    },
    "/collections",
  );
}

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="shell">
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Collections", href: "/collections" },
        ]}
        title="Four ways in"
        lede="Two of these are permanent and two are made once. The drop pages say which is which."
      />

      <ul className="grid gap-4 pb-20 sm:grid-cols-2">
        {collections.map((collection, index) => {
          const texture = TEXTURE[collection.slug] ?? { weave: "jersey" as WeavePattern, tone: "#D8D2C9" };
          return (
            <li key={collection.id} data-reveal data-reveal-delay={index * 70}>
              <Link href={`/collections/${collection.slug}`} className="group relative block overflow-hidden rounded-md">
                <Media
                  asset={collection.heroImage}
                  weave={texture.weave}
                  tone={texture.tone}
                  alt={collection.title}
                  aspect="4 / 3"
                  sizes="(max-width: 640px) 92vw, 45vw"
                  className="transition-transform duration-700 ease-[var(--ease-drape)] group-hover:scale-[1.03]"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-aubergine-deep/78 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <div className="mb-2.5 flex items-center gap-3">
                    {collection.isDrop ? <span className="text-eyebrow text-peony">Drop</span> : <span className="text-eyebrow text-chalk/50">Permanent</span>}
                    {collection.releasedAt ? (
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-chalk/40">
                        {formatDate(collection.releasedAt)}
                      </span>
                    ) : null}
                  </div>
                  <h2 className="font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.1rem)] leading-tight text-chalk">
                    {collection.title}
                  </h2>
                  <p className="mt-2 max-w-md text-[0.9375rem] leading-snug text-chalk/70">
                    {collection.shortDescription}
                  </p>
                  <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-chalk/45" data-numeric>
                    {pluralize(collection.productCount, "piece")}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
