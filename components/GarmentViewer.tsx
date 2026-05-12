"use client";

import { useMemo, useState } from "react";
import { ZONE_DEFS } from "@/lib/constants";

interface LogoState {
  id: string;
  file: File | null;
  preview: string;
  selectedZones: string[];
  label: string;
}

interface GarmentViewerProps {
  selectedZones?: string[];
  logos?: LogoState[];
  onZoneToggle?: (zoneId: string, selected: boolean) => void;
}

const VIEW_IMAGES = {
  front: {
    src: "/images/garments/tshirt-front.png",
    alt: "T-shirt front preview",
  },
  back: {
    src: "/images/garments/tshirt-back.png",
    alt: "T-shirt back preview",
  },
  left: {
    src: "/images/garments/tshirt-left.png",
    alt: "T-shirt left sleeve preview",
  },
  right: {
    src: "/images/garments/tshirt-right.png",
    alt: "T-shirt right sleeve preview",
  },
} as const;

type GarmentView = keyof typeof VIEW_IMAGES;

const ZONE_POSITIONS: Record<string, React.CSSProperties> = {
  f1: { top: "25%", left: "15%", width: "20%", height: "15%" },
  f2: { top: "25%", right: "15%", width: "20%", height: "15%" },
  f3: { top: "35%", left: "50%", transform: "translateX(-50%)", width: "25%", height: "20%" },
  b1: { top: "30%", left: "50%", transform: "translateX(-50%)", width: "25%", height: "20%" },
  b2: { bottom: "25%", left: "15%", width: "20%", height: "15%" },
  b3: { bottom: "25%", right: "15%", width: "20%", height: "15%" },
  s1: { top: "35%", left: "5%", width: "15%", height: "20%" },
  s2: { top: "35%", right: "5%", width: "15%", height: "20%" },
};

export default function GarmentViewer({
  selectedZones = [],
  logos = [],
  onZoneToggle,
}: GarmentViewerProps) {
  const [view, setView] = useState<GarmentView>("front");
  const selected = useMemo(() => VIEW_IMAGES[view], [view]);
  const zonesForView = useMemo(() => {
    const allZones: string[] = [];
    logos.forEach((logo) => {
      allZones.push(...logo.selectedZones);
    });
    return allZones.filter((zoneId) => {
      const zone = ZONE_DEFS.find((z) => z.id === zoneId);
      return zone?.side === view;
    });
  }, [logos, view]);

  return (
    <div className="sb-garment" id="sb-garment-viewer">
      <div className="sb-garment-tabs" role="tablist" aria-label="Garment views">
        {Object.keys(VIEW_IMAGES).map((key) => {
          const viewKey = key as GarmentView;
          return (
            <button
              key={String(viewKey)}
              type="button"
              className={`sb-garment-tab${view === viewKey ? " is-active" : ""}`}
              role="tab"
              aria-selected={view === viewKey}
              onClick={() => setView(viewKey)}
            >
              {viewKey === "front" ? "Front" : viewKey === "back" ? "Back" : viewKey === "left" ? "Left Sleeve" : "Right Sleeve"}
            </button>
          );
        })}
      </div>
      <div className="sb-garment-stage sb-garment-stage--3d">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={selected.src}
          alt={selected.alt}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        {logos.map((logo) =>
          logo.selectedZones
            .filter((zoneId) => {
              const zone = ZONE_DEFS.find((z) => z.id === zoneId);
              return zone?.side === view;
            })
            .map((zoneId) => (
              <img
                key={`${logo.id}-${zoneId}`}
                src={logo.preview}
                alt={`${logo.label} in ${zoneId}`}
                style={{
                  position: "absolute",
                  ...ZONE_POSITIONS[zoneId],
                  objectFit: "contain",
                  pointerEvents: "none",
                }}
              />
            ))
        )}
      </div>
    </div>
  );
}
