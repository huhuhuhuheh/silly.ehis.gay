import fs from "node:fs/promises";
import path from "node:path";
import { randomInt } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

export async function GET() {
  const publicDir = path.join(process.cwd(), "public");
  const entries = await fs.readdir(publicDir, { withFileTypes: true });

  const images = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(name));

  if (images.length === 0) {
    return new Response("No images :(", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const image = images[randomInt(images.length)];
  const filePath = path.join(publicDir, image);
  const file = await fs.readFile(filePath);
  const ext = path.extname(image).toLowerCase();
  const contentType = MIME_TYPES[ext] ?? "application/octet-stream";

  return new Response(file, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}