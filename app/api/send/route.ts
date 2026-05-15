import { NextResponse } from "next/server";
import { Resend } from "resend";
import { put } from "@vercel/blob";
import AllocationRequestEmail from "@/emails/AllocationRequest";

const resend = new Resend(process.env.RESEND_API_KEY);

/** Convert a base64 data-URL to a Buffer + detected MIME type. Returns null for invalid input. */
function dataUrlToBuffer(dataUrl: string): { buf: Buffer; size: number; mime: string } | null {
  const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) return null;
  const mime = match[1];
  const buf = Buffer.from(match[2], "base64");
  return { buf, size: buf.byteLength, mime };
}

/** Max total upload size per request (10 MB). */
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

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

    // Upload images to Vercel Blob
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    let garmentImageUrl: string | undefined;
    const logoImageUrls: (string | undefined)[] = [];

    if (blobToken) {
<<<<<<< HEAD
      // Folder name: slugified brand name + short date for uniqueness
      const slug = String(brandName)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60);
      const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const folder = `allocations/${slug}-${date}`;
=======
      const timestamp = Date.now();
>>>>>>> e1772656e7725b17156f55e8da3b712dc5fe1315
      let totalBytes = 0;

      // Upload garment screenshot
      if (typeof garmentScreenshot === "string" && garmentScreenshot.startsWith("data:image/")) {
        const result = dataUrlToBuffer(garmentScreenshot);
        if (result && result.size < MAX_UPLOAD_BYTES) {
          totalBytes += result.size;
          const ext = result.mime === "image/png" ? "png" : "jpg";
          try {
<<<<<<< HEAD
            const blob = await put(`${folder}/garment.${ext}`, result.buf, {
=======
            const blob = await put(`allocations/${timestamp}/garment.${ext}`, result.buf, {
>>>>>>> e1772656e7725b17156f55e8da3b712dc5fe1315
              access: "public",
              token: blobToken,
              contentType: result.mime,
            });
            garmentImageUrl = blob.url;
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
          const result = dataUrlToBuffer(imgData);
          if (result && totalBytes + result.size < MAX_UPLOAD_BYTES) {
            totalBytes += result.size;
            const ext = result.mime === "image/png" ? "png" : "jpg";
            try {
<<<<<<< HEAD
              const blob = await put(`${folder}/logo-${i}.${ext}`, result.buf, {
=======
              const blob = await put(`allocations/${timestamp}/logo-${i}.${ext}`, result.buf, {
>>>>>>> e1772656e7725b17156f55e8da3b712dc5fe1315
                access: "public",
                token: blobToken,
                contentType: result.mime,
              });
              logoImageUrls[i] = blob.url;
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
