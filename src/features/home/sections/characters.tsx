import Link from "next/link";

import { PortraitMedia } from "@/components/ui/media";
import { SectionHeader } from "@/components/ui/section";
import type { CharactersSection as CharactersData } from "@/lib/api/types";

/**
 * The standalone characters block, used when Admin places the four of them
 * somewhere other than the hero.
 */
export function CharactersSection({ section }: { section: CharactersData }) {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="shell">
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title ?? ""}
          description={section.description}
          cta={section.cta}
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {section.characters.map((character, index) => (
            <li key={character.id} data-reveal data-reveal-delay={index * 70}>
              <Link href={`/characters/${character.slug}`} className="group block overflow-hidden rounded-md">
                <div className="relative">
                  <PortraitMedia
                    asset={character.portrait}
                    name={character.name}
                    accent={character.accent}
                    alt={`${character.name} — ${character.title}`}
                    aspect="3 / 4"
                    sizes="(max-width: 640px) 90vw, 24vw"
                    className="transition-transform duration-700 ease-[var(--ease-drape)] group-hover:scale-[1.03]"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-aubergine-deep/75 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-eyebrow text-chalk/60">{character.name}</p>
                    <p className="mt-1.5 font-display text-[1.2rem] leading-tight text-chalk">{character.title}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
