import { auth } from "@/auth";
import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;

  if (session?.user) {
    redirect(callbackUrl?.startsWith("/") ? callbackUrl : "/dashboard");
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
      <h1 className="font-serif text-3xl font-medium text-ink md:text-4xl">
        Author sign in
      </h1>
      <p className="mt-3 max-w-xl text-lg text-ink-muted">
        Sign in to manage books, site copy, reviews, and newsletter. Changes
        you save here appear on the public site immediately.
      </p>
      <Suspense fallback={<p className="mt-10 text-ink-muted">Loading…</p>}>
        <LoginForm />
      </Suspense>
      <p className="mx-auto mt-8 max-w-md text-center text-base text-ink-muted">
        <Link href="/" className="font-semibold text-[var(--accent)] hover:underline">
          ← Back to site
        </Link>
      </p>
    </div>
  );
}


