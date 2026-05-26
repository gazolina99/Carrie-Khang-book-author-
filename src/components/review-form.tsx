"use client";

import { useActionState, useState } from "react";
import { StarRatingPicker } from "@/components/star-rating-picker";
import { submitPublicReview } from "@/app/actions/public";

const initial = undefined as { error?: string; ok?: boolean } | undefined;

const field =
  "mt-2 w-full rounded-2xl border-2 border-line bg-paper px-4 py-3.5 text-lg text-ink outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-sky/35";

type Opt = { id: string; title: string };

export function ReviewForm({ books }: { books: Opt[] }) {
  const [state, formAction, pending] = useActionState(
    submitPublicReview,
    initial,
  );
  const [rating, setRating] = useState(5);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="pointer-events-none fixed left-[-9999px] top-0 h-px w-px opacity-0"
      />
      <label className="block text-base font-semibold text-ink">
        Your name (shown if approved)
        <input
          name="authorName"
          required
          maxLength={80}
          className={field}
        />
      </label>
      <div className="block text-base font-semibold text-ink">
        <span className="block" id="review-rating-label">
          Rating
        </span>
        <div className="mt-3">
          <StarRatingPicker
            name="rating"
            labelledBy="review-rating-label"
            value={rating}
            onValueChange={setRating}
            disabled={pending}
            size="md"
          />
        </div>
      </div>
      {books.length > 0 ? (
        <label className="block text-base font-semibold text-ink">
          Book (optional)
          <select name="bookId" defaultValue="" className={field}>
            <option value="">General / not tied to one title</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label className="block text-base font-semibold text-ink">
        Review
        <textarea
          name="body"
          required
          minLength={10}
          rows={5}
          className={field}
        />
      </label>
      {state?.error ? (
        <p className="text-base text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="text-lg font-medium text-sky-deep">
          Thank you. Your note will appear after a quick review.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-full border-2 border-rose-deep/40 bg-blush/50 px-8 py-3.5 text-lg font-semibold text-ink transition hover:bg-blush disabled:opacity-60"
      >
        {pending ? "Sending…" : "Submit review"}
      </button>
    </form>
  );
}
