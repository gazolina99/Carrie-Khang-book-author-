import type { Book, Review, SiteSettings } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function isAuthConfigured() {
  return Boolean(process.env.AUTH_SECRET?.trim());
}

/** Shown on the public site when the database is not connected yet. */
export const defaultSiteSettings: SiteSettings = {
  id: "singleton",
  siteName: "Carrie Khang",
  tagline: "Author",
  heroTitle: "Stories that stay with you",
  heroSubtitle:
    "Welcome to my corner of the web. Explore books, news, and reader notes.",
  accentHex: "#8aa8cf",
  aboutBody:
    "I write fiction with heart for families. Browse books, leave a kind note, or join the newsletter for gentle updates.",
  footerNote: "© Carrie Khang. All rights reserved.",
  contactEmailPublic: "",
  twitterUrl: "",
  instagramUrl: "",
  goodreadsUrl: "",
  newsletterFromEmail: "",
  newsletterReplyTo: "",
  wordpressBlogUrl: "",
  updatedAt: new Date(0),
};

export async function getSiteSettingsSafe(): Promise<SiteSettings> {
  if (!isDatabaseConfigured()) return defaultSiteSettings;
  try {
    return await getSiteSettings();
  } catch {
    return defaultSiteSettings;
  }
}

export async function getPublishedBooks(): Promise<Book[]> {
  if (!isDatabaseConfigured()) return [];
  try {
    return await prisma.book.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getApprovedReviews(): Promise<
  (Review & { book: { title: string } | null })[]
> {
  if (!isDatabaseConfigured()) return [];
  try {
    return await prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      include: { book: { select: { title: true } } },
    });
  } catch {
    return [];
  }
}

export async function getBooksForReviewPicker(): Promise<
  Pick<Book, "id" | "title">[]
> {
  if (!isDatabaseConfigured()) return [];
  try {
    return await prisma.book.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, title: true },
    });
  } catch {
    return [];
  }
}
