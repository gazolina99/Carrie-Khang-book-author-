import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { requireAuth } from "@/lib/require-auth";

const nav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/books", label: "Books" },
  { href: "/dashboard/settings", label: "Site settings" },
  { href: "/dashboard/newsletter", label: "Newsletter" },
  { href: "/dashboard/reviews", label: "Reviews" },
  { href: "/dashboard/integrations", label: "WordPress & tools" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-10 md:py-16">
      <div className="flex flex-col gap-10 md:flex-row md:gap-12">
        <aside className="w-full shrink-0 rounded-3xl border border-line/80 bg-paper/95 p-6 shadow-md ring-1 ring-line-soft/50 sm:w-60 md:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-muted">
            Dashboard
          </p>
          <p className="mt-2 truncate text-base font-semibold text-ink">
            {session.user?.email}
          </p>
          <nav className="mt-8 flex flex-col gap-1 border-t border-line pt-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2.5 text-base font-medium text-ink-muted transition hover:bg-mist/60 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 border-t border-line pt-6">
            <Link
              href="/"
              className="text-base font-semibold text-[var(--accent)] hover:underline"
            >
              ← Public site
            </Link>
            <SignOutButton />
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
