import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer-inner">
        <Image
          src="/images/branding/hr-monogram.png"
          alt="HOMELESS RUNWAY monogram"
          className="footer-monogram"
          loading="lazy"
          width={26}
          height={26}
        />
        <p className="footer-text">
          HOMELESS RUNWAY — Global OOH Media Infrastructure
        </p>
        <nav className="footer-nav" aria-label="Footer navigation">
          <Link href="/">Home</Link>
          <Link href="/allocation">Partner Allocation</Link>
          <Link href="/submit">Apply</Link>
        </nav>
      </div>
      <div className="container footer-series-line">
        <span className="footer-series-item">
          Series 001 — Hong Kong — Allocation Open
        </span>
        <span className="footer-series-item footer-series-next">
          Series 002 — TBD — Enquiries Open
        </span>
      </div>
    </footer>
  );
}
