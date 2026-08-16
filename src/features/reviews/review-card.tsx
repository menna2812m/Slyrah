import { Rating } from "@/components/ui/rating";
import type { Review } from "@/lib/api/types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * "Verified purchase" is shown only where the backend has matched the reviewer
 * to a confirmed order. Everything else is labelled plainly rather than left
 * ambiguous — an unmarked review reads as verified to most people.
 */
export function VerifiedMark({ verified }: { verified: boolean }) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[0.75rem] text-success">
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
          <circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M5 8.3l2.1 2.1L11 6.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Verified purchase
      </span>
    );
  }
  return <span className="text-[0.75rem] text-clay">Not matched to an order</span>;
}

export function ReviewCard({
  review,
  showProduct = false,
  className,
}: {
  review: Review;
  showProduct?: boolean;
  className?: string;
}) {
  return (
    <article className={cn("flex flex-col gap-3 rounded-md border border-mist bg-chalk p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <Rating value={review.rating} showCount={false} />
        <time dateTime={review.createdAt} className="shrink-0 font-mono text-[0.6875rem] text-clay" data-numeric>
          {formatDate(review.createdAt)}
        </time>
      </div>

      {review.title ? <h3 className="text-[1.0625rem] leading-snug">{review.title}</h3> : null}

      <p className="text-[0.9375rem] leading-relaxed text-graphite">{review.body}</p>

      <footer className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-mist pt-3">
        <span className="text-[0.875rem] text-ink">{review.authorName}</span>
        <VerifiedMark verified={review.verifiedPurchase} />
        {review.purchasedSize ? (
          <span className="font-mono text-[0.6875rem] text-clay" data-numeric>
            {review.purchasedColor} · {review.purchasedSize}
          </span>
        ) : null}
        {showProduct ? (
          <span className="w-full text-[0.75rem] text-clay">on {review.productSlug.replace(/-/g, " ")}</span>
        ) : null}
      </footer>
    </article>
  );
}
