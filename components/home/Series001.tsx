import Image from "next/image";

export default function Series001() {
  return (
    <section className="section" id="series" aria-labelledby="series-title">
      <div className="container">
        <div className="section-header">
          <span className="section-num">§ 03</span>
          <h2 className="section-title" id="series-title">
            Series 001 <em>Hong Kong</em>
          </h2>
        </div>
        <div className="series-layout">
          <div className="series-text">
            <p className="body-text">
              Series 001 is the first HOMELESS RUNWAY deployment — 100 verified
              media assets and 800 total placement slots across Hong Kong&apos;s
              highest-density pedestrian corridors.
            </p>
            <p className="body-text">
              Production scheduled <time dateTime="2026-07">Q3 2026</time>.
              Partner allocation currently open.
            </p>
            <div className="stat-row" role="list">
              <div className="stat-card" role="listitem">
                <span className="stat-num">100</span>
                <span className="stat-label">Media Assets</span>
              </div>
              <div className="stat-card" role="listitem">
                <span className="stat-num">800</span>
                <span className="stat-label">Placement Slots</span>
              </div>
              <div className="stat-card" role="listitem">
                <span className="stat-num">8</span>
                <span className="stat-label">Zones Per Asset</span>
              </div>
            </div>
            <div className="deploy-note">
              <p className="deploy-note-text">
                Deployment documentation will be added after Series 001
                production. Visuals on this site are system previews and
                prototype references.
              </p>
            </div>
          </div>
          <div className="series-visual">
            <figure className="lightbox-trigger">
              <Image
                src="/images/hero/hk-network.png"
                alt="Series 001 Hong Kong deployment network — system preview"
                loading="lazy"
                width={1672}
                height={941}
                className="img-full"
              />
              <figcaption className="img-caption">
                Series 001 — Hong Kong / System Preview
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
