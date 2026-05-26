import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardHome() {
  const [books, pendingReviews, subscribers] = await Promise.all([
    prisma.book.count(),
    prisma.review.count({ where: { approved: false } }),
    prisma.subscriber.count({ where: { unsubscribed: false } }),
  ]);

  return (
    <div>
      <h1 className="font-serif text-3xl font-medium text-ink md:text-4xl">
        Overview
      </h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Everything you need to run a calm, parent-facing author site—books,
        copy, colors, mail, and reader notes.
      </p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-3">
        <li className="rounded-3xl border border-line/80 bg-gradient-to-br from-paper to-mist/40 p-6 shadow-sm ring-1 ring-line-soft/40">
          <p className="text-4xl font-semibold text-[var(--accent)]">{books}</p>
          <p className="mt-2 text-base text-ink-muted">Books</p>
          <Link
            href="/dashboard/books"
            className="mt-4 inline-block text-base font-semibold text-[var(--accent)] hover:underline"
          >
            Manage →
          </Link>
        </li>
        <li className="rounded-3xl border border-line/80 bg-gradient-to-br from-paper to-blush/35 p-6 shadow-sm ring-1 ring-line-soft/40">
          <p className="text-4xl font-semibold text-rose-deep">{pendingReviews}</p>
          <p className="mt-2 text-base text-ink-muted">Reviews awaiting approval</p>
          <Link
            href="/dashboard/reviews"
            className="mt-4 inline-block text-base font-semibold text-[var(--accent)] hover:underline"
          >
            Moderate →
          </Link>
        </li>
        <li className="rounded-3xl border border-line/80 bg-gradient-to-br from-paper to-mist/30 p-6 shadow-sm ring-1 ring-line-soft/40">
          <p className="text-4xl font-semibold text-sky-deep">{subscribers}</p>
          <p className="mt-2 text-base text-ink-muted">Active subscribers</p>
          <Link
            href="/dashboard/newsletter"
            className="mt-4 inline-block text-base font-semibold text-[var(--accent)] hover:underline"
          >
            Newsletter →
          </Link>
        </li>
      </ul>
    </div>
  );
}
