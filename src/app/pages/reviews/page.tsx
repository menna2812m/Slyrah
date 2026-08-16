import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { Rating } from "@/components/ui/rating";
import { ReviewCard } from "@/features/reviews/review-card";
import { getAllReviews } from "@/lib/api/server-data";
import { metadataFromSeo } from "@/lib/seo";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromSeo(
    {
      title: "Reviews",
      description: "Every review across the range, verified against confirmed orders where we can match them.",
    },
    "/pages/reviews",
  );
}

export default async function ReviewsPage() {
  const reviews = await getAllReviews();
  const sorted = [...reviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const average =
    sorted.length > 0 ? sorted.reduce((sum, review) => sum + review.rating, 0) / sorted.length : 0;
  const verified = sorted.filter((review) => review.verifiedPurchase).length;

  return (
    <div className="shell">
      <PageHeader
        trail={[
          { label: "Home", href: "/" },
          { label: "Reviews", href: "/pages/reviews" },
        ]}
        title="What people said"
        lede="Everything, in the order it came in. We publish reviews we can’t match to an order too — they’re labelled as unmatched rather than quietly removed."
        meta={
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <Rating value={Math.round(average * 10) / 10} count={sorted.length} />
            <p className="font-mono text-[0.75rem] text-clay" data-numeric>
              {verified} of {sorted.length} matched to a confirmed order
            </p>
          </div>
        }
      />

      <ul className="grid gap-4 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((review) => (
          <li key={review.id}>
            <ReviewCard review={review} showProduct className="h-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}
