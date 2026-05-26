import Link from "next/link";
import type { SiteSettings } from "@prisma/client";

const links = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Books" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-5 py-5 md:px-10 md:py-6">
        <Link href="/" className="group max-w-[min(100%,20rem)]">
          <p className="font-serif text-2xl font-medium tracking-tight text-ink md:text-3xl">
            {settings.siteName}
          </p>
          {settings.tagline ? (
            <p className="mt-1 text-base text-ink-muted md:text-lg">
              {settings.tagline}
            </p>
          ) : null}
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-base font-medium text-ink-muted">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2.5 transition hover:bg-mist/80 hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
