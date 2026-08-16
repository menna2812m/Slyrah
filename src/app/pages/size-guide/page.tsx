import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { SizeGuideTables } from "@/features/product/size-guide-modal";
import { getSizeGuides } from "@/lib/api/server-data";
import { breadcrumbSchema, metadataFromSeo } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromSeo(
    {
      title: "Size guide",
      description:
        "Measurements for briefs, boyshorts, bodysuits, bras and bralettes, plus a straight answer about which way to go when you’re between two sizes.",
    },
    "/pages/size-guide",
  );
}

export default async function SizeGuidePage() {
  const guides = await getSizeGuides();

  const trail = [
    { label: "Home", href: "/" },
    { label: "Size guide", href: "/pages/size-guide" },
  ];

  return (
    <div className="shell">
      <PageHeader
        trail={trail}
        title="Size guide"
        lede="Measure over bare skin, standing, tape flat but not pulled. If you land between two rows, the note under each table says which way to go."
      />

      <div className="grid gap-14 pb-24 lg:grid-cols-2 lg:gap-16">
        {guides.map((guide) => (
          <section key={guide.slug}>
            <h2 className="text-title">{guide.title}</h2>
            <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-graphite">{guide.intro}</p>
            <div className="mt-8">
              <SizeGuideTables guide={guide} />
            </div>
          </section>
        ))}
      </div>

      <JsonLd data={breadcrumbSchema(trail)} />
    </div>
  );
}
