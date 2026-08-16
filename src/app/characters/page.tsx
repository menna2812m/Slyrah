import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { PortraitMedia } from "@/components/ui/media";
import { getCharacters } from "@/lib/api/server-data";
import { metadataFromSeo } from "@/lib/seo";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromSeo(
    {
      title: "Who you are",
      description:
        "Four women, four different problems with underwear. Pick the one whose day looks like yours and the fabric and cut follow from there.",
    },
    "/characters",
  );
}

export default async function CharactersPage() {
  const characters = await getCharacters();

  return (
    <div className="shell">
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Who you are", href: "/characters" },
        ]}
        title="Four women, four different problems"
        lede="Shopping by category assumes you already know you want a ribbed modal high-waist brief. Almost nobody does. Start with a person instead."
      />

      <ul className="grid gap-4 pb-20 sm:grid-cols-2">
        {characters.map((character, index) => (
          <li key={character.id} data-reveal data-reveal-delay={index * 80}>
            <Link href={`/characters/${character.slug}`} className="group relative block overflow-hidden rounded-md">
              <PortraitMedia
                asset={character.portrait}
                name={character.name}
                accent={character.accent}
                alt={`${character.name} — ${character.title}`}
                aspect="4 / 5"
                sizes="(max-width: 640px) 92vw, 45vw"
                priority={index < 2}
                className="transition-transform duration-700 ease-[var(--ease-drape)] group-hover:scale-[1.03]"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-aubergine-deep/80 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <span
                  aria-hidden="true"
                  className="mb-4 block h-[2px] w-9 origin-left transition-transform duration-500 ease-[var(--ease-drape)] group-hover:scale-x-[2.6]"
                  style={{ background: "linear-gradient(90deg, var(--color-iris), var(--color-peony))" }}
                />
                <p className="text-eyebrow text-chalk/60">{character.name}</p>
                <h2 className="mt-2 max-w-[18ch] font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.2rem)] leading-[1.06] text-chalk">
                  {character.title}
                </h2>
                <p className="mt-3 max-w-sm text-[0.9375rem] leading-snug text-chalk/70">
                  {character.shortDescription}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
