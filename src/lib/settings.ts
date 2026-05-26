import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
  const row = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });
  if (row) return row;
  return prisma.siteSettings.create({
    data: { id: "singleton" },
  });
}
