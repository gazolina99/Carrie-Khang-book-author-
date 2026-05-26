import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const COVERS_STORE = "book-covers";

function isNetlifyRuntime() {
  return Boolean(process.env.NETLIFY || process.env.NETLIFY_DEV);
}

export function bookCoverPublicPath(fileName: string) {
  if (isNetlifyRuntime()) {
    return `/api/covers/${encodeURIComponent(fileName)}`;
  }
  return `/uploads/books/${fileName}`;
}

function localUploadDir() {
  return path.join(process.cwd(), "public", "uploads", "books");
}

async function saveToNetlifyBlobs(
  buffer: Buffer,
  fileName: string,
  contentType: string,
) {
  const { getStore } = await import("@netlify/blobs");
  const store = getStore({ name: COVERS_STORE, consistency: "strong" });
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
  await store.set(fileName, arrayBuffer, {
    metadata: { contentType },
  });
}

export async function saveBookCover(
  buffer: Buffer,
  fileName: string,
  contentType: string,
): Promise<string> {
  if (isNetlifyRuntime()) {
    await saveToNetlifyBlobs(buffer, fileName, contentType);
    return bookCoverPublicPath(fileName);
  }

  const dir = localUploadDir();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), buffer);
  return bookCoverPublicPath(fileName);
}

function coverFileName(coverPath: string) {
  if (coverPath.startsWith("/api/covers/")) {
    return decodeURIComponent(coverPath.replace("/api/covers/", ""));
  }
  if (coverPath.startsWith("/uploads/")) {
    return path.basename(coverPath);
  }
  return null;
}

export async function deleteBookCover(coverPath: string | null | undefined) {
  if (!coverPath) return;

  const fileName = coverFileName(coverPath);
  if (!fileName) return;

  if (isNetlifyRuntime()) {
    try {
      const { getStore } = await import("@netlify/blobs");
      const store = getStore({ name: COVERS_STORE, consistency: "strong" });
      await store.delete(fileName);
    } catch {
      /* ignore */
    }
    return;
  }

  try {
    await unlink(path.join(localUploadDir(), fileName));
  } catch {
    /* ignore */
  }
}
