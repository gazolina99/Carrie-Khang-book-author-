import Link from "next/link";
import { notFound } from "next/navigation";
import { BookEditorForm } from "@/components/book-editor-form";
import { prisma } from "@/lib/prisma";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/dashboard/books"
        className="text-base text-ink-muted transition hover:text-[var(--accent)]"
      >
        ← Back to books
      </Link>
      <h1 className="mt-5 font-serif text-3xl font-medium text-ink md:text-4xl">
        Edit book
      </h1>
      <div className="mt-10">
        <BookEditorForm book={book} />
      </div>
    </div>
  );
}
