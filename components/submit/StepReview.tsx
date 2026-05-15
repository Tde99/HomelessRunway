import { memo } from "react";
import { ZONE_DEFS } from "@/lib/constants";

interface LogoState {
  id: string;
  file: File | null;
  preview: string;
  selectedZones: string[];
  label: string;
}

function getZoneLabel(id: string): string {
  return ZONE_DEFS.find((z) => z.id === id)?.label ?? id;
}

interface StepReviewProps {
  selectedPackage: string;
  packagePrice: number;
  logos: LogoState[];
  brandName: string;
  website: string;
  industry: string;
  contactName: string;
  email: string;
  phone: string;
  restrictions: string;
  notes: string;
  reviewNotes: string;
  acks: boolean[];
  onToggleAck: (idx: number) => void;
  sending: boolean;
  sendError: string;
  onBack: () => void;
  canAdvance: boolean;
}

export default memo(function StepReview({
  selectedPackage,
  packagePrice,
  logos,
  brandName,
  website,
  industry,
  contactName,
  email,
  phone,
  restrictions,
  notes,
  reviewNotes,
  acks,
  onToggleAck,
  sending,
  sendError,
  onBack,
  canAdvance,
}: StepReviewProps) {
  return (
    <section className="sb-step" aria-labelledby="step-review-title">
      <div className="container">
        <div className="sb-step-hdr">
          <span className="sb-step-hdr-num">05</span>
          <h2 className="sb-step-hdr-title" id="step-review-title">
            Review &amp; <em>Submit</em>
          </h2>
        </div>
        <p className="sb-note">
          Confirm your allocation request details, acknowledge submission terms,
          and submit for review.
        </p>
        <div className="sb-review-summary">
          <div className="sb-review-row">
            <span className="sb-review-key">Package</span>
            <span className="sb-review-val">
              {selectedPackage}
              {packagePrice > 0 && <> — ${packagePrice.toLocaleString()} USD</>}
            </span>
          </div>
          <div className="sb-review-row">
            <span className="sb-review-key">Logos</span>
            <span className="sb-review-val">
              {logos
                .filter((l) => l.file)
                .map((l) => `${l.label}: ${l.file?.name} (${l.selectedZones.map(getZoneLabel).join(", ")})`)
                .join("; ")}
            </span>
          </div>
          <div className="sb-review-row">
            <span className="sb-review-key">Brand</span>
            <span className="sb-review-val">{brandName}</span>
          </div>
          <div className="sb-review-row">
            <span className="sb-review-key">Website</span>
            <span className="sb-review-val">{website || "—"}</span>
          </div>
          <div className="sb-review-row">
            <span className="sb-review-key">Industry</span>
            <span className="sb-review-val">{industry}</span>
          </div>
          <div className="sb-review-row">
            <span className="sb-review-key">Contact</span>
            <span className="sb-review-val">
              {contactName} — {email}
              {phone && <> · {phone}</>}
            </span>
          </div>
          {restrictions && (
            <div className="sb-review-row">
              <span className="sb-review-key">Restrictions</span>
              <span className="sb-review-val">{restrictions}</span>
            </div>
          )}
          {(notes || reviewNotes) && (
            <div className="sb-review-row">
              <span className="sb-review-key">Notes</span>
              <span className="sb-review-val">
                {[notes, reviewNotes].filter(Boolean).join(" | ")}
              </span>
            </div>
          )}
        </div>

        <div className="sb-acks">
          <p className="sb-acks-title">Please acknowledge the following</p>
          {[
            "Submission does not guarantee placement.",
            "Payment is collected only after approval.",
            "HOMELESS RUNWAY may request a replacement or simplified logo.",
            "Final zone placement is subject to garment-level review.",
            "20% of allocation revenue is reserved for participant support.",
          ].map((text, i) => (
            <label className="sb-ack-row" key={i}>
              <input
                type="checkbox"
                className="sb-ack-check"
                checked={acks[i]}
                onChange={() => onToggleAck(i)}
              />
              <span className="sb-ack-text">{text}</span>
            </label>
          ))}
        </div>

        <div className="sb-step-nav">
          <button
            type="button"
            className="btn btn-ghost sb-back"
            onClick={onBack}
          >
            Back
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-large sb-next"
            disabled={!canAdvance || sending}
          >
            {sending ? "Submitting…" : "Submit Allocation Request"}
          </button>
        </div>
        {sendError && (
          <p className="sb-error" role="alert">
            {sendError}
          </p>
        )}
      </div>
    </section>
  );
});
