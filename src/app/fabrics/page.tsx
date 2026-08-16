import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { weaveStyle } from "@/components/ui/media";
import { Accordion } from "@/components/ui/accordion";
import { SectionHeader } from "@/components/ui/section";
import { getEducationItems, getMaterials } from "@/lib/api/server-data";
import { faqSchema, metadataFromSeo } from "@/lib/seo";
import { pluralize } from "@/lib/format";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromSeo(
    {
      title: "Fabrics",
      description:
        "Egyptian cotton, ribbed modal, seamless microfibre, cotton-backed lace, airy mesh and washed satin — what each one is made of, what it does, and how to wash it.",
    },
    "/fabrics",
  );
}

export default async function FabricsPage() {
  const [materials, education] = await Promise.all([getMaterials(), getEducationItems()]);

  return (
    <>
      <div className="shell">
        <PageHeader
          trail={[
            { label: "Home", href: "/" },
            { label: "Fabrics", href: "/fabrics" },
          ]}
          title="Six fabrics, and what each one is for"
          lede="Fabric is the decision that changes how a piece actually feels at four in the afternoon. Everything else is shape."
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map((material, index) => (
            <li key={material.id} data-reveal data-reveal-delay={index * 60}>
              <Link
                href={`/fabrics/${material.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-md border border-mist bg-chalk transition-colors hover:border-clay"
              >
                <span
                  aria-hidden="true"
                  className="block h-32 w-full transition-transform duration-700 ease-[var(--ease-drape)] group-hover:scale-105"
                  style={weaveStyle(material.weave, FABRIC_TONE[material.slug] ?? "#DED6D2")}
                />
                <span className="flex flex-1 flex-col p-5">
                  <span className="text-heading">{material.name}</span>
                  <span className="mt-2 text-[0.9375rem] leading-snug text-graphite">{material.tagline}</span>
                  <span className="mt-4 flex items-baseline justify-between gap-3 border-t border-mist pt-3 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-clay">
                    <span>{material.composition}</span>
                    <span data-numeric>{pluralize(material.productCount, "piece")}</span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <section className="mt-20 bg-chalk py-16 lg:py-24">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <SectionHeader
              eyebrow="Before you buy"
              title="The things nobody explains"
              className="lg:flex-col lg:items-start"
            />
          </div>
          <div className="lg:col-span-8">
            <Accordion
              items={education.map((item) => ({
                id: item.id,
                question: item.question,
                answer: <p className="max-w-2xl">{item.answer}</p>,
                meta: <span className="text-eyebrow hidden sm:block">{item.topic}</span>,
              }))}
              defaultOpenId={education[0]?.id}
            />
          </div>
        </div>
      </section>

      <JsonLd data={faqSchema(education.map((item) => ({ id: item.id, question: item.question, answer: item.answer, category: item.topic })))} />
    </>
  );
}

const FABRIC_TONE: Record<string, string> = {
  "egyptian-cotton": "#E2D9CD",
  "ribbed-modal": "#D6CBD3",
  "seamless-microfibre": "#DED6D2",
  "cotton-lace": "#B78397",
  "airy-mesh": "#A8B3A6",
  "washed-satin": "#C0A8B8",
};
