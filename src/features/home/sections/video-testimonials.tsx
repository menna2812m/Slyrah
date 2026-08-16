import Link from "next/link";

import { Media } from "@/components/ui/media";
import { SectionHeader } from "@/components/ui/section";
import type { VideoTestimonialsSection as VideoData, WeavePattern } from "@/lib/api/types";
import { formatDuration } from "@/lib/format";

/** Stand-in posters, varied so three of them don’t read as one repeated tile. */
const POSTER_TEXTURE: { weave: WeavePattern; tone: string }[] = [
  { weave: "satin", tone: "#C3AFC0" },
  { weave: "jersey", tone: "#CFC5B8" },
  { weave: "mesh", tone: "#9FAE9C" },
];

/**
 * Customer video, presented as an editorial column rather than a carousel of
 * thumbnails. Where a file exists it plays inline with controls; where Admin
 * has only uploaded the still, the quote carries the piece and no dead play
 * button is offered.
 */
export function VideoTestimonialsSection({ section }: { section: VideoData }) {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="shell">
        <SectionHeader eyebrow={section.eyebrow} title={section.title ?? ""} description={section.description} />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {section.testimonials.map((item, index) => {
            const playable = Boolean(item.video.url);

            return (
              <figure key={item.id} className="flex flex-col" data-reveal data-reveal-delay={index * 80}>
                <div className="relative overflow-hidden rounded-md bg-shell">
                  {playable ? (
                    <video
                      controls
                      preload="none"
                      playsInline
                      poster={item.video.poster.url || undefined}
                      className="aspect-[3/4] w-full object-cover"
                    >
                      <source src={item.video.url} />
                      {item.video.captionsUrl ? (
                        <track kind="captions" src={item.video.captionsUrl} srcLang="en" label="English" default />
                      ) : null}
                    </video>
                  ) : (
                    <Media
                      asset={item.video.poster}
                      weave={POSTER_TEXTURE[index % POSTER_TEXTURE.length]!.weave}
                      tone={POSTER_TEXTURE[index % POSTER_TEXTURE.length]!.tone}
                      alt={item.video.poster.alt}
                      aspect="3 / 4"
                      sizes="(max-width: 640px) 90vw, 30vw"
                    />
                  )}

                  {item.video.durationSeconds ? (
                    <span className="pointer-events-none absolute end-2.5 top-2.5 rounded-xs bg-aubergine-deep/70 px-1.5 py-1 font-mono text-[0.625rem] text-chalk backdrop-blur-sm">
                      {formatDuration(item.video.durationSeconds)}
                    </span>
                  ) : null}
                </div>

                <blockquote className="mt-5">
                  <p className="font-display text-[1.25rem] leading-[1.3] text-ink">“{item.quote}”</p>
                </blockquote>

                <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-[0.875rem]">
                  <span className="text-clay">{item.authorName}</span>
                  {item.productSlug ? (
                    <Link href={`/products/${item.productSlug}`} className="text-ink hover:text-iris">
                      Shop the piece
                    </Link>
                  ) : null}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
