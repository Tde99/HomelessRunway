import Link from "next/link";

export default function FinalCta() {
  return (
    <section
      className="section final-cta"
      id="allocate"
      aria-labelledby="final-cta-title"
    >
      <div className="container">
        <div className="final-cta-grid">
          <h2 className="final-cta-title" id="final-cta-title">
            Series 001 Partner Allocation <em>Is Open.</em>
          </h2>
          <div className="final-cta-body">
            <p className="body-text">
              Partner packages available now for Series 001 — Hong Kong.
              Allocation closes once the minimum threshold is reached.
              Production begins <time dateTime="2026-07">Q3 2026</time>.
            </p>
            <div className="cta-group">
              <Link href="/allocation" className="btn btn-primary btn-large">
                View Partner Allocation
              </Link>
              <Link href="/submit" className="btn btn-ghost">
                Apply Now
              </Link>
            </div>
            <p className="disclaimer">
              Submission does not guarantee placement. All requests reviewed
              before confirmation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
