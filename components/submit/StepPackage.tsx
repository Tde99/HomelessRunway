import { memo } from "react";
import { PACKAGES } from "@/lib/constants";
import type { PackageData } from "@/types";

interface StepPackageProps {
  selectedPackage: string;
  onSelectPackage: (name: string) => void;
  onNext: () => void;
  canAdvance: boolean;
}

export default memo(function StepPackage({
  selectedPackage,
  onSelectPackage,
  onNext,
  canAdvance,
}: StepPackageProps) {
  return (
    <section className="sb-step" aria-labelledby="step-pkg-title">
      <div className="container">
        <div className="sb-step-hdr">
          <span className="sb-step-hdr-num">01</span>
          <h2 className="sb-step-hdr-title" id="step-pkg-title">
            Select <em>Package</em>
          </h2>
        </div>
        <p className="sb-note">
          Choose one package tier. Placements are distributed across the
          100-asset Series 001 fleet.
        </p>
        <div className="sb-pkg-grid">
          {PACKAGES.map((p: PackageData) => (
            <button
              key={p.name}
              type="button"
              className={`sb-pkg-card${
                selectedPackage === p.name ? " is-selected" : ""
              }${p.badgeType === "recommended" ? " sb-pkg-card--rec" : ""}${
                p.badgeType === "limited" ? " sb-pkg-card--lim" : ""
              }`}
              onClick={() => onSelectPackage(p.name)}
              aria-pressed={selectedPackage === p.name}
            >
              {p.badge && (
                <span
                  className={`sb-pkg-badge${
                    p.badgeType === "limited" ? " sb-pkg-badge--lim" : ""
                  }`}
                >
                  {p.badge}
                </span>
              )}
              <div className="sb-pkg-card-hdr">
                <span className="sb-pkg-name">{p.name}</span>
                <span className="sb-pkg-price">
                  ${p.price.toLocaleString()}
                </span>
              </div>
              <span className="sb-pkg-zones">{p.zones}</span>
              <span className="sb-pkg-dist">
                {p.placements} placement{p.placements > 1 ? "s" : ""} ·{" "}
                {p.assets} assets
              </span>
              <span className="sb-pkg-check">✓</span>
            </button>
          ))}
        </div>
        <div className="sb-step-nav">
          <button
            type="button"
            className="btn btn-primary sb-next"
            onClick={onNext}
            disabled={!canAdvance}
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
});
