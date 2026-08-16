import Link from "next/link";

import { PortraitMedia } from "@/components/ui/media";
import type { HeroSection as HeroSectionData } from "@/lib/api/types";

/**
 * The thesis.
 *
 * Most underwear sites open on a product or a discount. Slyrah opens on four
 * women and the specific thing each of them can’t find, because the brand’s
 * claim is that starting from a person is faster than starting from a filter.
 * The panels behave like a spread pair of wings — pointing at one opens it.
 */
export function HeroSection({ section }: { section: HeroSectionData }) {
  return (
    <section className="relative pt-10 pb-0 sm:pt-14">
      <div className="shell">
        <div className="max-w-3xl">
          <h1 className="text-hero">{section.headline}</h1>
          <div className="mt-6 max-w-xl space-y-1.5">
            {section.sublines.map((line, i) => (
              <p key={line} className={i === 0 ? "text-lede text-ink" : "text-lede text-graphite"}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: one wide spread. Mobile: a snap rail. */}
      <div className="mt-10 sm:mt-14">
        <div className="wing-row scrollbar-none max-lg:overflow-x-auto max-lg:px-[var(--spacing-gutter)] max-lg:[scroll-snap-type:x_mandatory]">
          {section.characters.map((character, index) => (
            <Link
              key={character.id}
              href={`/characters/${character.slug}`}
              className="wing-panel group relative block overflow-hidden max-lg:rounded-md"
              data-reveal
              data-reveal-delay={index * 90}
            >
              <PortraitMedia
                asset={character.portrait}
                name={character.name}
                accent={character.accent}
                alt={`${character.name} — ${character.title}`}
                aspect={null}
                sizes="(max-width: 1024px) 76vw, 30vw"
                priority={index < 2}
                className="h-[62vh] min-h-[24rem] lg:h-[clamp(30rem,58vh,42rem)]"
              />

              {/* A single scrim so the type stays legible over any photograph. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-aubergine-deep/80 via-aubergine-deep/10 to-transparent"
              />

              <div className="absolute inset-x-0 bottom-0 p-5 lg:p-7">
                <span
                  aria-hidden="true"
                  className="mb-4 block h-[2px] w-9 origin-left scale-x-100 transition-transform duration-500 ease-[var(--ease-drape)] group-hover:scale-x-[2.6] group-focus-visible:scale-x-[2.6]"
                  style={{ background: "linear-gradient(90deg, var(--color-iris), var(--color-peony))" }}
                />
                <p className="text-eyebrow text-chalk/65">{character.name}</p>
                {/* Two lines' worth of height keeps the four eyebrows on one
                    line across the spread, however long her title runs. */}
                <p className="mt-2 max-w-[16ch] font-display text-[clamp(1.35rem,1rem+1.1vw,1.9rem)] leading-[1.08] text-chalk lg:min-h-[2.16em]">
                  {character.title}
                </p>
                <p className="mt-3 max-w-[26ch] text-[0.875rem] leading-snug text-chalk/70 opacity-100 transition-opacity duration-500 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100">
                  {character.shortDescription}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
