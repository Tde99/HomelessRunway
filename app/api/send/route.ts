import { NextResponse } from "next/server";
import { Resend } from "resend";
import AllocationRequestEmail from "@/emails/AllocationRequest";

const resend = new Resend(process.env.RESEND_API_KEY);

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
      selectedZones,
      restrictions,
      notes,
      reviewNotes,
    } = body;

    // Basic validation
    if (!brandName || !contactName || !email || !industry || !selectedPackage) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

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
