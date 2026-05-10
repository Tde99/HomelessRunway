import type { Metadata } from "next";
import SubmitForm from "@/components/submit/SubmitForm";

export const metadata: Metadata = {
  title: "Submit Allocation Request — HOMELESS RUNWAY Series 001",
  description:
    "Configure and submit a Series 001 partner allocation request. Select package, indicate placement preferences, upload logo, submit for review.",
};

export default function SubmitPage() {
  return (
    <main id="submit-main">
      <SubmitForm />
    </main>
  );
}
