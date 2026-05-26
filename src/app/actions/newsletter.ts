"use server";

import { Resend } from "resend";
import { revalidatePath } from "next/cache";
import { getDashboardUser } from "@/lib/dashboard-user";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { newsletterComposeSchema } from "@/lib/validation";

export async function sendNewsletterCampaign(
  _prev: { error?: string; ok?: boolean; sent?: number } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean; sent?: number }> {
  if (!(await getDashboardUser())) {
    return { error: "No author account. Run: npm run db:seed" };
  }

  const raw = {
    subject: String(formData.get("subject") ?? ""),
    bodyText: String(formData.get("bodyText") ?? ""),
  };
  const parsed = newsletterComposeSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  const settings = await getSiteSettings();
  const from =
    settings.newsletterFromEmail.trim() ||
    process.env.NEWSLETTER_FROM_EMAIL ||
    "";
  if (!from) {
    return {
      error:
        "Set “Newsletter from email” in Site settings before sending (verified domain in Resend).",
    };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return {
      error:
        "Add RESEND_API_KEY to your server environment to send email. Subscribers are still saved in the database.",
    };
  }

  const resend = new Resend(apiKey);
  const replyTo = settings.newsletterReplyTo.trim() || undefined;
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.AUTH_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");

  let sent = 0;
  const errors: string[] = [];

  const detailedSubs = await prisma.subscriber.findMany({
    where: { unsubscribed: false },
    select: { email: true, unsubscribeToken: true },
  });

  if (detailedSubs.length === 0) {
    return { error: "No active subscribers yet." };
  }

  for (const sub of detailedSubs) {
    const footer = `\n\n—\nUnsubscribe: ${baseUrl}/unsubscribe/${sub.unsubscribeToken}`;
    const { error } = await resend.emails.send({
      from,
      to: sub.email,
      replyTo,
      subject: parsed.data.subject,
      text: `${parsed.data.bodyText}${footer}`,
    });
    if (error) {
      errors.push(`${sub.email}: ${error.message}`);
    } else {
      sent += 1;
    }
  }

  await prisma.newsletterSend.create({
    data: {
      subject: parsed.data.subject,
      bodyText: parsed.data.bodyText,
      sentAt: sent > 0 ? new Date() : null,
      recipientCount: sent,
    },
  });

  revalidatePath("/dashboard/newsletter");
  if (errors.length && sent === 0) {
    return { error: errors.slice(0, 3).join(" | ") };
  }
  return { ok: true, sent };
}
