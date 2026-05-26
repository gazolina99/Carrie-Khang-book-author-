import Link from "next/link";
import { BookEditorForm } from "@/components/book-editor-form";

export default function NewBookPage() {
  return (
    <div>
      <Link
        href="/dashboard/books"
        className="text-base text-ink-muted transition hover:text-[var(--accent)]"
      >
        ← Back to books
      </Link>
      <h1 className="mt-5 font-serif text-3xl font-medium text-ink md:text-4xl">
        New book
      </h1>
      <div className="mt-10">
        <BookEditorForm />
      </div>
    </div>
  );
}
