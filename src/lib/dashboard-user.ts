import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/** Signed-in author account, or null if not logged in. */
export async function getDashboardUser() {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) {
    return null;
  }
  return prisma.user.findUnique({ where: { id } });
}
