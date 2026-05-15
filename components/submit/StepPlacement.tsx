import { memo, useCallback, ChangeEvent, useRef } from "react";
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

interface StepPlacementProps {
  selectedPackage: string;
  placements: number;
  allowedZones: string[];
  logos: LogoState[];
  activeLogoId: string;
  onSetActiveLogo: (id: string) => void;
  onUpdateLogo: (id: string, updates: Partial<LogoState>) => void;
  onAddLogo: () => void;
  onRemoveLogo: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
  canAdvance: boolean;
}

export default memo(function StepPlacement({
  selectedPackage,
  placements,
  allowedZones,
  logos,
  activeLogoId,
  onSetActiveLogo,
  onUpdateLogo,
  onAddLogo,
  onRemoveLogo,
  onNext,
  onBack,
  canAdvance,
}: StepPlacementProps) {
  const logoRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const activeLogo = logos.find((l) => l.id === activeLogoId) || logos[0];

  const preventDef = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFile = useCallback(
    (logoId: string, e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10 MB limit.");
        return;
      }
      const logo = logos.find((l) => l.id === logoId);
      if (logo?.preview) URL.revokeObjectURL(logo.preview);
      const preview = URL.createObjectURL(file);
      onUpdateLogo(logoId, { file, preview });
    },
    [logos, onUpdateLogo],
  );

  const clearFile = useCallback(
    (logoId: string) => {
      const logo = logos.find((l) => l.id === logoId);
      if (logo?.preview) URL.revokeObjectURL(logo.preview);
      onUpdateLogo(logoId, { file: null, preview: "" });
      // Reset input
      const ref = logoRefs.current[logoId];
      if (ref) ref.value = "";
    },
    [logos, onUpdateLogo],
  );

  const handleDrop = useCallback(
    (logoId: string, e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10 MB limit.");
        return;
      }
      const logo = logos.find((l) => l.id === logoId);
      if (logo?.preview) URL.revokeObjectURL(logo.preview);
      onUpdateLogo(logoId, { file, preview: URL.createObjectURL(file) });
    },
    [logos, onUpdateLogo],
  );

  const toggleZone = useCallback(
    (zoneId: string) => {
      const currentZones = activeLogo.selectedZones;
      const newZones = currentZones.includes(zoneId)
        ? currentZones.filter((z) => z !== zoneId)
        : [...currentZones, zoneId];
      onUpdateLogo(activeLogoId, { selectedZones: newZones });
    },
    [activeLogo, activeLogoId, onUpdateLogo],
  );

  return (
    <section className="sb-step" aria-labelledby="step-place-title">
      <div className="container">
        <div className="sb-step-hdr">
          <span className="sb-step-hdr-num">02</span>
          <h2 className="sb-step-hdr-title" id="step-place-title">
            Placement &amp; <em>Logo</em>
          </h2>
        </div>
        <p className="sb-note">
          Select preferred zones on the garment and upload your logo.
          {selectedPackage && (
            <>
              {" "}
              Package: <strong>{selectedPackage}</strong> — {placements}{" "}
              placement{placements > 1 ? "s" : ""}.
            </>
          )}
        </p>

        <div className="sb-placement-logo-grid">
          <div className="sb-placement-col">
            <GarmentViewer
              logos={logos}
<<<<<<< HEAD
              allowedZones={allowedZones}
              activeZones={activeLogo.selectedZones}
              onZoneToggle={(zoneId, selected) => {
                if (!allowedZones.includes(zoneId)) return;
                toggleZone(zoneId);
              }}
=======
              onZoneToggle={() => {}}
>>>>>>> 464410e7440f1eccaa730e9c869ad1798ad60385
            />
            <div className="sb-zone-readout">
              <span className="sb-zone-readout-lbl">Selected Zones for {activeLogo.label}</span>
              <span className="sb-zone-readout-val">
                {activeLogo.selectedZones.length > 0
                  ? activeLogo.selectedZones.map(getZoneLabel).join(", ")
                  : "None — click zones on the garment above"}
              </span>
            </div>
            <p className="sb-note sb-note--sm">Available Zones</p>
            <div className="sb-zone-btn-row">
              {ZONE_DEFS.map((z) => {
                const allowed = allowedZones.includes(z.id);
                const active = activeLogo.selectedZones.includes(z.id);
                return (
                  <button
                    key={z.id}
                    type="button"
                    className={`sb-zone-btn${active ? " is-active" : ""}${!allowed ? " is-disabled" : ""}`}
                    onClick={() => toggleZone(z.id)}
                    disabled={!allowed}
                    aria-pressed={active}
                  >
                    {z.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sb-logo-side">
            <div className="sb-logo-side-hdr">
              <span className="sb-logo-side-title">Logos</span>
              <span className="sb-logo-side-sub">
                Transparent PNG or SVG · Max 10 MB
              </span>
            </div>

            {logos.map((logo) => (
              <div key={logo.id} className="sb-logo-item">
                <div className="sb-logo-header">
                  <button
                    type="button"
                    className={`sb-logo-select${logo.id === activeLogoId ? " is-active" : ""}`}
                    onClick={() => onSetActiveLogo(logo.id)}
                  >
                    {logo.label}
                  </button>
                  {logos.length > 1 && (
                    <button
                      type="button"
                      className="sb-logo-remove"
                      onClick={() => onRemoveLogo(logo.id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="sb-upload-field">
                  <div
                    className="sb-upload-zone"
                    onDragOver={preventDef}
                    onDragEnter={preventDef}
                    onDrop={(e) => handleDrop(logo.id, e)}
<<<<<<< HEAD
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        logoRefs.current[logo.id]?.click();
                      }
                    }}
=======
                    onClick={() => logoRefs.current[logo.id]?.click()}
>>>>>>> 464410e7440f1eccaa730e9c869ad1798ad60385
                    role="button"
                    tabIndex={0}
                    aria-label={`Upload ${logo.label}`}
                  >
                    {logo.preview ? (
                      <div className="sb-upload-preview">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={logo.preview}
                          alt={`${logo.label} preview`}
                          className="sb-upload-preview-img"
                        />
                        <span className="sb-upload-preview-name">
                          {logo.file?.name}
                        </span>
                        <button
                          type="button"
                          className="sb-upload-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearFile(logo.id);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="sb-upload-placeholder">
                        <span className="sb-upload-arrow">↑</span>
                        <span className="sb-upload-placeholder-text">
                          Drag &amp; drop or{" "}
                          <span className="sb-upload-link">browse</span>
                        </span>
                        <span className="sb-upload-formats">
                          PNG · SVG · PDF · AI · EPS
                        </span>
                      </div>
                    )}
                    <input
                      ref={(el) => {
                        logoRefs.current[logo.id] = el;
                      }}
                      type="file"
                      accept=".png,.svg,.pdf,.ai,.eps"
                      className="sb-upload-input"
                      onChange={(e) => handleFile(logo.id, e)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="sb-add-logo" onClick={onAddLogo}>
              + Add Another Logo
            </button>

            <div className="sb-logo-reqs">
              <p className="sb-logo-reqs-title">Logo Requirements</p>
              <ul className="sb-logo-reqs-list">
                <li>Production-ready vector or high-res raster</li>
                <li>Transparent background preferred</li>
                <li>HOMELESS RUNWAY may request a simplified version</li>
              </ul>
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
            disabled={!canAdvance}
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
});
