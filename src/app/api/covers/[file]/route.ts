import { getStore } from "@netlify/blobs";
import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

const COVERS_STORE = "book-covers";

export async function GET(
  _request: Request,
  context: { params: Promise<{ file: string }> },
) {
  const { file } = await context.params;
  const fileName = decodeURIComponent(file);

  if (process.env.NETLIFY || process.env.NETLIFY_DEV) {
    const store = getStore({ name: COVERS_STORE, consistency: "strong" });
    const entry = await store.getWithMetadata(fileName, { type: "arrayBuffer" });
    if (!entry?.data) {
      return new NextResponse("Not found", { status: 404 });
    }
    const contentType =
      (entry.metadata?.contentType as string | undefined) || "image/jpeg";
    return new NextResponse(entry.data as ArrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  const diskPath = path.join(
    process.cwd(),
    "public",
    "uploads",
    "books",
    fileName,
  );
  try {
    const buf = await readFile(diskPath);
    const ext = path.extname(fileName).toLowerCase();
    const type =
      ext === ".png"
        ? "image/png"
        : ext === ".webp"
          ? "image/webp"
          : "image/jpeg";
    return new NextResponse(buf, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
