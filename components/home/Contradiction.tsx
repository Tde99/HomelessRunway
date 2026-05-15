import Image from "next/image";

export default function Contradiction() {
  return (
    <section
      className="contradiction section"
      id="contradiction"
      aria-labelledby="contradiction-title"
    >
      <div className="contradiction-bg">
        <Image
          src="/images/hero/global-contrast.png"
          alt=""
          loading="lazy"
          aria-hidden="true"
          width={1672}
          height={941}
        />
      </div>
      <div className="contradiction-overlay"></div>
      <div className="container contradiction-content">
        <div className="section-header">
          <span className="section-num section-num--light">§ 06</span>
          <h2
            className="section-title contradiction-title"
            id="contradiction-title"
          >
            The <em>Contradiction</em>
          </h2>
        </div>
        <p className="contradiction-quote">
          Visibility Is Bought.
          <br />
          <em>Invisibility Is Lived.</em>
        </p>
        <p className="contradiction-sub">
          Visibility is monetized globally while invisibility is lived locally.
        </p>
      </div>
    </section>
  );
}
