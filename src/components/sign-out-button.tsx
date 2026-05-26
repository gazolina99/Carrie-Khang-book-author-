"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="mt-4 w-full rounded-xl border border-line px-3 py-2.5 text-left text-base font-medium text-ink-muted transition hover:bg-mist/60 hover:text-ink"
    >
      Sign out
    </button>
  );
}
