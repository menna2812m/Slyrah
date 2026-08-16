import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { ProductDiscovery } from "@/features/catalog/discovery";
import { queryFromSearchParams } from "@/lib/api/query";
import { getProducts } from "@/lib/api/server-data";
import { breadcrumbSchema, metadataFromSeo } from "@/lib/seo";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const query = queryFromSearchParams(await searchParams);
  const filtered = Boolean(query.materials?.length || query.cuts?.length || query.search);

  return metadataFromSeo(
    {
      title: "Shop everything",
      description:
        "Six fabrics, eight cuts. Filter by fabric first — it’s the decision that changes how a piece actually feels — then narrow by cut, closure, size and colour.",
      // Filtered views stay out of the index to avoid thin near-duplicate pages;
      // the unfiltered page is the canonical one.
      canonicalPath: "/shop",
      noIndex: filtered,
    },
    "/shop",
  );
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const query = queryFromSearchParams(await searchParams);
  const response = await getProducts({ ...query, perPage: query.perPage ?? 24 });

  return (
    <div className="shell">
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
        ]}
        title="Everything we make"
        lede="Six fabrics, eight cuts, kept in stock. Start with the fabric — it’s the decision that changes how a piece feels on a long day."
      />

      <ProductDiscovery response={response} query={query} />

      <div className="h-20" />

      <JsonLd
        data={breadcrumbSchema([
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
        ])}
      />
    </div>
  );
}
