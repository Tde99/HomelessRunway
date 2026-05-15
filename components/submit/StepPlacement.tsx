import { memo, useCallback, ChangeEvent, useRef } from "react";
import { ZONE_DEFS } from "@/lib/constants";
import GarmentViewer from "@/components/GarmentViewer";

const MAX_LOGOS = 8;

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
  onAssignZone: (zoneId: string) => void;
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
  onAssignZone,
  onNext,
  onBack,
  canAdvance,
}: StepPlacementProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeLogo = logos.find((l) => l.id === activeLogoId) || logos[0];

  const preventDef = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  /** Add files dropped or selected into the logo pool */
  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const arr = Array.from(files);
      for (const file of arr) {
        if (logos.length >= MAX_LOGOS) {
          alert(`Maximum ${MAX_LOGOS} logos allowed.`);
          break;
        }
        if (file.size > 10 * 1024 * 1024) {
          alert(`"${file.name}" exceeds 10 MB limit.`);
          continue;
        }
        const preview = URL.createObjectURL(file);
        const newId = `logo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        // We call onAddLogo-style logic via onUpdateLogo on a fresh entry
        // Actually we need addLogo to return an id... let's use a different approach:
        // We'll call onAddLogo which creates a blank entry, but we need the file too.
        // Better: pass the file to a new handler. But to minimize prop changes,
        // let's use the existing onAddLogo + onUpdateLogo pattern:
        onUpdateLogo(newId, { file, preview });
      }
    },
    [logos.length, onUpdateLogo],
  );

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      addFiles(files);
      e.target.value = "";
    },
    [addFiles],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const files = e.dataTransfer.files;
      if (!files || files.length === 0) return;
      addFiles(files);
    },
    [addFiles],
  );

  /** Find which logo owns a zone (if any) */
  const logoForZone = useCallback(
    (zoneId: string): LogoState | undefined =>
      logos.find((l) => l.selectedZones.includes(zoneId)),
    [logos],
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
          Upload logos, select one, then click a zone to place it
          <br />
          {selectedPackage && (
            <>
              Package: <strong>{selectedPackage}</strong> — {placements}{" "}
              placement{placements > 1 ? "s" : ""}
            </>
          )}
        </p>

        <div className="sb-placement-logo-grid">
          {/* ── Left: 3D viewer + zones ── */}
          <div className="sb-placement-col">
            <GarmentViewer
              logos={logos}
              activeLogoId={activeLogoId}
              onZoneToggle={onAssignZone}
            />

            <p className="sb-note sb-note--sm">
              Available Zones
              {!activeLogo?.file && (
                <span style={{ color: "#e53e3e", marginLeft: "8px" }}>
                  — Select a logo first
                </span>
              )}
            </p>

            <div className="sb-zone-btn-row">
              {ZONE_DEFS.map((z) => {
                const allowed = allowedZones.includes(z.id);
                const owner = logoForZone(z.id);
                const ownedByActive = owner?.id === activeLogoId;
                const hasActiveLogo = !!activeLogo?.file;
                return (
                  <button
                    key={z.id}
                    type="button"
                    className={`sb-zone-btn${ownedByActive ? " is-active" : ""}${owner && !ownedByActive ? " is-taken" : ""}${!allowed || !hasActiveLogo ? " is-disabled" : ""}`}
                    onClick={() => onAssignZone(z.id)}
                    disabled={!allowed || !hasActiveLogo}
                    aria-pressed={ownedByActive}
                    title={owner ? `Assigned to ${owner.label}` : z.label}
                  >
                    <span className="sb-zone-btn-label">{z.label}</span>
                    {owner && (
                      <span className="sb-zone-btn-owner">
                        {owner.preview ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={owner.preview}
                            alt=""
                            className="sb-zone-btn-thumb"
                          />
                        ) : (
                          owner.label
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="sb-zone-readout">
              <span className="sb-zone-readout-lbl">Zone Assignments</span>
              <span className="sb-zone-readout-val">
                {logos.some((l) => l.selectedZones.length > 0)
                  ? logos
                      .filter((l) => l.selectedZones.length > 0)
                      .map(
                        (l) =>
                          `${l.label}: ${l.selectedZones.map(getZoneLabel).join(", ")}`,
                      )
                      .join(" · ")
                  : "None — select a logo then click a zone"}
              </span>
            </div>
          </div>

          {/* ── Right: centralized logo box ── */}
          <div className="sb-logo-side">
            <div className="sb-logo-side-hdr">
              <span className="sb-logo-side-title">
                Logos ({logos.filter((l) => l.file).length}/{MAX_LOGOS})
              </span>
              <span className="sb-logo-side-sub">
                Click a logo to select it, then click a zone to place it
              </span>
            </div>

            {/* Logo grid */}
            <div className="sb-logo-grid">
              {logos
                .filter((l) => l.file)
                .map((logo) => (
                  <button
                    key={logo.id}
                    type="button"
                    className={`sb-logo-thumb${logo.id === activeLogoId ? " is-selected" : ""}`}
                    onClick={() => onSetActiveLogo(logo.id)}
                    title={logo.label}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.preview}
                      alt={logo.label}
                      className="sb-logo-thumb-img"
                    />
                    <span className="sb-logo-thumb-label">{logo.label}</span>
                    <button
                      type="button"
                      className="sb-logo-thumb-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveLogo(logo.id);
                      }}
                      aria-label={`Remove ${logo.label}`}
                    >
                      ×
                    </button>
                    {logo.selectedZones.length > 0 && (
                      <span className="sb-logo-thumb-zones">
                        {logo.selectedZones.length} zone
                        {logo.selectedZones.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </button>
                ))}
            </div>

            {/* Drop zone to add more logos */}
            <div
              className="sb-upload-zone sb-upload-zone--pool"
              onDragOver={preventDef}
              onDragEnter={preventDef}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Add logos"
            >
              <div className="sb-upload-placeholder">
                <span className="sb-upload-arrow">↑</span>
                <span className="sb-upload-placeholder-text">
                  Drag &amp; drop or{" "}
                  <span className="sb-upload-link">browse</span>
                </span>
                <span className="sb-upload-formats">
                  PNG · SVG · PDF · AI · EPS · Max 10 MB
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.svg,.pdf,.ai,.eps"
                multiple
                className="sb-upload-input"
                onClick={(e) => e.stopPropagation()}
                onChange={handleFileInput}
              />
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
