import Link from "next/link";
import type { SiteSettings } from "@prisma/client";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-auto border-t border-line/80 bg-gradient-to-br from-blush/40 via-paper/90 to-mist/50 py-14 text-base text-ink-muted md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 md:flex-row md:items-start md:justify-between md:px-10">
        <div className="max-w-lg">
          <p className="font-serif text-xl font-medium text-ink md:text-2xl">
            {settings.siteName}
          </p>
          <p className="mt-3 whitespace-pre-wrap leading-relaxed">
            {settings.footerNote}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-ink-muted">
            Connect
          </span>
          {settings.contactEmailPublic ? (
            <a
              className="text-lg font-medium text-ink hover:text-[var(--accent)]"
              href={`mailto:${settings.contactEmailPublic}`}
            >
              {settings.contactEmailPublic}
            </a>
          ) : null}
          <div className="flex flex-wrap gap-4 text-base">
            {settings.twitterUrl ? (
              <a
                className="rounded-full bg-paper/80 px-4 py-2 font-medium text-ink shadow-sm ring-1 ring-line/60 transition hover:ring-sky-deep/30"
                href={settings.twitterUrl}
                target="_blank"
                rel="noreferrer"
              >
                Twitter / X
              </a>
            ) : null}
            {settings.instagramUrl ? (
              <a
                className="rounded-full bg-paper/80 px-4 py-2 font-medium text-ink shadow-sm ring-1 ring-line/60 transition hover:ring-rose-deep/30"
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            ) : null}
            {settings.goodreadsUrl ? (
              <a
                className="rounded-full bg-paper/80 px-4 py-2 font-medium text-ink shadow-sm ring-1 ring-line/60 transition hover:ring-sky-deep/30"
                href={settings.goodreadsUrl}
                target="_blank"
                rel="noreferrer"
              >
                Goodreads
              </a>
            ) : null}
          </div>
          <Link
            href="/reviews#subscribe"
            className="mt-2 w-fit text-lg font-semibold text-[var(--accent)] underline decoration-2 underline-offset-4 hover:opacity-90"
          >
            Newsletter
          </Link>
        </div>
      </div>
    </footer>
  );
}
