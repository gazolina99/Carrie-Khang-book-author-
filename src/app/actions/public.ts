"use server";

import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { reviewSubmitSchema, subscriberEmailSchema } from "@/lib/validation";

async function clientKey(prefix: string) {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const real = h.get("x-real-ip");
  return `${prefix}:${forwarded ?? real ?? "unknown"}`;
}

export async function subscribeToNewsletter(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  const rl = rateLimit(await clientKey("sub"), 8);
  if (!rl.ok) {
    return { error: `Too many attempts. Try again in ${rl.retryAfterSec}s.` };
  }

  const parsed = subscriberEmailSchema.safeParse({
    email: String(formData.get("email") ?? ""),
  });
  if (!parsed.success) {
    return { error: "Please enter a valid email address." };
  }

  const email = parsed.data.email.toLowerCase();
  await prisma.subscriber.upsert({
    where: { email },
    create: { email, unsubscribeToken: nanoid(32) },
    update: { unsubscribed: false },
  });

  revalidatePath("/dashboard/newsletter");
  return { ok: true };
}

export async function submitPublicReview(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  const rl = rateLimit(await clientKey("rev"), 5);
  if (!rl.ok) {
    return { error: `Too many attempts. Try again in ${rl.retryAfterSec}s.` };
  }

  const honeypot = String(formData.get("website") ?? "");
  if (honeypot.length > 0) {
    return { ok: true };
  }

  const bookIdRaw = String(formData.get("bookId") ?? "").trim();
  const parsed = reviewSubmitSchema.safeParse({
    authorName: String(formData.get("authorName") ?? ""),
    rating: String(formData.get("rating") ?? "5"),
    body: String(formData.get("body") ?? ""),
    bookId: bookIdRaw || undefined,
    website: honeypot,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  let bookId: string | null = null;
  if (parsed.data.bookId) {
    const book = await prisma.book.findFirst({
      where: { id: parsed.data.bookId, published: true },
    });
    if (book) {
      bookId = book.id;
    }
  }

  await prisma.review.create({
    data: {
      authorName: parsed.data.authorName,
      rating: parsed.data.rating,
      body: parsed.data.body,
      bookId,
      approved: false,
    },
  });

  revalidatePath("/reviews");
  revalidatePath("/dashboard/reviews");
  return { ok: true };
}
