"use client";

import type { Session } from "next-auth";
import { SessionProvider as NextSessionProvider } from "next-auth/react";

export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <NextSessionProvider session={session}>{children}</NextSessionProvider>
  );
}
