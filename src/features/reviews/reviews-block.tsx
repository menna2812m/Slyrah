"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TextAreaField, TextField } from "@/components/ui/field";
import { Modal } from "@/components/ui/overlay";
import { Rating } from "@/components/ui/rating";
import { toast } from "@/components/ui/toast";
import { ReviewCard } from "@/features/reviews/review-card";
import { ApiError, catalogApi, engagementApi } from "@/lib/api/client";
import type { RatingSummary, Review } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export function ReviewsBlock({
  productSlug,
  productName,
  initial,
  summary,
  total,
  perPage,
}: {
  productSlug: string;
  productName: string;
  initial: Review[];
  summary: RatingSummary;
  total: number;
  perPage: number;
}) {
  const [reviews, setReviews] = useState(initial);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [writing, setWriting] = useState(false);
  const [filter, setFilter] = useState<"all" | "verified">("all");

  const shown = filter === "verified" ? reviews.filter((r) => r.verifiedPurchase) : reviews;

  async function loadMore() {
    setLoading(true);
    try {
      const next = await catalogApi.reviews(productSlug, page + 1, perPage);
      setReviews((current) => [...current, ...next.items]);
      setPage((current) => current + 1);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "We couldn’t load more reviews.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="reviews" className="scroll-mt-24">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4">
          <h2 className="text-title">Reviews</h2>

          {summary.count > 0 ? (
            <>
              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-display text-[2.5rem] leading-none text-ink" data-numeric>
                  {summary.average.toFixed(1)}
                </span>
                <div>
                  <Rating value={summary.average} showCount={false} />
                  <p className="mt-1 font-mono text-[0.6875rem] text-clay" data-numeric>
                    {summary.count} reviews
                  </p>
                </div>
              </div>

              <ul className="mt-6 flex flex-col gap-1.5">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = summary.distribution[stars - 1] ?? 0;
                  const percent = summary.count ? (count / summary.count) * 100 : 0;
                  return (
                    <li key={stars} className="flex items-center gap-3">
                      <span className="w-3 font-mono text-[0.75rem] text-clay" data-numeric>
                        {stars}
                      </span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-mist">
                        <span
                          className="block h-full rounded-full bg-peony"
                          style={{ width: `${percent}%` }}
                        />
                      </span>
                      <span className="w-8 text-end font-mono text-[0.6875rem] text-clay" data-numeric>
                        {count}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}

          <div className="mt-7 flex flex-col gap-3">
            <Button variant="secondary" onClick={() => setWriting(true)}>
              Write a review
            </Button>
            <div className="flex gap-2">
              {(["all", "verified"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={filter === value}
                  onClick={() => setFilter(value)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[0.8125rem] transition-colors",
                    filter === value ? "border-ink bg-ink text-chalk" : "border-mist text-graphite hover:border-ink/50",
                  )}
                >
                  {value === "all" ? "All reviews" : "Verified only"}
                </button>
              ))}
            </div>
            <p className="text-[0.8125rem] leading-relaxed text-clay">
              We mark a review verified only when it’s matched to a confirmed order. Reviews we can’t match stay up,
              labelled as unmatched.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          {shown.length === 0 ? (
            <EmptyState
              title={filter === "verified" ? "No verified reviews yet" : "No reviews yet"}
              body={
                filter === "verified"
                  ? "Nothing here has been matched to a confirmed order yet. Switch back to all reviews to see the rest."
                  : "Be the first. If you’ve bought this, tell the next person what surprised you."
              }
            />
          ) : (
            <>
              <ul className="grid gap-4 sm:grid-cols-2">
                {shown.map((review) => (
                  <li key={review.id}>
                    <ReviewCard review={review} className="h-full" />
                  </li>
                ))}
              </ul>

              {reviews.length < total ? (
                <Button variant="ghost" onClick={loadMore} loading={loading} loadingLabel="Loading" className="mt-6">
                  Load more reviews ({total - reviews.length} left)
                </Button>
              ) : null}
            </>
          )}
        </div>
      </div>

      <WriteReviewModal
        open={writing}
        onClose={() => setWriting(false)}
        productSlug={productSlug}
        productName={productName}
      />
    </section>
  );
}

function WriteReviewModal({
  open,
  onClose,
  productSlug,
  productName,
}: {
  open: boolean;
  onClose: () => void;
  productSlug: string;
  productName: string;
}) {
  const [rating, setRating] = useState(0);
  const [values, setValues] = useState({ title: "", body: "", authorName: "", email: "", orderNumber: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function set(key: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (rating === 0) nextErrors.rating = "Pick a rating from one to five.";
    if (values.body.trim().length < 10) nextErrors.body = "Tell us at least a sentence — it helps the next person.";
    if (values.authorName.trim().length < 2) nextErrors.authorName = "Add a name to sign it with.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) nextErrors.email = "We need a valid email to match this to your order.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      const result = await engagementApi.submitReview({
        productSlug,
        rating,
        title: values.title || undefined,
        body: values.body,
        authorName: values.authorName,
        email: values.email,
        orderNumber: values.orderNumber || undefined,
      });
      toast.success("Review sent", { detail: result.message });
      onClose();
      setRating(0);
      setValues({ title: "", body: "", authorName: "", email: "", orderNumber: "" });
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.fields ?? {});
        toast.error(error.message);
      } else {
        toast.error("That didn’t send. Try again in a moment.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Review ${productName}`}
      description="We check every review against an order before publishing. That usually takes a day."
    >
      <form onSubmit={submit} className="flex flex-col gap-5">
        <fieldset>
          <legend className="mb-2 text-[0.875rem] text-graphite">Rating</legend>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                aria-pressed={rating === value}
                aria-label={`${value} out of 5`}
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-sm border transition-colors",
                  rating >= value ? "border-peony bg-peony-soft text-peony" : "border-mist text-clay hover:border-clay",
                )}
              >
                <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
                  <path
                    d="M10 1.6l2.47 5.3 5.53.62-4.1 3.9 1.09 5.58L10 14.2l-4.99 2.8L6.1 11.4 2 7.52l5.53-.62z"
                    fill={rating >= value ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}
          </div>
          {errors.rating ? <p className="mt-2 text-[0.8125rem] text-danger">{errors.rating}</p> : null}
        </fieldset>

        <TextField
          label="Headline"
          optional
          value={values.title}
          onChange={(event) => set("title", event.target.value)}
          placeholder="The waistband is the whole thing"
          maxLength={80}
        />

        <TextAreaField
          label="Your review"
          value={values.body}
          onChange={(event) => set("body", event.target.value)}
          error={errors.body}
          hint="What size did you take, and how did it hold up?"
          placeholder="I took M and it hasn’t ridden up once…"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Name"
            value={values.authorName}
            onChange={(event) => set("authorName", event.target.value)}
            error={errors.authorName}
            placeholder="Mariam H."
            autoComplete="name"
          />
          <TextField
            label="Email"
            type="email"
            value={values.email}
            onChange={(event) => set("email", event.target.value)}
            error={errors.email}
            hint="Not published."
            autoComplete="email"
          />
        </div>

        <TextField
          label="Order number"
          optional
          value={values.orderNumber}
          onChange={(event) => set("orderNumber", event.target.value)}
          error={errors.orderNumber}
          hint="Speeds up verification. Starts with SLY."
          placeholder="SLY-2608-4471"
        />

        <Button type="submit" size="lg" loading={saving} loadingLabel="Sending">
          Send review
        </Button>
      </form>
    </Modal>
  );
}
