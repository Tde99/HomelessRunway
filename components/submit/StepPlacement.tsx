import { memo, useCallback, ChangeEvent } from "react";
import dynamic from "next/dynamic";
import { ZONE_DEFS } from "@/lib/constants";

const GarmentViewer = dynamic(() => import("@/components/GarmentViewer"), {
  ssr: false,
  loading: () => <div className="sb-garment-loading">Loading 3D viewer…</div>,
});

function getZoneLabel(id: string): string {
  return ZONE_DEFS.find((z) => z.id === id)?.label ?? id;
}

interface FileState {
  file: File | null;
  preview: string;
}

interface StepPlacementProps {
  selectedPackage: string;
  placements: number;
  selectedZones: string[];
  allowedZones: string[];
  primaryLogo: FileState;
  altLogo: FileState;
  onToggleZone: (zoneId: string) => void;
  onViewerZoneToggle: (zoneId: string, selected: boolean) => void;
  onSetPrimaryLogo: (s: FileState) => void;
  onSetAltLogo: (s: FileState) => void;
  primaryInputRef: React.RefObject<HTMLInputElement | null>;
  altInputRef: React.RefObject<HTMLInputElement | null>;
  onNext: () => void;
  onBack: () => void;
  canAdvance: boolean;
}

export default memo(function StepPlacement({
  selectedPackage,
  placements,
  selectedZones,
  allowedZones,
  primaryLogo,
  altLogo,
  onToggleZone,
  onViewerZoneToggle,
  onSetPrimaryLogo,
  onSetAltLogo,
  primaryInputRef,
  altInputRef,
  onNext,
  onBack,
  canAdvance,
}: StepPlacementProps) {
  const preventDef = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFile = useCallback(
    (
      e: ChangeEvent<HTMLInputElement>,
      setter: (s: FileState) => void,
      currentPreview: string,
    ) => {
      const file = e.target.files?.[0] ?? null;
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10 MB limit.");
        return;
      }
      if (currentPreview) URL.revokeObjectURL(currentPreview);
      const preview = URL.createObjectURL(file);
      setter({ file, preview });
    },
    [],
  );

  const clearFile = useCallback(
    (
      setter: (s: FileState) => void,
      inputRef: React.RefObject<HTMLInputElement | null>,
      currentPreview: string,
    ) => {
      if (currentPreview) URL.revokeObjectURL(currentPreview);
      setter({ file: null, preview: "" });
      if (inputRef.current) inputRef.current.value = "";
    },
    [],
  );

  const handleDrop = useCallback(
    (
      e: React.DragEvent,
      setter: (s: FileState) => void,
      currentPreview: string,
    ) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10 MB limit.");
        return;
      }
      if (currentPreview) URL.revokeObjectURL(currentPreview);
      setter({ file, preview: URL.createObjectURL(file) });
    },
    [],
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
            <div className="sb-garment">
              <GarmentViewer onZoneToggle={onViewerZoneToggle} />
            </div>
            <div className="sb-zone-readout">
              <span className="sb-zone-readout-lbl">Selected Zones</span>
              <span className="sb-zone-readout-val">
                {selectedZones.length > 0
                  ? selectedZones.map(getZoneLabel).join(", ")
                  : "None — click zones on the garment above"}
              </span>
            </div>
            <p className="sb-note sb-note--sm">Available Zones</p>
            <div className="sb-zone-btn-row">
              {ZONE_DEFS.map((z) => {
                const allowed = allowedZones.includes(z.id);
                const active = selectedZones.includes(z.id);
                return (
                  <button
                    key={z.id}
                    type="button"
                    className={`sb-zone-btn${active ? " is-active" : ""}${!allowed ? " is-disabled" : ""}`}
                    onClick={() => onToggleZone(z.id)}
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
              <span className="sb-logo-side-title">Logo Files</span>
              <span className="sb-logo-side-sub">
                Transparent PNG or SVG · Max 10 MB
              </span>
            </div>

            <div className="sb-upload-field">
              <p className="sb-upload-lbl">
                Primary Logo <span className="sb-upload-req">Required</span>
              </p>
              <div
                className="sb-upload-zone"
                onDragOver={preventDef}
                onDragEnter={preventDef}
                onDrop={(e) =>
                  handleDrop(e, onSetPrimaryLogo, primaryLogo.preview)
                }
                onClick={() => primaryInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload primary logo"
              >
                {primaryLogo.preview ? (
                  <div className="sb-upload-preview">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={primaryLogo.preview}
                      alt="Primary logo preview"
                      className="sb-upload-preview-img"
                    />
                    <span className="sb-upload-preview-name">
                      {primaryLogo.file?.name}
                    </span>
                    <button
                      type="button"
                      className="sb-upload-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile(
                          onSetPrimaryLogo,
                          primaryInputRef,
                          primaryLogo.preview,
                        );
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
                  ref={primaryInputRef}
                  type="file"
                  accept=".png,.svg,.pdf,.ai,.eps"
                  className="sb-upload-input"
                  onChange={(e) =>
                    handleFile(e, onSetPrimaryLogo, primaryLogo.preview)
                  }
                />
              </div>
            </div>

            <div className="sb-upload-field">
              <p className="sb-upload-lbl">
                Alternate Logo <span className="sb-upload-opt">Optional</span>
              </p>
              <div
                className="sb-upload-zone"
                onDragOver={preventDef}
                onDragEnter={preventDef}
                onDrop={(e) => handleDrop(e, onSetAltLogo, altLogo.preview)}
                onClick={() => altInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload alternate logo"
              >
                {altLogo.preview ? (
                  <div className="sb-upload-preview">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={altLogo.preview}
                      alt="Alternate logo preview"
                      className="sb-upload-preview-img"
                    />
                    <span className="sb-upload-preview-name">
                      {altLogo.file?.name}
                    </span>
                    <button
                      type="button"
                      className="sb-upload-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile(onSetAltLogo, altInputRef, altLogo.preview);
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
                  ref={altInputRef}
                  type="file"
                  accept=".png,.svg,.pdf,.ai,.eps"
                  className="sb-upload-input"
                  onChange={(e) => handleFile(e, onSetAltLogo, altLogo.preview)}
                />
              </div>
            </div>

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
