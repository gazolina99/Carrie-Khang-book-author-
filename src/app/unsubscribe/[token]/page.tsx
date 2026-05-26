import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function UnsubscribePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const res = await prisma.subscriber.updateMany({
    where: { unsubscribeToken: token },
    data: { unsubscribed: true },
  });

  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center md:py-32">
      {res.count > 0 ? (
        <>
          <h1 className="font-serif text-3xl font-medium text-ink md:text-4xl">
            You are unsubscribed
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            You will not receive further newsletter messages from this site.
          </p>
        </>
      ) : (
        <>
          <h1 className="font-serif text-3xl font-medium text-ink md:text-4xl">
            Link not recognized
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            This unsubscribe link may have already been used or is invalid.
          </p>
        </>
      )}
      <Link
        href="/"
        className="mt-10 inline-block text-lg font-semibold text-[var(--accent)] hover:underline"
      >
        Back to home
      </Link>
    </div>
  );
}
