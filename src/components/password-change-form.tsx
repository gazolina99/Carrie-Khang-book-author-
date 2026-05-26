"use client";

import { useActionState } from "react";
import { changeAdminPassword } from "@/app/actions/settings";

const initial = undefined as { error?: string; ok?: boolean } | undefined;

const field =
  "mt-2 w-full rounded-2xl border-2 border-line bg-paper px-4 py-3 text-base text-ink outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-sky/35";

export function PasswordChangeForm() {
  const [state, formAction, pending] = useActionState(
    changeAdminPassword,
    initial,
  );

  return (
    <form
      action={formAction}
      className="mt-14 max-w-md space-y-6 border-t border-line pt-14"
    >
      <h2 className="font-serif text-2xl font-medium text-ink">
        Change login password
      </h2>
      <label className="block text-base font-semibold text-ink">
        Current password
        <input
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className={field}
        />
      </label>
      <label className="block text-base font-semibold text-ink">
        New password (at least 10 characters)
        <input
          name="nextPassword"
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          className={field}
        />
      </label>
      {state?.error ? (
        <p className="text-base text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="text-base font-medium text-sky-deep">Password updated.</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border-2 border-line bg-blush/40 px-8 py-3.5 text-base font-semibold text-ink transition hover:bg-blush/60 disabled:opacity-60"
      >
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
