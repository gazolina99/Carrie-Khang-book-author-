export default function IntegrationsPage() {
  return (
    <div className="max-w-2xl space-y-10 text-base leading-relaxed text-ink-muted">
      <h1 className="font-serif text-3xl font-medium text-ink md:text-4xl">
        Hosting & integrations
      </h1>
      <section>
        <h2 className="text-xl font-semibold text-ink">Hosting</h2>
        <p className="mt-3">
          Deploy from this GitHub repo to any Node 20 runtime with PostgreSQL.
          Covers are stored under{" "}
          <strong className="text-ink">public/uploads/books/</strong> on disk,
          unless the app runs with Netlify’s runtime (covers then use Blobs +
          <code className="mx-1 rounded-lg bg-mist/90 px-2 py-0.5 text-sm text-ink">
            /api/covers/…
          </code>
          ). See{" "}
          <code className="rounded-lg bg-mist/90 px-2 py-0.5 text-sm text-ink">
            README.md
          </code>{" "}
          and{" "}
          <code className="rounded-lg bg-mist/90 px-2 py-0.5 text-sm text-ink">
            DEPLOY-ENV-VARS.txt
          </code>{" "}
          for environment variables.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-ink">WordPress blog</h2>
        <p className="mt-3">
          Add your public WordPress URL under{" "}
          <strong className="text-ink">Site settings → WordPress blog URL</strong>
          . The Blog page embeds it when allowed.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-ink">Email (Resend)</h2>
        <p className="mt-3">
          Add{" "}
          <code className="rounded-lg bg-mist/90 px-2 py-0.5 text-sm text-ink">
            RESEND_API_KEY
          </code>{" "}
          in your hosting environment variables, verify your domain in Resend,
          then set your “from” address in Site settings.
        </p>
      </section>
    </div>
  );
}
