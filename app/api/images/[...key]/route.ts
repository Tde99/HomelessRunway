import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key } = await params;
  const blobKey = key.join("/");

  const siteId = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;
  if (!siteId || !token) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const store = getStore({ name: "allocations", siteID: siteId, token });

  try {
    const meta = await store.getMetadata(blobKey);
    if (!meta) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data = await store.get(blobKey, { type: "arrayBuffer" });
    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const contentType = typeof meta.metadata?.contentType === "string"
      ? meta.metadata.contentType
      : "image/jpeg";

    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
