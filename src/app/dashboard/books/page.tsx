import Link from "next/link";
import { deleteBook } from "@/app/actions/books";
import { prisma } from "@/lib/prisma";

export default async function DashboardBooksPage() {
  const books = await prisma.book.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-medium text-ink md:text-4xl">
          Books
        </h1>
        <Link
          href="/dashboard/books/new"
          className="rounded-full bg-[var(--accent)] px-6 py-3 text-base font-semibold text-white shadow-md transition hover:brightness-105"
        >
          Add book
        </Link>
      </div>
      <ul className="mt-10 divide-y divide-line rounded-3xl border border-line/80 bg-paper shadow-sm ring-1 ring-line-soft/40">
        {books.map((b) => (
          <li
            key={b.id}
            className="flex flex-wrap items-center justify-between gap-4 p-5 md:p-6"
          >
            <div>
              <p className="text-lg font-semibold text-ink">{b.title}</p>
              <p className="mt-1 text-sm text-ink-muted">
                {b.published ? "Published" : "Hidden"} · order {b.sortOrder}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/dashboard/books/${b.id}`}
                className="text-base font-semibold text-[var(--accent)] hover:underline"
              >
                Edit
              </Link>
              <form action={deleteBook}>
                <input type="hidden" name="id" value={b.id} />
                <button
                  type="submit"
                  className="text-base text-red-600 hover:underline"
                >
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
      {books.length === 0 ? (
        <p className="mt-10 text-base text-ink-muted">No books yet.</p>
      ) : null}
    </div>
  );
}
