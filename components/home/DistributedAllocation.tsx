export default function DistributedAllocation() {
  return (
    <section
      className="section section-dark"
      id="distribution"
      aria-labelledby="dist-title"
    >
      <div className="container">
        <div className="section-header">
          <span className="section-num">§ 05</span>
          <h2 className="section-title" id="dist-title">
            Distributed <em>Allocation</em>
          </h2>
        </div>
        <div className="two-col two-col--wide">
          <div>
            <p className="dist-lead">
              No partner owns a single asset. No asset carries one partner.
            </p>
            <p className="body-text">
              Every logo is spread across the full fleet — keeping the system
              multi-partner, balanced, and commercially defensible across every
              series.
            </p>
          </div>
          <div className="dist-rules">
            <div className="dist-rule">
              <span className="dist-rule-text">
                Each partner may appear a maximum of one time per shirt.
              </span>
            </div>
            <div className="dist-rule">
              <span className="dist-rule-text">
                Full-shirt takeovers are not available under any package.
              </span>
            </div>
            <div className="dist-rule">
              <span className="dist-rule-text">
                Same-shirt clustering is not available.
              </span>
            </div>
            <div className="dist-rule">
              <span className="dist-rule-text">
                All submissions reviewed before confirmation.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
