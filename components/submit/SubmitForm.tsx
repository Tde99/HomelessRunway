"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  FormEvent,
  ChangeEvent,
} from "react";
import Link from "next/link";
import {
  PACKAGES,
  INDUSTRY_OPTIONS,
  ZONE_DEFS,
  PACKAGE_ZONE_MAP,
} from "@/lib/constants";
import GarmentViewer from "@/components/GarmentViewer";

const STEPS = [
  "Package",
  "Placement & Logo",
  "Review Product",
  "Details",
  "Review",
] as const;

interface FileState {
  file: File | null;
  preview: string;
}

/* shared zone label helper */
function getZoneLabel(id: string): string {
  return ZONE_DEFS.find((z) => z.id === id)?.label ?? id;
}

export default function SubmitForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showHero, setShowHero] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — package
  const [selectedPackage, setSelectedPackage] = useState<string>("");

  // Step 2 — zones + logos (merged)
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [primaryLogo, setPrimaryLogo] = useState<FileState>({
    file: null,
    preview: "",
  });
  const [altLogo, setAltLogo] = useState<FileState>({
    file: null,
    preview: "",
  });
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const altInputRef = useRef<HTMLInputElement>(null);

  // Step 3 — review product
  const [reviewNotes, setReviewNotes] = useState("");

  // Step 4 — details
  const [brandName, setBrandName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [restrictions, setRestrictions] = useState("");
  const [notes, setNotes] = useState("");

  // Step 5 — acknowledgments
  const [acks, setAcks] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);

  /* helpers */
  const pkg = PACKAGES.find((p) => p.name === selectedPackage);
  const allowedZones = selectedPackage
    ? (PACKAGE_ZONE_MAP[selectedPackage] ?? [])
    : [];

  const canAdvance = useCallback((): boolean => {
    switch (currentStep) {
      case 0:
        return !!selectedPackage;
      case 1:
        return selectedZones.length > 0 && !!primaryLogo.file;
      case 2:
        return true; // review product — always passable
      case 3:
        return !!(brandName && industry && contactName && email);
      case 4:
        return acks.every(Boolean);
      default:
        return false;
    }
  }, [
    currentStep,
    selectedPackage,
    selectedZones,
    primaryLogo,
    brandName,
    industry,
    contactName,
    email,
    acks,
  ]);

  const goNext = () => {
    if (canAdvance() && currentStep < STEPS.length - 1)
      setCurrentStep((s) => s + 1);
  };
  const goBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const startBuilder = () => setShowHero(false);

  /* revoke blob URLs on unmount */
  useEffect(() => {
    return () => {
      if (primaryLogo.preview) URL.revokeObjectURL(primaryLogo.preview);
      if (altLogo.preview) URL.revokeObjectURL(altLogo.preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* file handling */
  const handleFile = (
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
  };

  const clearFile = (
    setter: (s: FileState) => void,
    inputRef: React.RefObject<HTMLInputElement | null>,
    currentPreview: string,
  ) => {
    if (currentPreview) URL.revokeObjectURL(currentPreview);
    setter({ file: null, preview: "" });
    if (inputRef.current) inputRef.current.value = "";
  };

  /* zone toggle */
  const toggleZone = (zoneId: string) => {
    if (!allowedZones.includes(zoneId)) return;
    setSelectedZones((prev) =>
      prev.includes(zoneId)
        ? prev.filter((z) => z !== zoneId)
        : [...prev, zoneId],
    );
  };

  /* 3D viewer zone callback */
  const handleViewerZoneToggle = useCallback(
    (zoneId: string, selected: boolean) => {
      if (!allowedZones.includes(zoneId)) return;
      setSelectedZones((prev) =>
        selected
          ? prev.includes(zoneId)
            ? prev
            : [...prev, zoneId]
          : prev.filter((z) => z !== zoneId),
      );
    },
    [allowedZones],
  );

  /* package select */
  const selectPackage = (name: string) => {
    setSelectedPackage(name);
    setSelectedZones([]);
  };

  /* submit */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canAdvance()) return;
    setSubmitted(true);
  };

  /* drag helpers */
  const preventDef = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (
    e: React.DragEvent,
    setter: (s: FileState) => void,
    currentPreview: string,
  ) => {
    preventDef(e);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10 MB limit.");
      return;
    }
    if (currentPreview) URL.revokeObjectURL(currentPreview);
    setter({ file, preview: URL.createObjectURL(file) });
  };

  /* ack toggle */
  const toggleAck = (idx: number) =>
    setAcks((prev) => prev.map((v, i) => (i === idx ? !v : v)));

  /* ─── SUCCESS STATE ─── */
  if (submitted) {
    return (
      <>
        <section className="page-hero" aria-labelledby="success-title">
          <div className="container page-hero-inner">
            <div className="page-hero-left">
              <p className="label">Series 001 — Hong Kong</p>
              <h1 className="page-hero-title" id="success-title">
                Allocation Request <em>Received</em>
              </h1>
            </div>
            <div className="page-hero-right">
              <p className="page-hero-sub">
                Thank you. Your allocation request has been submitted and is now
                under review. HOMELESS RUNWAY will contact you at{" "}
                <strong>{email}</strong> once the review is complete.
              </p>
              <p className="body-text">
                Submission does not guarantee placement. If approved, you will
                receive allocation confirmation and payment instructions by
                email.
              </p>
              <div className="hero-actions page-hero-cta">
                <Link href="/" className="btn btn-primary">
                  Return to Home
                </Link>
                <Link href="/allocation" className="btn btn-ghost">
                  View Allocation Info
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="sb-success">
          <div className="container sb-success-inner">
            <h2 className="section-title">Submission Summary</h2>
            <div className="sb-review-summary">
              <div className="sb-review-row">
                <span className="sb-review-key">Package</span>
                <span className="sb-review-val">{selectedPackage}</span>
              </div>
              <div className="sb-review-row">
                <span className="sb-review-key">Placement Zones</span>
                <span className="sb-review-val">
                  {selectedZones.map(getZoneLabel).join(", ")}
                </span>
              </div>
              <div className="sb-review-row">
                <span className="sb-review-key">Brand</span>
                <span className="sb-review-val">{brandName}</span>
              </div>
              <div className="sb-review-row">
                <span className="sb-review-key">Industry</span>
                <span className="sb-review-val">{industry}</span>
              </div>
              <div className="sb-review-row">
                <span className="sb-review-key">Contact</span>
                <span className="sb-review-val">
                  {contactName} — {email}
                </span>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  /* ─── HERO ─── */
  if (showHero) {
    return (
      <section
        className="page-hero sb-hero"
        aria-labelledby="submit-hero-title"
      >
        <div className="container sb-hero-inner">
          <div className="sb-hero-left">
            <p className="label">Series 001 — Hong Kong</p>
            <h1 className="page-hero-title" id="submit-hero-title">
              Submit <em>Allocation&nbsp;Request</em>
            </h1>
          </div>
          <div className="sb-hero-right">
            <p className="page-hero-sub">
              Select your allocation package, indicate placement zones, upload
              your logo file, and provide partner details. All submissions are
              reviewed before any confirmation or payment request is issued.
            </p>
            <div className="hero-actions page-hero-cta">
              <button
                type="button"
                className="btn btn-primary sb-start-btn"
                onClick={startBuilder}
              >
                Start Allocation Request
              </button>
              <Link href="/allocation" className="btn btn-ghost">
                View Package Info
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ─── FORM ─── */
  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* STEP INDICATOR */}
      <div className="sb-step-bar" role="navigation" aria-label="Form steps">
        <div className="sb-step-track">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              className={`sb-step-tab${i === currentStep ? " is-active" : ""}${
                i < currentStep ? " is-done" : ""
              }`}
              onClick={() => i < currentStep && setCurrentStep(i)}
              disabled={i > currentStep}
              aria-current={i === currentStep ? "step" : undefined}
            >
              <span className="sb-step-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="sb-step-label">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1 — PACKAGE */}
      {currentStep === 0 && (
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
              {PACKAGES.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  className={`sb-pkg-card${
                    selectedPackage === p.name ? " is-selected" : ""
                  }${
                    p.badgeType === "recommended" ? " sb-pkg-card--rec" : ""
                  }${p.badgeType === "limited" ? " sb-pkg-card--lim" : ""}`}
                  onClick={() => selectPackage(p.name)}
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
                onClick={goNext}
                disabled={!canAdvance()}
              >
                Continue
              </button>
            </div>
          </div>
        </section>
      )}

      {/* STEP 2 — PLACEMENT & LOGO (merged) */}
      {currentStep === 1 && (
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
              {pkg && (
                <>
                  {" "}
                  Package: <strong>{selectedPackage}</strong> — {pkg.placements}{" "}
                  placement{pkg.placements > 1 ? "s" : ""}.
                </>
              )}
            </p>

            <div className="sb-placement-logo-grid">
              {/* LEFT — garment viewer + zone buttons */}
              <div className="sb-placement-col">
                <div className="sb-garment">
                  <GarmentViewer onZoneToggle={handleViewerZoneToggle} />
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

              {/* RIGHT — logo upload panel */}
              <div className="sb-logo-side">
                <div className="sb-logo-side-hdr">
                  <span className="sb-logo-side-title">Logo Files</span>
                  <span className="sb-logo-side-sub">
                    Transparent PNG or SVG · Max 10 MB
                  </span>
                </div>

                {/* Primary */}
                <div className="sb-upload-field">
                  <p className="sb-upload-lbl">
                    Primary Logo <span className="sb-upload-req">Required</span>
                  </p>
                  <div
                    className="sb-upload-zone"
                    onDragOver={preventDef}
                    onDragEnter={preventDef}
                    onDrop={(e) =>
                      handleDrop(e, setPrimaryLogo, primaryLogo.preview)
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
                              setPrimaryLogo,
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
                        handleFile(e, setPrimaryLogo, primaryLogo.preview)
                      }
                    />
                  </div>
                </div>

                {/* Alternate */}
                <div className="sb-upload-field">
                  <p className="sb-upload-lbl">
                    Alternate Logo{" "}
                    <span className="sb-upload-opt">Optional</span>
                  </p>
                  <div
                    className="sb-upload-zone"
                    onDragOver={preventDef}
                    onDragEnter={preventDef}
                    onDrop={(e) => handleDrop(e, setAltLogo, altLogo.preview)}
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
                            clearFile(setAltLogo, altInputRef, altLogo.preview);
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
                      onChange={(e) =>
                        handleFile(e, setAltLogo, altLogo.preview)
                      }
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
                onClick={goBack}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary sb-next"
                onClick={goNext}
                disabled={!canAdvance()}
              >
                Continue
              </button>
            </div>
          </div>
        </section>
      )}

      {/* STEP 3 — REVIEW PRODUCT */}
      {currentStep === 2 && (
        <section className="sb-step" aria-labelledby="step-product-title">
          <div className="container">
            <div className="sb-step-hdr">
              <span className="sb-step-hdr-num">03</span>
              <h2 className="sb-step-hdr-title" id="step-product-title">
                Review <em>Product</em>
              </h2>
            </div>
            <p className="sb-note">
              Preview how your logo will appear on the garment. Rotate the 3D
              model or use the view buttons below.
            </p>

            <div className="sb-review-product-grid">
              {/* LEFT — garment viewer */}
              <div className="sb-product-preview">
                <GarmentViewer onZoneToggle={handleViewerZoneToggle} />
              </div>

              {/* RIGHT — summary sidebar */}
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
                      {pkg ? `$${pkg.price.toLocaleString()} USD` : "—"}
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
                    <span className="sb-review-val">
                      {primaryLogo.file?.name ?? "—"}
                    </span>
                  </div>
                  <div className="sb-review-row">
                    <span className="sb-review-key">Alternate Logo</span>
                    <span className="sb-review-val">
                      {altLogo.file?.name ?? "None"}
                    </span>
                  </div>
                </div>

                <div className="sb-product-notes">
                  <label className="sb-form-lbl" htmlFor="review-notes">
                    Notes for Review{" "}
                    <span className="sb-form-opt">Optional</span>
                  </label>
                  <textarea
                    id="review-notes"
                    className="sb-form-textarea"
                    rows={3}
                    placeholder="Any placement preferences or instructions…"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="sb-step-nav">
              <button
                type="button"
                className="btn btn-ghost sb-back"
                onClick={goBack}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary sb-next"
                onClick={goNext}
                disabled={!canAdvance()}
              >
                Continue
              </button>
            </div>
          </div>
        </section>
      )}

      {/* STEP 4 — DETAILS */}
      {currentStep === 3 && (
        <section className="sb-step" aria-labelledby="step-details-title">
          <div className="container">
            <div className="sb-step-hdr">
              <span className="sb-step-hdr-num">04</span>
              <h2 className="sb-step-hdr-title" id="step-details-title">
                Partner <em>Details</em>
              </h2>
            </div>
            <p className="sb-note">
              Provide brand and contact information. Fields marked * are
              required.
            </p>
            <div className="sb-form-grid">
              <div className="sb-form-field">
                <label className="sb-form-lbl" htmlFor="brand-name">
                  Brand / Company Name <span className="sb-form-req">*</span>
                </label>
                <input
                  id="brand-name"
                  type="text"
                  className="sb-form-input"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  required
                />
              </div>
              <div className="sb-form-field">
                <label className="sb-form-lbl" htmlFor="website">
                  Website <span className="sb-form-opt">Optional</span>
                </label>
                <input
                  id="website"
                  type="url"
                  className="sb-form-input"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
              <div className="sb-form-field">
                <label className="sb-form-lbl" htmlFor="industry">
                  Industry / Category <span className="sb-form-req">*</span>
                </label>
                <select
                  id="industry"
                  className="sb-form-select"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  required
                >
                  <option value="">Select industry…</option>
                  {INDUSTRY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sb-form-field">
                <label className="sb-form-lbl" htmlFor="contact-name">
                  Contact Name <span className="sb-form-req">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  className="sb-form-input"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                />
              </div>
              <div className="sb-form-field">
                <label className="sb-form-lbl" htmlFor="email">
                  Contact Email <span className="sb-form-req">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  className="sb-form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="sb-form-field">
                <label className="sb-form-lbl" htmlFor="phone">
                  Phone <span className="sb-form-opt">Optional</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="sb-form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="sb-form-field sb-form-field--full">
                <label className="sb-form-lbl" htmlFor="restrictions">
                  Placement Restrictions{" "}
                  <span className="sb-form-opt">Optional</span>
                </label>
                <textarea
                  id="restrictions"
                  className="sb-form-textarea"
                  rows={3}
                  value={restrictions}
                  onChange={(e) => setRestrictions(e.target.value)}
                />
              </div>
              <div className="sb-form-field sb-form-field--full">
                <label className="sb-form-lbl" htmlFor="notes">
                  Additional Notes <span className="sb-form-opt">Optional</span>
                </label>
                <textarea
                  id="notes"
                  className="sb-form-textarea"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="sb-step-nav">
              <button
                type="button"
                className="btn btn-ghost sb-back"
                onClick={goBack}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary sb-next"
                onClick={goNext}
                disabled={!canAdvance()}
              >
                Continue
              </button>
            </div>
          </div>
        </section>
      )}

      {/* STEP 5 — REVIEW & SUBMIT */}
      {currentStep === 4 && (
        <section className="sb-step" aria-labelledby="step-review-title">
          <div className="container">
            <div className="sb-step-hdr">
              <span className="sb-step-hdr-num">05</span>
              <h2 className="sb-step-hdr-title" id="step-review-title">
                Review &amp; <em>Submit</em>
              </h2>
            </div>
            <p className="sb-note">
              Confirm your allocation request details, acknowledge submission
              terms, and submit for review.
            </p>
            <div className="sb-review-summary">
              <div className="sb-review-row">
                <span className="sb-review-key">Package</span>
                <span className="sb-review-val">
                  {selectedPackage}
                  {pkg && <> — ${pkg.price.toLocaleString()} USD</>}
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
                <span className="sb-review-val">
                  {primaryLogo.file?.name ?? "—"}
                </span>
              </div>
              <div className="sb-review-row">
                <span className="sb-review-key">Alternate Logo</span>
                <span className="sb-review-val">
                  {altLogo.file?.name ?? "None"}
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
                    onChange={() => toggleAck(i)}
                  />
                  <span className="sb-ack-text">{text}</span>
                </label>
              ))}
            </div>

            <div className="sb-step-nav">
              <button
                type="button"
                className="btn btn-ghost sb-back"
                onClick={goBack}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-large sb-next"
                disabled={!canAdvance()}
              >
                Submit Allocation Request
              </button>
            </div>
          </div>
        </section>
      )}
    </form>
  );
}
