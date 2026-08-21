import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const uploadDir = path.join(root, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

function r2Ready() {
  return Boolean(
    process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME &&
      process.env.R2_ENDPOINT
  );
}

export async function saveBill({ buffer, filename, mime }) {
  const safe = String(filename || "bill.bin").replace(/[^\w.\-]+/g, "_");
  const key = `${Date.now()}-${safe}`;

  if (r2Ready()) {
    try {
      const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
      const client = new S3Client({
        region: "auto",
        endpoint: process.env.R2_ENDPOINT,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        },
      });
      await client.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: mime || "application/octet-stream",
        })
      );
      const base = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");
      return { url: base ? `${base}/${key}` : key, storage: "r2" };
    } catch (e) {
      console.error("R2 upload failed, falling back to disk", e.message);
    }
  }

  const dest = path.join(uploadDir, key);
  fs.writeFileSync(dest, buffer);
  return { url: `/uploads/${key}`, storage: "local" };
}

export { uploadDir };
