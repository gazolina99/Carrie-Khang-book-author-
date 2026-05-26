import Link from "next/link";

export function SetupNeeded({ detail }: { detail?: string }) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 md:px-10">
      <h1 className="font-serif text-4xl font-medium text-ink">
        Site not connected yet
      </h1>
      <p className="mt-6 text-lg text-ink-muted">
        This is a <strong className="text-ink">Netlify</strong> site — not Vercel.
        The app needs a database before the public pages can load.
      </p>
      {detail ? (
        <p className="mt-4 rounded-2xl bg-blush/50 px-4 py-3 text-sm text-ink-muted">
          {detail}
        </p>
      ) : null}
      <ol className="mt-10 list-decimal space-y-4 pl-6 text-lg text-ink-muted">
        <li>
          Deploy on{" "}
          <a
            href="https://app.netlify.com"
            className="font-semibold text-[var(--accent)] underline"
          >
            app.netlify.com
          </a>{" "}
          (import from Git — do not use Vercel).
        </li>
        <li>
          Enable <strong className="text-ink">Netlify DB</strong> (Extensions →
          Netlify DB).
        </li>
        <li>
          Add env vars: <code className="text-ink">AUTH_SECRET</code>,{" "}
          <code className="text-ink">ADMIN_EMAIL</code>,{" "}
          <code className="text-ink">ADMIN_PASSWORD</code> (see README.md).
        </li>
        <li>Redeploy. Then open /login to sign in.</li>
      </ol>
      <p className="mt-10">
        <Link
          href="/login"
          className="inline-flex rounded-full bg-[var(--accent)] px-8 py-3 font-semibold text-white"
        >
          Author sign in
        </Link>
      </p>
    </div>
  );
}
