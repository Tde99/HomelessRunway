import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getStore } from "@netlify/blobs";
import AllocationRequestEmail from "@/emails/AllocationRequest";

const resend = new Resend(process.env.RESEND_API_KEY);

/** Convert a base64 data-URL to an ArrayBuffer. Returns null for invalid input. */
function dataUrlToArrayBuffer(dataUrl: string): { buf: ArrayBuffer; size: number } | null {
  const match = dataUrl.match(/^data:image\/\w+;base64,(.+)$/);
  if (!match) return null;
  const nodeBuf = Buffer.from(match[1], "base64");
  return {
    buf: nodeBuf.buffer.slice(nodeBuf.byteOffset, nodeBuf.byteOffset + nodeBuf.byteLength),
    size: nodeBuf.byteLength,
  };
}

/** Max total upload size per request (10 MB). */
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function getAllocationStore() {
  return getStore({
    name: "allocations",
    siteID: process.env.NETLIFY_SITE_ID!,
    token: process.env.NETLIFY_API_TOKEN!,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      brandName,
      contactName,
      email,
      phone,
      website,
      industry,
      selectedPackage,
      packagePrice,
      logos,
      garmentScreenshot,
      restrictions,
      notes,
      reviewNotes,
    } = body;

    // Build selectedZones from logos for backward compat
    const selectedZones: string[] = Array.isArray(logos)
      ? logos.flatMap((l: { selectedZones?: string[] }) =>
          Array.isArray(l.selectedZones) ? l.selectedZones : [],
        )
      : Array.isArray(body.selectedZones)
        ? body.selectedZones
        : [];

    // Sanitise logos into a clean array
    const sanitisedLogos: { label: string; fileName: string; selectedZones: string[] }[] =
      Array.isArray(logos)
        ? logos
            .filter((l: unknown) => typeof l === "object" && l !== null)
            .map((l: { label?: string; fileName?: string; selectedZones?: string[] }) => ({
              label: typeof l.label === "string" ? l.label.slice(0, 100) : "Untitled",
              fileName: typeof l.fileName === "string" ? l.fileName.slice(0, 200) : "",
              selectedZones: Array.isArray(l.selectedZones)
                ? l.selectedZones.filter((z): z is string => typeof z === "string").map((z) => z.slice(0, 100))
                : [],
            }))
        : [];

    // Basic validation
    if (!brandName || !contactName || !email || !industry || !selectedPackage) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    // Upload images to Netlify Blobs
    const siteId = process.env.NETLIFY_SITE_ID;
    const apiToken = process.env.NETLIFY_API_TOKEN;
    let garmentImageUrl: string | undefined;
    const logoImageUrls: (string | undefined)[] = [];

    if (siteId && apiToken) {
      const store = getAllocationStore();
      const timestamp = Date.now();
      const uploadedAt = new Date().toISOString();
      let totalBytes = 0;

      // Derive base URL for image serving endpoint
      const origin = new URL(req.url).origin;

      // Upload garment screenshot
      if (typeof garmentScreenshot === "string" && garmentScreenshot.startsWith("data:image/")) {
        const result = dataUrlToArrayBuffer(garmentScreenshot);
        if (result && result.size < MAX_UPLOAD_BYTES) {
          totalBytes += result.size;
          const key = `${timestamp}/garment.jpg`;
          try {
            await store.set(key, result.buf, {
              metadata: { contentType: "image/jpeg", uploadedAt },
            });
            garmentImageUrl = `${origin}/api/images/${key}`;
          } catch (e) {
            console.error("Blob upload (garment) failed:", e);
          }
        }
      }

      // Upload each logo image
      for (let i = 0; i < sanitisedLogos.length; i++) {
        const raw = Array.isArray(logos) ? logos[i] : undefined;
        const imgData = raw?.imageData;
        if (typeof imgData === "string" && imgData.startsWith("data:image/")) {
          const result = dataUrlToArrayBuffer(imgData);
          if (result && totalBytes + result.size < MAX_UPLOAD_BYTES) {
            totalBytes += result.size;
            const key = `${timestamp}/logo-${i}.jpg`;
            try {
              await store.set(key, result.buf, {
                metadata: { contentType: "image/jpeg", uploadedAt },
              });
              logoImageUrls[i] = `${origin}/api/images/${key}`;
            } catch (e) {
              console.error(`Blob upload (logo ${i}) failed:`, e);
            }
          }
        }
        if (!logoImageUrls[i]) logoImageUrls[i] = undefined;
      }
    }

    // Attach URLs to sanitised logos
    const logosWithImages = sanitisedLogos.map((l, i) => ({
      ...l,
      imageUrl: logoImageUrls[i],
    }));

    const { data, error } = await resend.emails.send({
      from: "HOMELESS RUNWAY <onboarding@resend.dev>",
      to: [process.env.NOTIFY_EMAIL ?? "partners@homelessrunway.com"],
      replyTo: email,
      subject: `Allocation Request — ${brandName} (${selectedPackage})`,
      react: AllocationRequestEmail({
        brandName,
        contactName,
        email,
        phone,
        website,
        industry,
        selectedPackage,
        packagePrice,
        selectedZones,
        logos: logosWithImages,
        garmentImageUrl,
        restrictions,
        notes,
        reviewNotes,
      }),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Email route error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
