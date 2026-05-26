"use client";

import { useActionState } from "react";
import type { Book } from "@prisma/client";
import { saveBook } from "@/app/actions/books";

const initial = undefined as { error?: string; ok?: boolean } | undefined;

const field =
  "mt-2 w-full rounded-2xl border-2 border-line bg-paper px-4 py-3 text-base text-ink outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-sky/35";

export function BookEditorForm({ book }: { book?: Book | null }) {
  const [state, formAction, pending] = useActionState(saveBook, initial);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      {book ? <input type="hidden" name="id" value={book.id} /> : null}
      <label className="block text-base font-semibold text-ink">
        Title
        <input
          name="title"
          required
          defaultValue={book?.title ?? ""}
          className={field}
        />
      </label>
      <label className="block text-base font-semibold text-ink">
        Description
        <textarea
          name="description"
          required
          rows={6}
          defaultValue={book?.description ?? ""}
          className={field}
        />
      </label>
      <label className="block text-base font-semibold text-ink">
        Buy now link (full URL or store.com/… — https is added if missing)
        <input
          name="buyUrl"
          type="text"
          inputMode="url"
          autoComplete="url"
          required
          placeholder="https://…"
          defaultValue={book?.buyUrl ?? ""}
          className={field}
        />
      </label>
      <label className="block text-base font-semibold text-ink">
        Sort order (lower shows first)
        <input
          name="sortOrder"
          type="number"
          min={0}
          defaultValue={book?.sortOrder ?? 0}
          className={field}
        />
      </label>
      <label className="flex items-center gap-3 text-base font-medium text-ink">
        <input
          type="checkbox"
          name="published"
          defaultChecked={book?.published ?? true}
          className="size-5 rounded border-line text-[var(--accent)] focus:ring-sky/40"
        />
        Published on public site
      </label>
      <label className="block text-base font-semibold text-ink">
        Cover image (JPG, PNG, WebP · max 4MB)
        <input
          name="cover"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="mt-3 w-full text-base file:mr-4 file:rounded-full file:border-0 file:bg-mist file:px-4 file:py-2 file:font-semibold file:text-ink"
        />
      </label>
      {book?.coverPath ? (
        <p className="text-sm text-ink-muted">
          Current file: {book.coverPath}. Upload a new file to replace it.
        </p>
      ) : null}
      {state?.error ? (
        <p className="text-base text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="text-base font-medium text-sky-deep">Saved successfully.</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-full bg-[var(--accent)] px-8 py-3.5 text-base font-semibold text-white shadow-md transition hover:brightness-105 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save book"}
      </button>
    </form>
  );
}
