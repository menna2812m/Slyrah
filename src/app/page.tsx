import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { HomeSectionRenderer } from "@/features/home/section-renderer";
import { getHomePage } from "@/lib/api/server-data";
import { faqSchema, metadataFromSeo } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomePage();
  return metadataFromSeo(home.seo, "/");
}

export default async function HomePage() {
  const home = await getHomePage();
  const faqSection = home.sections.find((section) => section.type === "faq-preview");

  return (
    <>
      {home.sections.map((section) => (
        <HomeSectionRenderer key={section.id} section={section} />
      ))}

      {faqSection && faqSection.type === "faq-preview" ? <JsonLd data={faqSchema(faqSection.faqs)} /> : null}
    </>
  );
}
