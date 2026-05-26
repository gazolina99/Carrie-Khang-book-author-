"use server";

import { revalidatePath } from "next/cache";
import { deleteBookCover, saveBookCover } from "@/lib/book-cover-storage";
import { getDashboardUser } from "@/lib/dashboard-user";
import { prisma } from "@/lib/prisma";
import { bookSchema } from "@/lib/validation";
import { upsertWordpressBook } from "@/lib/wordpress-sync";

const MAX_BYTES = 4 * 1024 * 1024;

function extFromMime(mime: string) {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return null;
}

function extFromFileName(name: string): string | null {
  const m = /\.([a-z0-9]+)$/i.exec(name.trim());
  if (!m) return null;
  const e = m[1].toLowerCase();
  if (e === "jpg" || e === "jpeg") return "jpg";
  if (e === "png") return "png";
  if (e === "webp") return "webp";
  return null;
}

function resolveImageExt(file: File): { ext: string } | { error: string } {
  const mime = (file.type || "").toLowerCase();
  const fromMime = extFromMime(mime);
  if (fromMime) {
    return { ext: fromMime };
  }
  const fromName = extFromFileName(file.name);
  if (fromName) {
    return { ext: fromName };
  }
  if (mime && mime !== "application/octet-stream" && !mime.startsWith("image/")) {
    return { error: "Cover must be JPG, PNG, or WebP." };
  }
  return {
    error:
      "Could not detect image type. Save the file as .jpg, .png, or .webp (or rename it with that extension).",
  };
}

export async function saveBook(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  try {
    const user = await getDashboardUser();
    if (!user) {
      return { error: "Sign in to manage books." };
    }

    const id = (formData.get("id") as string | null)?.trim() || undefined;
    const published = formData.has("published");
    const raw = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      buyUrl: String(formData.get("buyUrl") ?? ""),
      sortOrder: String(formData.get("sortOrder") ?? "0"),
      published,
    };

    const parsed = bookSchema.safeParse(raw);
    if (!parsed.success) {
      return { error: parsed.error.issues.map((i) => i.message).join(", ") };
    }

    const file = formData.get("cover") as File | null;
    let coverPath: string | undefined;

    if (file && file.size > 0) {
      if (file.size > MAX_BYTES) {
        return { error: "Cover image must be 4MB or smaller." };
      }
      const resolved = resolveImageExt(file);
      if ("error" in resolved) {
        return { error: resolved.error };
      }
      const mime = (file.type || "").toLowerCase();
      if (
        mime &&
        mime !== "application/octet-stream" &&
        !mime.startsWith("image/")
      ) {
        return { error: "Cover must be an image file (JPG, PNG, or WebP)." };
      }

      const buf = Buffer.from(await file.arrayBuffer());
      const name = `${id ?? "new"}-${Date.now()}.${resolved.ext}`;
      const contentType =
        mime && mime.startsWith("image/") ? mime : `image/${resolved.ext}`;
      coverPath = await saveBookCover(buf, name, contentType);
    }

    let savedId = id;
    if (id) {
      const existing = await prisma.book.findUnique({ where: { id } });
      if (!existing) {
        return { error: "Book not found." };
      }
      const updated = await prisma.book.update({
        where: { id },
        data: {
          title: parsed.data.title,
          description: parsed.data.description,
          buyUrl: parsed.data.buyUrl,
          sortOrder: parsed.data.sortOrder,
          published: parsed.data.published ?? true,
          ...(coverPath ? { coverPath } : {}),
        },
      });
      savedId = updated.id;
    } else {
      const created = await prisma.book.create({
        data: {
          title: parsed.data.title,
          description: parsed.data.description,
          buyUrl: parsed.data.buyUrl,
          sortOrder: parsed.data.sortOrder,
          published: parsed.data.published ?? true,
          coverPath: coverPath ?? null,
        },
      });
      savedId = created.id;
    }

    if (savedId) {
      try {
        await upsertWordpressBook({
          id: savedId,
          title: parsed.data.title,
          description: parsed.data.description,
          sortOrder: parsed.data.sortOrder,
          published: parsed.data.published ?? true,
        });
      } catch {
        // Non-blocking: local save should still succeed if WP sync is unavailable.
      }
    }

    revalidatePath("/");
    revalidatePath("/books");
    revalidatePath("/dashboard/books");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      error: `Save failed: ${msg}.`,
    };
  }
}

export async function deleteBook(formData: FormData): Promise<void> {
  const user = await getDashboardUser();
  if (!user) {
    return;
  }
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return;
  }
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) {
    return;
  }
  await deleteBookCover(book.coverPath);
  await prisma.book.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/books");
  revalidatePath("/dashboard/books");
}
