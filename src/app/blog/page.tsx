import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettingsSafe } from "@/lib/site-data";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Blog" };
}

export default async function BlogPage() {
  const settings = await getSiteSettingsSafe();
  const url = settings.wordpressBlogUrl?.trim();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-24">
      <h1 className="font-serif text-4xl font-medium text-ink md:text-5xl">
        Blog
      </h1>
      <p className="mt-4 max-w-2xl text-xl leading-relaxed text-ink-muted">
        Longer reflections can live on WordPress. Paste your public blog URL in
        Site settings to show it here, or link out if your host blocks embeds.
      </p>
      {url ? (
        <div className="mt-12 space-y-4">
          <p className="text-lg text-ink-muted">
            If the frame looks empty, your host may block embedding.{" "}
            <Link
              href={url}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[var(--accent)] underline decoration-2 underline-offset-4"
            >
              Open the blog in a new tab
            </Link>
            .
          </p>
          <div className="overflow-hidden rounded-3xl border border-line/80 bg-paper shadow-md ring-1 ring-line-soft/40">
            <iframe
              title="WordPress blog"
              src={url}
              className="h-[min(80vh,900px)] w-full"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      ) : (
        <p className="mt-12 rounded-3xl border-2 border-dashed border-line bg-paper/80 p-10 text-center text-lg text-ink-muted">
          Add your WordPress blog URL in the dashboard to embed it here.
        </p>
      )}
    </div>
  );
}
