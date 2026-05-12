"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  FormEvent,
} from "react";
import Link from "next/link";
import { PACKAGES, ZONE_DEFS, PACKAGE_ZONE_MAP } from "@/lib/constants";
import StepPackage from "./StepPackage";
import StepPlacement from "./StepPlacement";
import StepProduct from "./StepProduct";
import StepDetails from "./StepDetails";
import StepReview from "./StepReview";

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

function getZoneLabel(id: string): string {
  return ZONE_DEFS.find((z) => z.id === id)?.label ?? id;
}

export default function SubmitForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showHero, setShowHero] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  // Step 1 — package
  const [selectedPackage, setSelectedPackage] = useState<string>("");

  // Step 2 — zones + logos
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
  const allowedZones = useMemo(
    () => (selectedPackage ? (PACKAGE_ZONE_MAP[selectedPackage] ?? []) : []),
    [selectedPackage],
  );

  const canAdvance = useCallback((): boolean => {
    switch (currentStep) {
      case 0:
        return !!selectedPackage;
      case 1:
        return selectedZones.length > 0 && !!primaryLogo.file;
      case 2:
        return true;
      case 3:
        return !!(
          brandName &&
          industry &&
          contactName &&
          email &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        );
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

  const goNext = useCallback(() => {
    if (canAdvance() && currentStep < STEPS.length - 1)
      setCurrentStep((s) => s + 1);
  }, [canAdvance, currentStep]);

  const goBack = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  const startBuilder = () => setShowHero(false);

  /* revoke blob URLs on unmount */
  useEffect(() => {
    return () => {
      if (primaryLogo.preview) URL.revokeObjectURL(primaryLogo.preview);
      if (altLogo.preview) URL.revokeObjectURL(altLogo.preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* zone toggle */
  const toggleZone = useCallback(
    (zoneId: string) => {
      if (!allowedZones.includes(zoneId)) return;
      setSelectedZones((prev) =>
        prev.includes(zoneId)
          ? prev.filter((z) => z !== zoneId)
          : [...prev, zoneId],
      );
    },
    [allowedZones],
  );

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
  const selectPackage = useCallback((name: string) => {
    setSelectedPackage(name);
    setSelectedZones([]);
  }, []);

  /* ack toggle */
  const toggleAck = useCallback(
    (idx: number) =>
      setAcks((prev) => prev.map((v, i) => (i === idx ? !v : v))),
    [],
  );

  /* submit */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canAdvance() || sending) return;
    setSending(true);
    setSendError("");

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          contactName,
          email,
          phone,
          website,
          industry,
          selectedPackage,
          packagePrice: pkg?.price ?? 0,
          selectedZones: selectedZones.map(getZoneLabel),
          restrictions,
          notes,
          reviewNotes,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to submit.");
      }

      setSubmitted(true);
    } catch (err) {
      setSendError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setSending(false);
    }
  };

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

      {currentStep === 0 && (
        <StepPackage
          selectedPackage={selectedPackage}
          onSelectPackage={selectPackage}
          onNext={goNext}
          canAdvance={canAdvance()}
        />
      )}

      {currentStep === 1 && (
        <StepPlacement
          selectedPackage={selectedPackage}
          placements={pkg?.placements ?? 0}
          selectedZones={selectedZones}
          allowedZones={allowedZones}
          primaryLogo={primaryLogo}
          altLogo={altLogo}
          onToggleZone={toggleZone}
          onViewerZoneToggle={handleViewerZoneToggle}
          onSetPrimaryLogo={setPrimaryLogo}
          onSetAltLogo={setAltLogo}
          primaryInputRef={primaryInputRef}
          altInputRef={altInputRef}
          onNext={goNext}
          onBack={goBack}
          canAdvance={canAdvance()}
        />
      )}

      {currentStep === 2 && (
        <StepProduct
          selectedPackage={selectedPackage}
          packagePrice={pkg?.price ?? 0}
          selectedZones={selectedZones}
          primaryLogoName={primaryLogo.file?.name}
          altLogoName={altLogo.file?.name}
          reviewNotes={reviewNotes}
          onReviewNotesChange={setReviewNotes}
          onViewerZoneToggle={handleViewerZoneToggle}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {currentStep === 3 && (
        <StepDetails
          brandName={brandName}
          website={website}
          industry={industry}
          contactName={contactName}
          email={email}
          phone={phone}
          restrictions={restrictions}
          notes={notes}
          onBrandName={setBrandName}
          onWebsite={setWebsite}
          onIndustry={setIndustry}
          onContactName={setContactName}
          onEmail={setEmail}
          onPhone={setPhone}
          onRestrictions={setRestrictions}
          onNotes={setNotes}
          onNext={goNext}
          onBack={goBack}
          canAdvance={canAdvance()}
        />
      )}

      {currentStep === 4 && (
        <StepReview
          selectedPackage={selectedPackage}
          packagePrice={pkg?.price ?? 0}
          selectedZones={selectedZones}
          primaryLogoName={primaryLogo.file?.name}
          altLogoName={altLogo.file?.name}
          brandName={brandName}
          website={website}
          industry={industry}
          contactName={contactName}
          email={email}
          phone={phone}
          restrictions={restrictions}
          notes={notes}
          reviewNotes={reviewNotes}
          acks={acks}
          onToggleAck={toggleAck}
          sending={sending}
          sendError={sendError}
          onBack={goBack}
          canAdvance={canAdvance()}
        />
      )}
    </form>
  );
}
