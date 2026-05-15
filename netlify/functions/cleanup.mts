import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";

const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export default async function handler() {
  const store = getStore("allocations");
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

  console.log(`Cleanup complete: deleted ${deleted} blobs`);
}

export const config: Config = {
  schedule: "0 3 * * *",
};
