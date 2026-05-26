"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const field =
  "mt-2 w-full rounded-2xl border-2 border-line bg-paper px-4 py-3 text-base text-ink outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-sky/35";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setPending(false);
    if (result?.error) {
      setError("That email or password is not correct.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-md space-y-6">
      <label className="block text-base font-semibold text-ink">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className={field}
        />
      </label>
      <label className="block text-base font-semibold text-ink">
        Password
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={field}
        />
      </label>
      {error ? (
        <p className="text-base text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[var(--accent)] px-8 py-3.5 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
