"use client";

import { useRef } from "react";
import { useThreeScene } from "@/lib/useThreeScene";
import { useDecals } from "@/lib/useDecals";
import TshirtControls from "./tShirtControls";
import type { Zone } from "@/lib/types";

export default function TshirtViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { sceneRef, modelRef } = useThreeScene(mountRef);
  const { placeDecalOnZone, clearAll, clearZone } = useDecals(
    sceneRef,
    modelRef,
  );

  const handlePlaceLogo = (zone: Zone, imageUrl: string, size: number) => {
    placeDecalOnZone(zone, imageUrl, size);
  };

  return (
    <div className="relative w-screen h-screen">
      <div ref={mountRef} className="w-full h-full" />
      <TshirtControls
        onPlaceLogo={handlePlaceLogo}
        onClearAll={clearAll}
        onClearZone={clearZone}
      />
    </div>
  );
}
