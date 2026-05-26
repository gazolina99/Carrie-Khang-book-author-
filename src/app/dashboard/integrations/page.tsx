export default function IntegrationsPage() {
  return (
    <div className="max-w-2xl space-y-10 text-base leading-relaxed text-ink-muted">
      <h1 className="font-serif text-3xl font-medium text-ink md:text-4xl">
        Hosting & integrations
      </h1>
      <section>
        <h2 className="text-xl font-semibold text-ink">Netlify</h2>
        <p className="mt-3">
          This site is built for{" "}
          <strong className="text-ink">Netlify</strong>. The database is
          PostgreSQL; book covers are stored in{" "}
          <strong className="text-ink">Netlify Blobs</strong>. See{" "}
          <code className="rounded-lg bg-mist/90 px-2 py-0.5 text-sm text-ink">
            NETLIFY.md
          </code>{" "}
          in the project for deploy steps.
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
          in Netlify environment variables, verify your domain in Resend, then
          set your “from” address in Site settings.
        </p>
      </section>
    </div>
  );
}
