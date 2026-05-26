"use client";

import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/actions/public";

const initial = undefined as { error?: string; ok?: boolean } | undefined;

const inputClass =
  "flex-1 rounded-2xl border-2 border-line bg-paper px-5 py-3.5 text-lg text-ink outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-sky/35";

export function SubscribeForm() {
  const [state, formAction, pending] = useActionState(
    subscribeToNewsletter,
    initial,
  );

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          className={inputClass}
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[var(--accent)] px-8 py-3.5 text-lg font-semibold text-white shadow-md transition hover:brightness-105 disabled:opacity-60"
        >
          {pending ? "…" : "Subscribe"}
        </button>
      </div>
      {state?.error ? (
        <p className="text-base text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="text-lg font-medium text-sky-deep">
          You are on the list. Watch your inbox for gentle updates.
        </p>
      ) : null}
    </form>
  );
}
