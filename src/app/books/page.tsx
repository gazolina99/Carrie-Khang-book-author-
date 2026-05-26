import type { Metadata } from "next";
import { BookCoverInteractive } from "@/components/book-cover-interactive";
import { getPublishedBooks } from "@/lib/site-data";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Books" };
}

export default async function BooksPage() {
  const books = await getPublishedBooks();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
      <h1 className="font-serif text-4xl font-medium text-ink md:text-5xl">
        Books
      </h1>
      <p className="mt-4 max-w-2xl text-xl leading-relaxed text-ink-muted">
        Every listing is yours to shape—title, story, cover, and the link
        parents tap for “Buy now”.
      </p>
      {books.length === 0 ? (
        <p className="mt-16 rounded-3xl border-2 border-dashed border-line bg-paper/80 p-10 text-center text-lg text-ink-muted">
          New titles coming soon.
        </p>
      ) : (
        <ul className="mt-16 grid gap-12 lg:grid-cols-2">
          {books.map((book) => (
            <li
              key={book.id}
              className="grid gap-8 overflow-visible rounded-3xl border border-line/80 bg-paper p-6 shadow-md ring-1 ring-line-soft/40 sm:grid-cols-[minmax(0,12.5rem)_1fr] sm:items-start sm:gap-10 sm:p-8"
            >
              <div className="flex justify-center sm:justify-start">
                <div className="w-full max-w-[12.5rem]">
                  {book.coverPath ? (
                    <BookCoverInteractive
                      detached
                      src={book.coverPath}
                      alt={`${book.title} cover`}
                      sizes="200px"
                    />
                  ) : (
                    <div className="flex aspect-[3/4] items-center justify-center rounded-2xl border border-dashed border-line bg-mist/40 p-4 text-center text-base text-ink-muted">
                      Cover not set
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <h2 className="font-serif text-2xl font-medium text-ink md:text-3xl">
                  {book.title}
                </h2>
                <p className="mt-4 flex-1 text-lg leading-relaxed text-ink-muted">
                  {book.description}
                </p>
                <a
                  href={book.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex w-fit rounded-full bg-[var(--accent)] px-8 py-3 text-base font-semibold text-white transition hover:brightness-105"
                >
                  Buy now
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
