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
import { resizeImage } from "@/lib/resizeImage";
import type { GarmentViewerHandle } from "@/components/GarmentViewer";
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

export default function SubmitForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showHero, setShowHero] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  // Step 1 — package
  const [selectedPackage, setSelectedPackage] = useState<string>("");

  // Step 2 — zones + logos
  const [logos, setLogos] = useState<LogoState[]>([]);
  const [activeLogoId, setActiveLogoId] = useState<string>("");
  const logoRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const garmentRef = useRef<GarmentViewerHandle>(null);

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
        return (
          logos.some((l) => l.file) &&
          logos.some((l) => l.selectedZones.length > 0)
        );
      case 2:
        return true;
      case 3: {
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const websiteOk = !website || /^https?:\/\/.+\..+/.test(website);
        const phoneOk = !phone || /^\+?[\d\s()\-]{7,20}$/.test(phone);
        return !!(
          brandName &&
          brandName.trim().length >= 2 &&
          industry &&
          contactName &&
          contactName.trim().length >= 2 &&
          emailOk &&
          websiteOk &&
          phoneOk
        );
      }
      case 4:
        return acks.every(Boolean);
      default:
        return false;
    }
  }, [
    currentStep,
    selectedPackage,
    logos,
    brandName,
    industry,
    contactName,
    email,
    phone,
    website,
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
      logos.forEach((logo) => {
        if (logo.preview) URL.revokeObjectURL(logo.preview);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* logo handlers */
  const updateLogo = useCallback((id: string, updates: Partial<LogoState>) => {
    setLogos((prev) => {
      // If this id doesn't exist yet, create a new entry (used by StepPlacement drop handler)
      const exists = prev.some((l) => l.id === id);
      if (!exists) {
        if (prev.filter((l) => l.file).length >= 8) return prev;
        const newLogo: LogoState = {
          id,
          file: null,
          preview: "",
          selectedZones: [],
          label: `Logo ${prev.filter((l) => l.file).length + 1}`,
          ...updates,
        };
        return [...prev, newLogo];
      }
      return prev.map((l) => (l.id === id ? { ...l, ...updates } : l));
    });
    // Auto-select newly added logos
    setActiveLogoId(id);
  }, []);

  const addLogo = useCallback(() => {
    const newId = `logo-${Date.now()}`;
    setLogos((prev) => {
      if (prev.filter((l) => l.file).length >= 8) return prev;
      return [
        ...prev,
        {
          id: newId,
          file: null,
          preview: "",
          selectedZones: [],
          label: `Logo ${prev.filter((l) => l.file).length + 1}`,
        },
      ];
    });
    setActiveLogoId(newId);
  }, []);

  /** Assign zone to the active logo (removing it from any other logo first) */
  const assignZone = useCallback(
    (zoneId: string) => {
      setLogos((prev) => {
        const active = prev.find((l) => l.id === activeLogoId);
        if (!active || !active.file) return prev;

        // If the active logo already owns this zone, unassign it
        if (active.selectedZones.includes(zoneId)) {
          return prev.map((l) =>
            l.id === activeLogoId
              ? {
                  ...l,
                  selectedZones: l.selectedZones.filter((z) => z !== zoneId),
                }
              : l,
          );
        }

        // Remove zone from any other logo, assign to active
        return prev.map((l) => {
          if (l.id === activeLogoId) {
            return { ...l, selectedZones: [...l.selectedZones, zoneId] };
          }
          if (l.selectedZones.includes(zoneId)) {
            return {
              ...l,
              selectedZones: l.selectedZones.filter((z) => z !== zoneId),
            };
          }
          return l;
        });
      });
    },
    [activeLogoId],
  );

  const removeLogo = useCallback(
    (id: string) => {
      setLogos((prev) => {
        const logo = prev.find((l) => l.id === id);
        if (logo?.preview) URL.revokeObjectURL(logo.preview);
        const filtered = prev.filter((l) => l.id !== id);
        if (filtered.length === 0) return [];
        return filtered;
      });
      setActiveLogoId((prevId) => {
        if (prevId === id) {
          // Pick the first logo with a file, or the first logo
          const remaining = logos.filter((l) => l.id !== id);
          const withFile = remaining.find((l) => l.file);
          return withFile?.id ?? remaining[0]?.id ?? "";
        }
        return prevId;
      });
    },
    [logos],
  );

  const setActiveLogo = useCallback((id: string) => {
    setActiveLogoId(id);
  }, []);

  /* package select */
  const selectPackage = useCallback((name: string) => {
    setSelectedPackage(name);
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
      // Resize logo images to base64
      const logoImages: string[] = await Promise.all(
        logos.map(async (l) => {
          if (!l.preview) return "";
          try {
            return await resizeImage(l.preview, 400, 0.85);
          } catch {
            return "";
          }
        }),
      );

      // Capture garment screenshot
      const garmentScreenshot = garmentRef.current?.captureScreenshot() ?? "";

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
          logos: logos.map((l, i) => ({
            label: l.label,
            selectedZones: l.selectedZones.map(getZoneLabel),
            fileName: l.file?.name,
            imageData: logoImages[i] || undefined,
          })),
          garmentScreenshot: garmentScreenshot || undefined,
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
                <span className="sb-review-key">Logos</span>
                <span className="sb-review-val">
                  {logos
                    .filter((l) => l.file)
                    .map(
                      (l) =>
                        `${l.label}: ${l.selectedZones.map(getZoneLabel).join(", ")}`,
                    )
                    .join("; ")}
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
          allowedZones={allowedZones}
          logos={logos}
          activeLogoId={activeLogoId}
          onSetActiveLogo={setActiveLogo}
          onUpdateLogo={updateLogo}
          onAddLogo={addLogo}
          onRemoveLogo={removeLogo}
          onAssignZone={assignZone}
          onNext={goNext}
          onBack={goBack}
          canAdvance={canAdvance()}
        />
      )}

      {currentStep === 2 && (
        <StepProduct
          selectedPackage={selectedPackage}
          packagePrice={pkg?.price ?? 0}
          logos={logos}
          reviewNotes={reviewNotes}
          onReviewNotesChange={setReviewNotes}
          onNext={goNext}
          onBack={goBack}
          garmentRef={garmentRef}
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
          logos={logos}
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
