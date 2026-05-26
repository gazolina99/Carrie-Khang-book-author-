import Link from "next/link";
import { BookCoverInteractive } from "@/components/book-cover-interactive";
import {
  getPublishedBooks,
  getSiteSettingsSafe,
} from "@/lib/site-data";

export default async function HomePage() {
  const [settings, books] = await Promise.all([
    getSiteSettingsSafe(),
    getPublishedBooks(),
  ]);

  return (
    <div>
      <section className="border-b border-line/60 bg-gradient-to-b from-paper via-canvas to-mist/30 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <p className="text-base font-semibold uppercase tracking-[0.25em] text-sky-deep">
            {settings.tagline || "Stories for families"}
          </p>
          <h1 className="mt-6 max-w-4xl font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl lg:text-6xl">
            {settings.heroTitle || settings.siteName}
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-ink-muted md:text-2xl">
            {settings.heroSubtitle}
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/books"
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-sky-deep/20 transition hover:brightness-105"
            >
              View books
            </Link>
            <Link
              href="/reviews#write"
              className="inline-flex items-center justify-center rounded-full border-2 border-line bg-paper/90 px-10 py-4 text-lg font-semibold text-ink shadow-sm backdrop-blur-sm transition hover:border-rose-deep/35 hover:bg-blush/40"
            >
              Reader reviews
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-3xl font-medium text-ink md:text-4xl">
              Books
            </h2>
            <p className="mt-2 max-w-xl text-lg text-ink-muted">
              Gentle reads for parents—covers, descriptions, and shop links stay
              in your control from the dashboard.
            </p>
          </div>
          <Link
            href="/books"
            className="text-lg font-semibold text-[var(--accent)] hover:underline"
          >
            See all
          </Link>
        </div>
        {books.length === 0 ? (
          <p className="mt-12 rounded-3xl border-2 border-dashed border-line bg-paper/80 p-10 text-center text-lg text-ink-muted">
            New titles coming soon. Check back shortly.
          </p>
        ) : (
          <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <li
                key={book.id}
                className="flex flex-col overflow-visible rounded-3xl border border-line/80 bg-paper shadow-md ring-1 ring-line-soft/50"
              >
                <div className="relative flex justify-center bg-gradient-to-b from-mist/55 via-canvas/75 to-paper px-5 pb-14 pt-9 md:px-8 md:pb-16 md:pt-10">
                  <div className="relative w-[88%] max-w-[15rem]">
                    {book.coverPath ? (
                      <BookCoverInteractive
                        detached
                        src={book.coverPath}
                        alt={`${book.title} cover`}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex aspect-[3/4] items-center justify-center rounded-2xl border border-dashed border-line bg-mist/40 p-6 text-center text-base text-ink-muted md:text-lg">
                        Cover image not set
                      </div>
                    )}
                  </div>
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-paper via-paper/90 to-transparent"
                    aria-hidden
                  />
                </div>
                <div className="flex flex-1 flex-col border-t border-line/55 px-6 pb-7 pt-1 md:px-7 md:pb-8">
                  <h3 className="font-serif text-xl font-medium text-ink md:text-2xl">
                    {book.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-lg leading-relaxed text-ink-muted">
                    {book.description}
                  </p>
                  <a
                    href={book.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-base font-semibold text-white transition hover:brightness-105"
                  >
                    Buy now
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
