import type { Metadata } from "next";
import { ReviewForm } from "@/components/review-form";
import { StarRatingDisplay } from "@/components/star-rating-display";
import { SubscribeForm } from "@/components/subscribe-form";
import {
  getApprovedReviews,
  getBooksForReviewPicker,
  isDatabaseConfigured,
} from "@/lib/site-data";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Reviews" };
}

export default async function ReviewsPage() {
  const dbReady = isDatabaseConfigured();
  const [reviews, books] = dbReady
    ? await Promise.all([getApprovedReviews(), getBooksForReviewPicker()])
    : [[], []];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
      <h1 className="font-serif text-4xl font-medium text-ink md:text-5xl">
        Reader reviews
      </h1>
      <p className="mt-4 max-w-2xl text-xl leading-relaxed text-ink-muted">
        Kind words from parents and readers. New notes are reviewed first so
        this space stays warm and safe. Join the newsletter for gentle updates.
      </p>

      <section id="subscribe" className="mt-20 scroll-mt-28">
        <div className="rounded-3xl border border-line/80 bg-gradient-to-br from-mist/40 to-blush/30 p-8 md:p-10">
          <h2 className="font-serif text-2xl font-medium text-ink md:text-3xl">
            Newsletter
          </h2>
          <p className="mt-3 max-w-xl text-lg text-ink-muted">
            Occasional emails with news and releases—unsubscribe anytime from
            any message.
          </p>
          <div className="mt-8">
            {dbReady ? (
              <SubscribeForm />
            ) : (
              <p className="text-lg text-ink-muted">
                Newsletter sign-up will open soon.
              </p>
            )}
          </div>
        </div>
      </section>

      <section id="write" className="mt-20 scroll-mt-28">
        <h2 className="font-serif text-2xl font-medium text-ink md:text-3xl">
          Leave a review
        </h2>
        <div className="mt-8">
          {dbReady ? (
            <ReviewForm books={books} />
          ) : (
            <p className="text-lg text-ink-muted">
              Reviews will open soon. Thank you for your patience.
            </p>
          )}
        </div>
      </section>

      <section className="mt-24">
        <h2 className="font-serif text-2xl font-medium text-ink md:text-3xl">
          Published reviews
        </h2>
        <ul className="mt-10 space-y-8">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="rounded-3xl border border-line/80 bg-paper p-8 shadow-sm ring-1 ring-line-soft/40"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="text-lg font-semibold text-ink">{r.authorName}</p>
                <StarRatingDisplay value={r.rating} />
              </div>
              {r.book ? (
                <p className="mt-2 text-base text-ink-muted">
                  On “{r.book.title}”
                </p>
              ) : null}
              <p className="mt-4 whitespace-pre-wrap text-lg leading-relaxed text-ink-muted">
                {r.body}
              </p>
            </li>
          ))}
        </ul>
        {reviews.length === 0 ? (
          <p className="mt-12 text-center text-lg text-ink-muted">
            No reviews published yet.
          </p>
        ) : null}
      </section>
    </div>
  );
}
