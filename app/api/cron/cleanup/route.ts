import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";

const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export async function GET(req: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const siteId = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;
  if (!siteId || !token) {
    return NextResponse.json({ error: "Netlify credentials not configured" }, { status: 500 });
  }

  const store = getStore({ name: "allocations", siteID: siteId, token });
  const cutoff = Date.now() - MAX_AGE_MS;
  let deleted = 0;

  const { blobs } = await store.list();

  for (const blob of blobs) {
    const meta = await store.getMetadata(blob.key);
    const uploadedAt = meta?.metadata?.uploadedAt;
    if (typeof uploadedAt === "string" && new Date(uploadedAt).getTime() < cutoff) {
      await store.delete(blob.key);
      deleted++;
    }
  }

  return NextResponse.json({ deleted });
}
