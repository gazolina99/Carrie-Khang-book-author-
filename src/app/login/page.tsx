import { auth } from "@/auth";
import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { isAuthConfigured, isDatabaseConfigured } from "@/lib/site-data";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const session = await auth().catch(() => null);

  if (session?.user) {
    redirect(callbackUrl?.startsWith("/") ? callbackUrl : "/dashboard");
  }

  const ready = isDatabaseConfigured() && isAuthConfigured();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
      <h1 className="font-serif text-3xl font-medium text-ink md:text-4xl">
        Author sign in
      </h1>
      <p className="mt-3 max-w-xl text-lg text-ink-muted">
        Sign in to manage books, site copy, reviews, and newsletter. Changes
        you save here appear on the public site immediately.
      </p>
      {ready ? (
        <Suspense fallback={<p className="mt-10 text-ink-muted">Loading…</p>}>
          <LoginForm />
        </Suspense>
      ) : (
        <div className="mx-auto mt-10 max-w-md rounded-3xl border border-line/80 bg-paper p-8 text-center shadow-sm">
          <p className="text-lg text-ink-muted">
            The author dashboard is not available yet. Please check back soon.
          </p>
        </div>
      )}
      <p className="mx-auto mt-8 max-w-md text-center text-base text-ink-muted">
        <Link href="/" className="font-semibold text-[var(--accent)] hover:underline">
          ← Back to site
        </Link>
      </p>
    </div>
  );
}
