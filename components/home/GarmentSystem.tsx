import Image from "next/image";
import GarmentViewer from "@/components/GarmentViewer";

export default function GarmentSystem() {
  return (
    <section className="section" id="garment" aria-labelledby="garment-title">
      <div className="container">
        <div className="section-header">
          <span className="section-num">§ 04</span>
          <h2 className="section-title" id="garment-title">
            Garment <em>System</em>
          </h2>
        </div>

        <GarmentViewer />

        <div className="layout-grid">
          <div className="layout-visual">
            <figure className="lightbox-trigger garment-zones-figure">
              <Image
                src="/images/garments/garment-zones-white.png"
                alt="Series 001 garment prototype — four views showing Hero, Support and Motion placement zones on white garments"
                loading="lazy"
                width={1672}
                height={941}
                className="img-full"
              />
              <figcaption className="img-caption">
                Series 001 — Garment Prototype / Placement Zone Reference
              </figcaption>
            </figure>
          </div>
          <div className="layout-text">
            <p className="body-text">
              Each Series 001 asset carries 8 fixed placement zones across a
              standardised garment layout — identical across the entire fleet.
            </p>
            <div className="placement-list">
              <div className="placement-item">
                <div className="placement-tag">Hero</div>
                <div>
                  <p className="placement-name">Hero Placement</p>
                  <p className="placement-desc">
                    Primary front / back visibility
                  </p>
                </div>
                <div className="placement-count">×2</div>
              </div>
              <div className="placement-item">
                <div className="placement-tag">Motion</div>
                <div>
                  <p className="placement-name">Motion Placement</p>
                  <p className="placement-desc">Sleeve-based visibility</p>
                </div>
                <div className="placement-count">×2</div>
              </div>
              <div className="placement-item">
                <div className="placement-tag">Support</div>
                <div>
                  <p className="placement-name">Support Placement</p>
                  <p className="placement-desc">
                    Secondary editorial placement
                  </p>
                </div>
                <div className="placement-count">×4</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
