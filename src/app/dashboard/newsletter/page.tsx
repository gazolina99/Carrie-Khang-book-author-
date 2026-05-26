import Link from "next/link";
import { NewsletterComposeForm } from "@/components/newsletter-compose-form";
import { prisma } from "@/lib/prisma";

export default async function DashboardNewsletterPage() {
  const [active, history] = await Promise.all([
    prisma.subscriber.count({ where: { unsubscribed: false } }),
    prisma.newsletterSend.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
    }),
  ]);

  return (
    <div>
      <h1 className="font-serif text-3xl font-medium text-ink md:text-4xl">
        Newsletter
      </h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Active subscribers:{" "}
        <span className="font-semibold text-ink">{active}</span>. Add{" "}
        <code className="rounded-lg bg-mist/80 px-2 py-0.5 text-sm font-medium text-ink">
          RESEND_API_KEY
        </code>{" "}
        on the server and set your verified “from” address under Site settings.
      </p>
      <div className="mt-5 flex flex-wrap gap-4 text-base">
        <Link
          href="/api/dashboard/subscribers/export"
          className="font-semibold text-[var(--accent)] hover:underline"
        >
          Download subscribers (CSV)
        </Link>
        <Link
          href="/reviews#subscribe"
          className="text-ink-muted hover:text-[var(--accent)] hover:underline"
        >
          View public signup form →
        </Link>
      </div>
      <div className="mt-10 rounded-3xl border border-line/80 bg-gradient-to-br from-paper to-blush/25 p-8 shadow-sm ring-1 ring-line-soft/40 md:p-10">
        <h2 className="font-serif text-2xl font-medium text-ink">
          Compose & send
        </h2>
        <p className="mt-2 text-base text-ink-muted">
          Each message includes a unique unsubscribe link for subscribers.
        </p>
        <div className="mt-8">
          <NewsletterComposeForm />
        </div>
      </div>
      <div className="mt-14">
        <h2 className="font-serif text-2xl font-medium text-ink">
          Recent sends
        </h2>
        <ul className="mt-5 space-y-3 text-base text-ink-muted">
          {history.map((h) => (
            <li key={h.id} className="flex flex-wrap justify-between gap-2">
              <span className="font-semibold text-ink">{h.subject}</span>
              <span>
                {h.sentAt
                  ? `${h.recipientCount} sent · ${h.sentAt.toLocaleString()}`
                  : "Draft / failed"}
              </span>
            </li>
          ))}
        </ul>
        {history.length === 0 ? (
          <p className="mt-5 text-base text-ink-muted">No campaigns logged yet.</p>
        ) : null}
      </div>
    </div>
  );
}
