import { Rating } from "@/components/ui/rating";
import { SectionHeader } from "@/components/ui/section";
import { ReviewCard } from "@/features/reviews/review-card";
import type { ReviewsSection as ReviewsData } from "@/lib/api/types";

export function ReviewsSection({ section }: { section: ReviewsData }) {
  return (
    <section className="bg-chalk py-16 sm:py-20 lg:py-24">
      <div className="shell">
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title ?? ""}
          description={section.description}
          cta={section.cta}
        />

        {section.summary.count > 0 ? (
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Rating value={section.summary.average} count={section.summary.count} />
            <span className="text-[0.875rem] text-clay">across everything we make</span>
          </div>
        ) : null}

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal>
          {section.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
