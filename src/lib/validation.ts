import { z } from "zod";

const hexColor = z
  .string()
  .regex(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/, "Use a hex color like #6d28d9");

const optionalHttpUrl = z
  .string()
  .trim()
  .max(2000)
  .refine(
    (s) => s.length === 0 || /^https?:\/\/.+/i.test(s),
    "URLs must start with http:// or https://",
  );

const optionalEmail = z.union([
  z.literal(""),
  z.string().trim().email().max(200),
]);

const buyUrlField = z
  .string()
  .trim()
  .min(1, "Add a store link")
  .max(2000)
  .transform((s) => {
    if (/^https?:\/\//i.test(s)) {
      return s;
    }
    return `https://${s.replace(/^\/+/, "")}`;
  })
  .pipe(z.string().url("Use a valid link, e.g. https://…"));

export const bookSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(8000),
  buyUrl: buyUrlField,
  sortOrder: z.coerce.number().int().min(0).max(9999),
  published: z.coerce.boolean().optional(),
});

export const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(1).max(120),
  tagline: z.string().trim().max(200),
  heroTitle: z.string().trim().max(200),
  heroSubtitle: z.string().trim().max(400),
  accentHex: hexColor,
  aboutBody: z.string().trim().max(20000),
  footerNote: z.string().trim().max(500),
  contactEmailPublic: optionalEmail,
  twitterUrl: optionalHttpUrl,
  instagramUrl: optionalHttpUrl,
  goodreadsUrl: optionalHttpUrl,
  newsletterFromEmail: optionalEmail,
  newsletterReplyTo: optionalEmail,
  wordpressBlogUrl: optionalHttpUrl,
});

export const newsletterComposeSchema = z.object({
  subject: z.string().trim().min(1).max(200),
  bodyText: z.string().trim().min(1).max(50000),
});

export const subscriberEmailSchema = z.object({
  email: z.string().trim().email().max(320),
});

export const reviewSubmitSchema = z.object({
  authorName: z.string().trim().min(1).max(80),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().trim().min(10).max(2000),
  bookId: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.string().trim().max(40).optional(),
  ),
  website: z
    .string()
    .optional()
    .refine((s) => !s || s.length === 0, { message: "Invalid submission" }),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  nextPassword: z.string().min(10).max(200),
});
