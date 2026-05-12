import { memo } from "react";
import dynamic from "next/dynamic";
import { ZONE_DEFS } from "@/lib/constants";

const GarmentViewer = dynamic(() => import("@/components/GarmentViewer"), {
  ssr: false,
  loading: () => <div className="sb-garment-loading">Loading 3D viewer…</div>,
});

function getZoneLabel(id: string): string {
  return ZONE_DEFS.find((z) => z.id === id)?.label ?? id;
}

interface StepProductProps {
  selectedPackage: string;
  packagePrice: number;
  selectedZones: string[];
  primaryLogoName: string | undefined;
  altLogoName: string | undefined;
  reviewNotes: string;
  onReviewNotesChange: (val: string) => void;
  onViewerZoneToggle: (zoneId: string, selected: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export default memo(function StepProduct({
  selectedPackage,
  packagePrice,
  selectedZones,
  primaryLogoName,
  altLogoName,
  reviewNotes,
  onReviewNotesChange,
  onViewerZoneToggle,
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
          Preview how your logo will appear on the garment. Rotate the 3D model
          or use the view buttons below.
        </p>

        <div className="sb-review-product-grid">
          <div className="sb-product-preview">
            <GarmentViewer onZoneToggle={onViewerZoneToggle} />
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
                  {selectedZones.map(getZoneLabel).join(", ")}
                </span>
              </div>
              <div className="sb-review-row">
                <span className="sb-review-key">Primary Logo</span>
                <span className="sb-review-val">{primaryLogoName ?? "—"}</span>
              </div>
              <div className="sb-review-row">
                <span className="sb-review-key">Alternate Logo</span>
                <span className="sb-review-val">{altLogoName ?? "None"}</span>
              </div>
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
