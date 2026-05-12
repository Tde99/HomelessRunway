export default function Ticker() {
  const items = [
    "Series 001 — Hong Kong",
    "100 Media Assets",
    "800 Placement Slots",
    "Partner Allocation Open",
    "Q3 2026 Production",
    "One Placement Per Brand Per Asset",
    "No Full-Asset Takeovers",
  ];

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {[...items, ...items].map((item, i) => (
          <span key={i}>
            {i > 0 && <span className="ticker-sep">—</span>}
            <span>{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
