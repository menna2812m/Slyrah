"use client";

import { useMemo, useState } from "react";

import { Accordion } from "@/components/ui/accordion";
import { Media } from "@/components/ui/media";
import { SectionHeader } from "@/components/ui/section";
import type { EducationSection as EducationData, WeavePattern } from "@/lib/api/types";
import { cn, unique } from "@/lib/utils";

const TOPIC_TEXTURE: Record<string, { weave: WeavePattern; tone: string }> = {
  Fabric: { weave: "rib", tone: "#D9CFD6" },
  Fit: { weave: "jersey", tone: "#CFD5C8" },
  Care: { weave: "microfibre", tone: "#D5CCE0" },
};

/**
 * Nine straight answers, grouped by what you’re actually wondering about.
 * Tabs rather than one long list, because "how do I wash this" and "will it
 * ride up" are different moments.
 */
export function EducationSection({ section }: { section: EducationData }) {
  const topics = useMemo(() => unique(section.items.map((item) => item.topic)), [section.items]);
  const [topic, setTopic] = useState(topics[0] ?? "");

  const items = section.items.filter((item) => item.topic === topic);
  const texture = TOPIC_TEXTURE[topic] ?? { weave: "jersey" as WeavePattern, tone: "#D9CFD6" };

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="shell">
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title ?? ""}
          description={section.description}
          cta={section.cta}
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4" data-reveal>
            <div role="tablist" aria-label="Topics" className="flex gap-2 lg:flex-col lg:items-start">
              {topics.map((name) => (
                <button
                  key={name}
                  role="tab"
                  type="button"
                  aria-selected={topic === name}
                  onClick={() => setTopic(name)}
                  className={cn(
                    "relative rounded-sm px-3.5 py-2.5 text-start text-[0.9375rem] transition-colors lg:w-full",
                    topic === name ? "bg-chalk text-ink" : "text-clay hover:text-ink",
                  )}
                >
                  {name}
                  {topic === name ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-2 start-0 w-[2px] rounded-full lg:block"
                      style={{ background: "linear-gradient(180deg, var(--color-iris), var(--color-peony))" }}
                    />
                  ) : null}
                </button>
              ))}
            </div>

            <Media
              asset={items[0]?.image}
              weave={texture.weave}
              tone={texture.tone}
              alt={`${topic} — reference image`}
              aspect="4 / 3"
              sizes="(max-width: 1024px) 100vw, 30vw"
              className="mt-6 hidden rounded-md lg:block"
              label={topic}
            />
          </div>

          <div className="lg:col-span-8">
            <Accordion
              key={topic}
              items={items.map((item) => ({
                id: item.id,
                question: item.question,
                answer: (
                  <div className="max-w-2xl">
                    <p>{item.answer}</p>
                    {item.video ? (
                      <p className="mt-3 text-[0.8125rem] text-clay">Video: {item.video.title}</p>
                    ) : null}
                  </div>
                ),
              }))}
              defaultOpenId={items[0]?.id}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
