"use client";

import { useActionState } from "react";
import { sendNewsletterCampaign } from "@/app/actions/newsletter";

const initial = undefined as
  | { error?: string; ok?: boolean; sent?: number }
  | undefined;

const field =
  "mt-2 w-full rounded-2xl border-2 border-line bg-paper px-4 py-3 text-base text-ink outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-sky/35";

export function NewsletterComposeForm() {
  const [state, formAction, pending] = useActionState(
    sendNewsletterCampaign,
    initial,
  );

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      <label className="block text-base font-semibold text-ink">
        Subject line
        <input name="subject" required className={field} />
      </label>
      <label className="block text-base font-semibold text-ink">
        Message (plain text)
        <textarea name="bodyText" required rows={12} className={field} />
      </label>
      {state?.error ? (
        <p className="text-base text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="text-base font-medium text-sky-deep">
          Sent to {state.sent ?? 0} inboxes. Each email includes an unsubscribe
          link.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-full bg-[var(--accent)] px-8 py-3.5 text-base font-semibold text-white shadow-md transition hover:brightness-105 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send newsletter"}
      </button>
    </form>
  );
}
