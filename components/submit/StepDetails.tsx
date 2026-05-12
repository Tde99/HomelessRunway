import { memo, useState } from "react";
import { INDUSTRY_OPTIONS } from "@/lib/constants";

interface StepDetailsProps {
  brandName: string;
  website: string;
  industry: string;
  contactName: string;
  email: string;
  phone: string;
  restrictions: string;
  notes: string;
  onBrandName: (v: string) => void;
  onWebsite: (v: string) => void;
  onIndustry: (v: string) => void;
  onContactName: (v: string) => void;
  onEmail: (v: string) => void;
  onPhone: (v: string) => void;
  onRestrictions: (v: string) => void;
  onNotes: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
  canAdvance: boolean;
}

const PHONE_RE = /^\+?[\d\s()\-]{7,20}$/;
const URL_RE = /^https?:\/\/.+\..+/;

export default memo(function StepDetails({
  brandName,
  website,
  industry,
  contactName,
  email,
  phone,
  restrictions,
  notes,
  onBrandName,
  onWebsite,
  onIndustry,
  onContactName,
  onEmail,
  onPhone,
  onRestrictions,
  onNotes,
  onNext,
  onBack,
  canAdvance,
}: StepDetailsProps) {
  const [attempted, setAttempted] = useState(false);

  const handleNext = () => {
    if (!canAdvance) {
      setAttempted(true);
      return;
    }
    onNext();
  };

  const brandErr =
    attempted && !brandName.trim()
      ? "Required"
      : brandName && brandName.trim().length < 2
        ? "At least 2 characters"
        : "";
  const industryErr = attempted && !industry ? "Required" : "";
  const contactErr =
    attempted && !contactName.trim()
      ? "Required"
      : contactName && contactName.trim().length < 2
        ? "At least 2 characters"
        : "";
  const emailErr =
    attempted && !email
      ? "Required"
      : email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "Enter a valid email address"
        : "";

  return (
    <section className="sb-step" aria-labelledby="step-details-title">
      <div className="container">
        <div className="sb-step-hdr">
          <span className="sb-step-hdr-num">04</span>
          <h2 className="sb-step-hdr-title" id="step-details-title">
            Partner <em>Details</em>
          </h2>
        </div>
        <p className="sb-note">
          Provide brand and contact information. Fields marked * are required.
        </p>
        <div className="sb-form-grid">
          <div className="sb-form-field">
            <label className="sb-form-lbl" htmlFor="brand-name">
              Brand / Company Name <span className="sb-form-req">*</span>
            </label>
            <input
              id="brand-name"
              type="text"
              className={`sb-form-input${brandErr ? " sb-form-error" : ""}`}
              value={brandName}
              onChange={(e) => onBrandName(e.target.value)}
              required
            />
            {brandErr && (
              <span className="sb-field-hint">
                <span className="sb-field-hint-icon">!</span>
                {brandErr}
              </span>
            )}
          </div>
          <div className="sb-form-field">
            <label className="sb-form-lbl" htmlFor="website">
              Website <span className="sb-form-opt">Optional</span>
            </label>
            <input
              id="website"
              type="url"
              className={`sb-form-input${website && !URL_RE.test(website) ? " sb-form-error" : ""}`}
              value={website}
              onChange={(e) => onWebsite(e.target.value)}
              placeholder="https://"
            />
            {website && !URL_RE.test(website) && (
              <span className="sb-field-hint">
                <span className="sb-field-hint-icon">!</span>
                Enter a valid URL (https://…)
              </span>
            )}
          </div>
          <div className="sb-form-field">
            <label className="sb-form-lbl" htmlFor="industry">
              Industry / Category <span className="sb-form-req">*</span>
            </label>
            <select
              id="industry"
              className={`sb-form-select${industryErr ? " sb-form-error" : ""}`}
              value={industry}
              onChange={(e) => onIndustry(e.target.value)}
              required
            >
              <option value="">Select industry…</option>
              {INDUSTRY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {industryErr && (
              <span className="sb-field-hint">
                <span className="sb-field-hint-icon">!</span>
                {industryErr}
              </span>
            )}
          </div>
          <div className="sb-form-field">
            <label className="sb-form-lbl" htmlFor="contact-name">
              Contact Name <span className="sb-form-req">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              className={`sb-form-input${contactErr ? " sb-form-error" : ""}`}
              value={contactName}
              onChange={(e) => onContactName(e.target.value)}
              required
            />
            {contactErr && (
              <span className="sb-field-hint">
                <span className="sb-field-hint-icon">!</span>
                {contactErr}
              </span>
            )}
          </div>
          <div className="sb-form-field">
            <label className="sb-form-lbl" htmlFor="email">
              Contact Email <span className="sb-form-req">*</span>
            </label>
            <input
              id="email"
              type="email"
              className={`sb-form-input${emailErr ? " sb-form-error" : ""}`}
              value={email}
              onChange={(e) => onEmail(e.target.value)}
              required
            />
            {emailErr && (
              <span className="sb-field-hint">
                <span className="sb-field-hint-icon">!</span>
                {emailErr}
              </span>
            )}
          </div>
          <div className="sb-form-field">
            <label className="sb-form-lbl" htmlFor="phone">
              Phone <span className="sb-form-opt">Optional</span>
            </label>
            <input
              id="phone"
              type="tel"
              className={`sb-form-input${phone && !PHONE_RE.test(phone) ? " sb-form-error" : ""}`}
              value={phone}
              onChange={(e) => onPhone(e.target.value)}
            />
            {phone && !PHONE_RE.test(phone) && (
              <span className="sb-field-hint">
                <span className="sb-field-hint-icon">!</span>
                Enter a valid phone number
              </span>
            )}
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
              onChange={(e) => onRestrictions(e.target.value)}
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
              onChange={(e) => onNotes(e.target.value)}
            />
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
            onClick={handleNext}
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
});
