import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Accordion } from "@/components/ui/accordion";
import { getFaqs, getStoreSettings } from "@/lib/api/server-data";
import { breadcrumbSchema, faqSchema, metadataFromSeo } from "@/lib/seo";
import { unique } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromSeo(
    {
      title: "Questions",
      description:
        "Delivery times and fees across Egypt, cash on delivery, returns and exchanges, sizing, and what happens if the courier can’t find you.",
    },
    "/pages/faqs",
  );
}

export default async function FaqsPage() {
  const [faqs, settings] = await Promise.all([getFaqs(), getStoreSettings()]);
  const categories = unique(faqs.map((faq) => faq.category));

  const trail = [
    { label: "Home", href: "/" },
    { label: "Questions", href: "/pages/faqs" },
  ];

  return (
    <div className="shell">
      <PageHeader trail={trail} title="Questions" lede="If the answer isn’t here, WhatsApp is the fastest way to get one." />

      <div className="grid gap-10 pb-24 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)]">
            <p className="text-eyebrow mb-3">Categories</p>
            <ul className="flex flex-wrap gap-2 lg:flex-col">
              {categories.map((category) => (
                <li key={category}>
                  <a
                    href={`#${category.toLowerCase()}`}
                    className="text-[0.9375rem] text-graphite transition-colors hover:text-ink"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-md border border-mist bg-chalk p-5">
              <p className="text-[0.9375rem] text-ink">Still stuck?</p>
              <p className="mt-1.5 text-[0.875rem] text-clay">{settings.contact.hours}</p>
              <a
                href={`https://wa.me/${settings.contact.whatsapp.replace(/\D/g, "")}`}
                className="mt-3 inline-block border-b border-ink/30 pb-px text-[0.9375rem] text-ink hover:border-ink"
              >
                Message us on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 lg:col-start-5">
          <div className="flex flex-col gap-12">
            {categories.map((category) => (
              <section key={category} id={category.toLowerCase()} className="scroll-mt-24">
                <h2 className="text-heading mb-4">{category}</h2>
                <Accordion
                  allowMultiple
                  items={faqs
                    .filter((faq) => faq.category === category)
                    .map((faq) => ({
                      id: faq.id,
                      question: faq.question,
                      answer: <p className="max-w-2xl">{faq.answer}</p>,
                    }))}
                />
              </section>
            ))}
          </div>

          <p className="mt-12 text-[0.9375rem] text-graphite">
            Looking for the detail rather than the summary? The{" "}
            <Link href="/pages/shipping-policy" className="text-ink underline underline-offset-4">
              shipping
            </Link>{" "}
            and{" "}
            <Link href="/pages/returns-policy" className="text-ink underline underline-offset-4">
              returns
            </Link>{" "}
            policies say exactly what we will and won’t do.
          </p>
        </div>
      </div>

      <JsonLd data={[faqSchema(faqs), breadcrumbSchema(trail)]} />
    </div>
  );
}
