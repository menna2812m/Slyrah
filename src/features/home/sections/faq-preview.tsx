import { Accordion } from "@/components/ui/accordion";
import { SectionHeader } from "@/components/ui/section";
import type { FaqPreviewSection as FaqData } from "@/lib/api/types";

export function FaqPreviewSection({ section }: { section: FaqData }) {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <SectionHeader
            eyebrow={section.eyebrow}
            title={section.title ?? ""}
            description={section.description}
            cta={section.cta}
            className="lg:flex-col lg:items-start"
          />
        </div>
        <div className="lg:col-span-8" data-reveal>
          <Accordion
            items={section.faqs.map((faq) => ({
              id: faq.id,
              question: faq.question,
              answer: <p className="max-w-2xl">{faq.answer}</p>,
              meta: <span className="text-eyebrow hidden sm:block">{faq.category}</span>,
            }))}
          />
        </div>
      </div>
    </section>
  );
}
