"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { createElement } from "react";

export function AdminDock() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/login")) {
    return null;
  }

  const signedIn = status === "authenticated" && !!session?.user;
  const href = signedIn ? "/dashboard" : "/login?callbackUrl=/dashboard";
  const label = signedIn ? "Dashboard" : "Author sign in";

  return createElement(
    "div",
    {
      className:
        "fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2",
      "aria-label": "Author controls",
    },
    createElement(
      Link,
      {
        href,
        className:
          "rounded-full border border-line/90 bg-paper/95 px-5 py-3 text-sm font-semibold text-ink shadow-lg ring-1 ring-line-soft/60 backdrop-blur-md transition hover:border-[var(--accent)] hover:text-[var(--accent)]",
      },
      label,
    ),
    signedIn
      ? createElement(
          "p",
          {
            className:
              "max-w-[14rem] truncate rounded-lg bg-paper/90 px-3 py-1.5 text-xs text-ink-muted shadow-sm ring-1 ring-line-soft/50",
          },
          session.user?.email,
        )
      : null,
  );
}
