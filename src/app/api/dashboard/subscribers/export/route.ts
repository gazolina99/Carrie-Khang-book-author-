import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rows = await prisma.subscriber.findMany({
    where: { unsubscribed: false },
    orderBy: { createdAt: "desc" },
    select: { email: true, createdAt: true },
  });

  const header = "email,subscribed_at\n";
  const body = rows
    .map((r) => `${escapeCsv(r.email)},${r.createdAt.toISOString()}`)
    .join("\n");

  return new Response(header + body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="subscribers.csv"',
      "Cache-Control": "no-store",
    },
  });
}

function escapeCsv(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
