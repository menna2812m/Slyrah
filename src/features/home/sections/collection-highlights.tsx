import Link from "next/link";

import { Media } from "@/components/ui/media";
import { SectionHeader } from "@/components/ui/section";
import type { CollectionHighlightsSection as CollectionsData, WeavePattern } from "@/lib/api/types";
import { pluralize } from "@/lib/format";

const COLLECTION_TEXTURE: Record<string, { weave: WeavePattern; tone: string }> = {
  "first-light": { weave: "microfibre", tone: "#DCD3D8" },
  "everyday-essentials": { weave: "jersey", tone: "#D8D2C9" },
  "forty-degrees": { weave: "mesh", tone: "#A9B3A3" },
  "lace-archive": { weave: "lace", tone: "#8E6478" },
};

export function CollectionHighlightsSection({ section }: { section: CollectionsData }) {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="shell">
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title ?? ""}
          description={section.description}
          cta={section.cta}
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {section.collections.map((collection, index) => {
            const texture = COLLECTION_TEXTURE[collection.slug] ?? { weave: "jersey" as WeavePattern, tone: "#D8D2C9" };
            return (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-md"
                data-reveal
                data-reveal-delay={index * 70}
              >
                <Media
                  asset={collection.heroImage}
                  weave={texture.weave}
                  tone={texture.tone}
                  alt={collection.title}
                  aspect="3 / 4"
                  sizes="(max-width: 640px) 90vw, 24vw"
                  className="transition-transform duration-700 ease-[var(--ease-drape)] group-hover:scale-[1.03]"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-aubergine-deep/75 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  {collection.isDrop ? <p className="text-eyebrow mb-2 text-peony">Drop</p> : null}
                  <h3 className="font-display text-[1.35rem] leading-tight text-chalk">{collection.title}</h3>
                  <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-snug text-chalk/65">
                    {collection.shortDescription}
                  </p>
                  <p className="mt-3 font-mono text-[0.6875rem] text-chalk/50" data-numeric>
                    {pluralize(collection.productCount, "piece")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
