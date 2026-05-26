"use server";

import { hash } from "bcryptjs";
import { compare } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getDashboardUser } from "@/lib/dashboard-user";
import { prisma } from "@/lib/prisma";
import { passwordChangeSchema, siteSettingsSchema } from "@/lib/validation";

export async function updateSiteSettings(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  const user = await getDashboardUser();
  if (!user) {
    return { error: "No author account. Run: npm run db:seed" };
  }

  const raw = {
    siteName: String(formData.get("siteName") ?? ""),
    tagline: String(formData.get("tagline") ?? ""),
    heroTitle: String(formData.get("heroTitle") ?? ""),
    heroSubtitle: String(formData.get("heroSubtitle") ?? ""),
    accentHex: String(formData.get("accentHex") ?? "#6d28d9"),
    aboutBody: String(formData.get("aboutBody") ?? ""),
    footerNote: String(formData.get("footerNote") ?? ""),
    contactEmailPublic: String(formData.get("contactEmailPublic") ?? ""),
    twitterUrl: String(formData.get("twitterUrl") ?? ""),
    instagramUrl: String(formData.get("instagramUrl") ?? ""),
    goodreadsUrl: String(formData.get("goodreadsUrl") ?? ""),
    newsletterFromEmail: String(formData.get("newsletterFromEmail") ?? ""),
    newsletterReplyTo: String(formData.get("newsletterReplyTo") ?? ""),
    wordpressBlogUrl: String(formData.get("wordpressBlogUrl") ?? ""),
  };

  const parsed = siteSettingsSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      ...parsed.data,
    },
    update: parsed.data,
  });

  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/dashboard/settings");
  return { ok: true };
}

export async function changeAdminPassword(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  const user = await getDashboardUser();
  if (!user) {
    return { error: "No author account. Run: npm run db:seed" };
  }
  const raw = {
    currentPassword: String(formData.get("currentPassword") ?? ""),
    nextPassword: String(formData.get("nextPassword") ?? ""),
  };
  const parsed = passwordChangeSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });
  if (!dbUser) {
    return { error: "User missing." };
  }
  const ok = await compare(parsed.data.currentPassword, dbUser.passwordHash);
  if (!ok) {
    return { error: "Current password is incorrect." };
  }

  const passwordHash = await hash(parsed.data.nextPassword, 12);
  await prisma.user.update({
    where: { id: dbUser.id },
    data: { passwordHash },
  });

  return { ok: true };
}
