import { deleteReview, setReviewApproved } from "@/app/actions/reviews-admin";
import { StarRatingDisplay } from "@/components/star-rating-display";
import { prisma } from "@/lib/prisma";

export default async function DashboardReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { book: { select: { title: true } } },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl font-medium text-ink md:text-4xl">
        Reviews
      </h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Approve kind notes before they appear publicly. Data is stored safely
        with Prisma (parameterized queries).
      </p>
      <ul className="mt-10 space-y-5">
        {reviews.map((r) => (
          <li
            key={r.id}
            className="rounded-3xl border border-line/80 bg-paper p-6 shadow-sm ring-1 ring-line-soft/40 md:p-7"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-lg font-semibold text-ink">
                  <span>{r.authorName}</span>
                  <StarRatingDisplay value={r.rating} size="sm" />
                </p>
                {r.book ? (
                  <p className="mt-1 text-sm text-ink-muted">Book: {r.book.title}</p>
                ) : null}
                <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-ink-muted">
                  {r.body}
                </p>
                <p className="mt-3 text-sm text-ink-muted/80">
                  {r.createdAt.toLocaleString()} ·{" "}
                  {r.approved ? "Approved" : "Pending"}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {!r.approved ? (
                  <form action={setReviewApproved}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="approved" value="true" />
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
                    >
                      Approve
                    </button>
                  </form>
                ) : (
                  <form action={setReviewApproved}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="approved" value="false" />
                    <button
                      type="submit"
                      className="w-full rounded-full border-2 border-line bg-canvas px-4 py-2 text-sm font-semibold text-ink"
                    >
                      Hide
                    </button>
                  </form>
                )}
                <form action={deleteReview}>
                  <input type="hidden" name="id" value={r.id} />
                  <button
                    type="submit"
                    className="w-full text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {reviews.length === 0 ? (
        <p className="mt-10 text-base text-ink-muted">No reviews yet.</p>
      ) : null}
    </div>
  );
}
