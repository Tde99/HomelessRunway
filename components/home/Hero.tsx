import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero" aria-label="Hero — HOMELESS RUNWAY Series 001">
      <div className="hero-bg">
        <Image
          src="/images/hero/hero-world.png"
          alt=""
          aria-hidden="true"
          className="hero-img"
          width={1672}
          height={941}
          priority
        />
      </div>
      <div className="hero-overlay"></div>
      <div className="container hero-content">
        <div className="hero-body">
          <p className="hero-wordmark">HOMELESS RUNWAY</p>
          <p className="label hero-label">Global OOH Media Infrastructure</p>
          <h1 className="hero-title">
            Partner Logos.
            <br />
            <em>City-Scale Reach.</em>
          </h1>
          <p className="hero-sub">
            HOMELESS RUNWAY places partner brand logos on garments deployed
            across high-density urban zones — structured as distributed media
            inventory, not individual sponsorship.
          </p>
          <p className="hero-meta">
            Series 001 — Hong Kong &nbsp;/&nbsp; 100 assets &nbsp;/&nbsp; 800
            placement slots
          </p>
          <div className="hero-actions">
            <Link href="/allocation" className="btn btn-primary">
              View Partner Allocation
            </Link>
            <Link href="/submit" className="btn btn-ghost">
              Apply For Series 001
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
