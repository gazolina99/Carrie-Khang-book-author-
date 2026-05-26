import type { Session } from "next-auth";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

/**
 * Dashboard layout — requires a signed-in session and a seeded user row.
 * Server actions should use {@link getDashboardUser} instead (no redirect).
 */
export async function requireAuth(): Promise<Session> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) {
    redirect("/?needAdminSeed=1");
  }

  return session;
}
