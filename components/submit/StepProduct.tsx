import { memo } from "react";
import { ZONE_DEFS } from "@/lib/constants";
import GarmentViewer from "@/components/GarmentViewer";

function getZoneLabel(id: string): string {
  return ZONE_DEFS.find((z) => z.id === id)?.label ?? id;
}

interface LogoState {
  id: string;
  file: File | null;
  preview: string;
  selectedZones: string[];
  label: string;
}

interface StepProductProps {
  selectedPackage: string;
  packagePrice: number;
  logos: LogoState[];
  reviewNotes: string;
  onReviewNotesChange: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default memo(function StepProduct({
  selectedPackage,
  packagePrice,
  logos,
  reviewNotes,
  onReviewNotesChange,
  onNext,
  onBack,
}: StepProductProps) {
  return (
    <section className="sb-step" aria-labelledby="step-product-title">
      <div className="container">
        <div className="sb-step-hdr">
          <span className="sb-step-hdr-num">03</span>
          <h2 className="sb-step-hdr-title" id="step-product-title">
            Review <em>Product</em>
          </h2>
        </div>
        <p className="sb-note">
          Preview how your logo will appear on the garment. Use the view buttons below to switch views.
        </p>

        <div className="sb-review-product-grid">
          <div className="sb-product-preview">
            <GarmentViewer
              logos={logos}
              readOnly
            />
          </div>

          <div className="sb-product-summary">
            <h3 className="sb-product-summary-title">Product Summary</h3>
            <div className="sb-review-summary">
              <div className="sb-review-row">
                <span className="sb-review-key">Package</span>
                <span className="sb-review-val">{selectedPackage}</span>
              </div>
              <div className="sb-review-row">
                <span className="sb-review-key">Price</span>
                <span className="sb-review-val">
                  {packagePrice ? `$${packagePrice.toLocaleString()} USD` : "—"}
                </span>
              </div>
              <div className="sb-review-row">
                <span className="sb-review-key">Zones</span>
                <span className="sb-review-val">
                  {logos.flatMap((l) => l.selectedZones).map(getZoneLabel).join(", ")}
                </span>
              </div>
              {logos.map((logo) => (
                <div key={logo.id} className="sb-review-row">
                  <span className="sb-review-key">{logo.label}</span>
                  <span className="sb-review-val">{logo.file?.name ?? "—"}</span>
                </div>
              ))}
            </div>

            <div className="sb-product-notes">
              <label className="sb-form-lbl" htmlFor="review-notes">
                Notes for Review <span className="sb-form-opt">Optional</span>
              </label>
              <textarea
                id="review-notes"
                className="sb-form-textarea"
                rows={3}
                placeholder="Any placement preferences or instructions…"
                value={reviewNotes}
                onChange={(e) => onReviewNotesChange(e.target.value)}
              />
            </div>
          </div>
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
            type="button"
            className="btn btn-primary sb-next"
            onClick={onNext}
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
});
