import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PACKAGES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Partner Allocation — HOMELESS RUNWAY Series 001 Hong Kong",
  description:
    "Series 001 partner placement packages for Hong Kong OOH media deployment. From $300 USD. 100 assets. 800 slots. Reviewed before confirmation.",
};

export default function AllocationPage() {
  return (
    <main id="main-content">
      {/* PAGE HERO */}
      <section className="page-hero" aria-labelledby="page-hero-title">
        <div className="container page-hero-inner">
          <div className="page-hero-left">
            <p className="label">Series 001 — Hong Kong</p>
            <h1 className="page-hero-title" id="page-hero-title">
              Partner <em>Allocation</em>
            </h1>
          </div>
          <div className="page-hero-right">
            <p className="page-hero-sub">
              Series 001 partner placements are available through fixed
              allocation packages. Each package is distributed across the
              100-asset fleet. One placement per partner per asset. No
              takeovers. No clustering.
            </p>
            <p className="deploy-note-inline">
              Prototype visuals only. Deployment documentation added after
              Series 001 production.
            </p>
            <div className="hero-actions page-hero-cta">
              <Link href="/submit" className="btn btn-primary">
                Submit Allocation Request
              </Link>
            </div>
            <div className="page-hero-stats">
              <div className="mini-stat">
                <span className="mini-stat-num">100</span>
                <span className="mini-stat-label">Media Assets</span>
              </div>
              <div className="mini-stat">
                <span className="mini-stat-num">800</span>
                <span className="mini-stat-label">Placement Slots</span>
              </div>
              <div className="mini-stat">
                <span className="mini-stat-num">Q3</span>
                <span className="mini-stat-label">2026 Production</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* § 01 PACKAGES */}
      <section
        className="section"
        id="packages"
        aria-labelledby="packages-title"
      >
        <div className="container">
          <div className="section-header">
            <span className="section-num">§ 01</span>
            <h2 className="section-title" id="packages-title">
              Allocation <em>Packages</em>
            </h2>
          </div>
          <p className="body-text body-text--max">
            Five fixed package tiers. All placements distributed across the
            Series 001 fleet. One partner appearance per asset — maximum.
          </p>
          <div className="table-wrap">
            <table
              className="packages-table"
              aria-label="Allocation package pricing"
            >
              <thead>
                <tr>
                  <th scope="col">Package</th>
                  <th scope="col">Placements</th>
                  <th scope="col">Assets</th>
                  <th scope="col">USD</th>
                </tr>
              </thead>
              <tbody>
                {PACKAGES.map((pkg) => (
                  <tr
                    key={pkg.name}
                    className={
                      pkg.badgeType === "recommended"
                        ? "pkg-recommended"
                        : pkg.badgeType === "limited"
                          ? "pkg-limited"
                          : ""
                    }
                  >
                    <td data-label="Package">
                      <span className="pkg-name">{pkg.name}</span>
                      {pkg.badge && (
                        <span
                          className={`pkg-badge${
                            pkg.badgeType === "limited"
                              ? " pkg-badge--limited"
                              : ""
                          }`}
                        >
                          {pkg.badge}
                        </span>
                      )}
                      <span className="pkg-zones">{pkg.zones}</span>
                    </td>
                    <td data-label="Placements">{pkg.placements}</td>
                    <td data-label="Assets">{pkg.assets}</td>
                    <td data-label="USD">
                      <span className="pkg-price">
                        ${pkg.price.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="garment-zones-strip">
            <p className="label garment-zones-label">
              Editorial Garment Layout — Series 001
            </p>
            <figure
              className="lightbox-trigger garment-layout-figure"
              aria-label="Series 001 editorial garment layout diagram"
            >
              <Image
                src="/images/garments/garment-layout-diagram.png"
                alt="HOMELESS RUNWAY Series 001 editorial garment layout — white garments showing 8 paid placement zones"
                loading="lazy"
                width={1443}
                height={1078}
                className="img-full"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* § 02 ALLOCATION RULES */}
      <section
        className="section section-dark"
        id="allocation-rules"
        aria-labelledby="alloc-rules-title"
      >
        <div className="container">
          <div className="section-header">
            <span className="section-num">§ 02</span>
            <h2 className="section-title" id="alloc-rules-title">
              Allocation <em>Rules</em>
            </h2>
          </div>
          <ol
            className="rules-list rules-list--wide"
            aria-label="Allocation rules"
          >
            {[
              "Maximum one placement per partner per shirt.",
              "No full-shirt takeovers under any package tier.",
              "No same-shirt clustering.",
              "Final placement depends on inventory, garment balance, logo format, and production fit.",
              "Submission does not guarantee placement.",
            ].map((rule, i) => (
              <li className="rules-item" key={i}>
                <span className="rules-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="rules-text">{rule}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* § 03 PAYMENT */}
      <section className="section" id="payment" aria-labelledby="payment-title">
        <div className="container">
          <div className="section-header">
            <span className="section-num">§ 03</span>
            <h2 className="section-title" id="payment-title">
              Payment <em>After Approval</em>
            </h2>
          </div>
          <div className="two-col two-col--wide">
            <div>
              <p className="body-text">
                Payment is requested only after HOMELESS RUNWAY reviews and
                approves the submitted partner, logo file, and preferred
                package. Submission does not reserve inventory automatically.
              </p>
              <p className="body-text">
                Allocation is confirmed only after payment is completed.
                Approved partners receive payment instructions after review.
              </p>
              <div className="info-block">
                <p className="info-block-text">
                  No payment collected at submission.
                  <br />
                  Payment instructions sent after approval only.
                </p>
              </div>
            </div>
            <ol className="process-list" aria-label="Process steps">
              {[
                "Submit allocation request",
                "Partner, logo, and package review",
                "Allocation confirmation sent to approved partners",
                "Payment instructions issued",
                "Payment completed within stated window",
                "Production lock confirmed — allocation finalised",
              ].map((step, i) => (
                <li className="process-item" key={i}>
                  <span className="process-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="process-text">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* § 04 PRODUCTION TRIGGER */}
      <section
        className="section section-dark"
        id="production"
        aria-labelledby="production-title"
      >
        <div className="container">
          <div className="section-header">
            <span className="section-num">§ 04</span>
            <h2 className="section-title" id="production-title">
              Production <em>Trigger</em>
            </h2>
          </div>
          <div className="review-grid">
            <div className="review-text">
              <p className="review-statement">
                <strong>
                  Series 001 production begins only after HOMELESS RUNWAY
                  reaches its minimum allocation threshold.
                </strong>
              </p>
              <p className="body-text">
                All submissions are reviewed based on partner fit, placement
                availability, logo quality, and production feasibility before
                any confirmation is issued. Approval, payment, and production
                confirmation follow sequentially — none are automatic.
              </p>
            </div>
            <div className="review-flags">
              {[
                {
                  label: "Partner Fit",
                  text: "Reviewed for logo printability, category conflicts, and compatibility with the multi-partner fleet format.",
                },
                {
                  label: "Logo Quality",
                  text: "Files must meet garment production standards. Low-quality submissions are flagged or rejected.",
                },
                {
                  label: "Slot Availability",
                  text: "Final allocation depends on remaining inventory at the time of approval.",
                },
                {
                  label: "Production Feasibility",
                  text: "All placements must be technically producible on the Series 001 garment system.",
                },
              ].map((flag) => (
                <div className="flag-item" key={flag.label}>
                  <span className="flag-label">{flag.label}</span>
                  <p className="flag-text">{flag.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* § 05 LOGO REQUIREMENTS */}
      <section className="section" id="logo" aria-labelledby="logo-title">
        <div className="container">
          <div className="section-header">
            <span className="section-num">§ 05</span>
            <h2 className="section-title" id="logo-title">
              Logo File <em>Requirements</em>
            </h2>
          </div>
          <div className="logo-req-grid">
            <p className="body-text">
              Submitted logo files must be suitable for garment production.
              HOMELESS RUNWAY may request a simplified or alternate version
              before approving placement.
            </p>
            <div className="logo-columns">
              <div className="logo-col">
                <p className="logo-col-label">Accepted Formats</p>
                <ul className="logo-list" aria-label="Accepted logo formats">
                  <li>Transparent PNG (high resolution)</li>
                  <li>SVG (vector preferred)</li>
                  <li>PDF (print-ready)</li>
                  <li>AI (Adobe Illustrator)</li>
                  <li>EPS (encapsulated PostScript)</li>
                </ul>
              </div>
              <div className="logo-col logo-col--reject">
                <p className="logo-col-label">Rejected or Review-Required</p>
                <ul className="logo-list" aria-label="Rejected logo types">
                  <li>Screenshots or screen captures</li>
                  <li>Low-resolution or blurry files</li>
                  <li>Files with unnecessary backgrounds</li>
                  <li>Overly detailed or complex graphics</li>
                  <li>Files that will not print on white garments</li>
                  <li>Compressed or artefact-heavy exports</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* § 06 PARTICIPANT SUPPORT */}
      <section
        className="section section-dark"
        id="support-contribution"
        aria-labelledby="support-contrib-title"
      >
        <div className="container">
          <div className="section-header">
            <span className="section-num">§ 06</span>
            <h2 className="section-title" id="support-contrib-title">
              Participant <em>Support</em>
            </h2>
          </div>
          <div className="support-contrib-body">
            <p className="support-contrib-lead">
              20% of Series 001 allocation revenue is reserved for direct
              participant support — including participant compensation,
              essential goods, and field-level operational aid.
            </p>
            <p className="body-text">
              This is built into the revenue model. Support contributions and
              allocation revenue are tracked separately.
            </p>
            <p className="note-text">
              Optional additional support contributions may be made
              independently. They carry no influence over placement decisions.
            </p>
          </div>
        </div>
      </section>

      {/* SUBMIT CTA */}
      <section
        className="section final-cta"
        id="submit"
        aria-labelledby="submit-title"
      >
        <div className="container">
          <div className="final-cta-grid">
            <h2 className="final-cta-title" id="submit-title">
              Ready To <em>Apply?</em>
            </h2>
            <div className="final-cta-body">
              <p className="body-text">
                All submissions reviewed before confirmation. No payment
                collected at submission. Approved partners receive confirmation
                and payment instructions.
              </p>
              <div className="cta-group">
                <Link href="/submit" className="btn btn-primary btn-large">
                  Submit Allocation Request
                </Link>
              </div>
              <p className="disclaimer">
                Submission does not guarantee placement.
                <br />
                Payment requested after approval only.
              </p>
              <div className="contact-block">
                <p className="contact-block-label">Direct Enquiries</p>
                <a
                  href="mailto:partners@homelessrunway.com"
                  className="contact-block-email"
                >
                  partners@homelessrunway.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
