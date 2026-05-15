"use client";

import { useRef, useState } from "react";
import type { Zone } from "@/lib/types";
import { ZONES } from "@/lib/zones";

interface Props {
  onPlaceLogo: (zone: Zone, imageUrl: string, size: number) => void;
  onClearAll: () => void;
  onClearZone: (zoneId: string) => void;
}

export default function TshirtControls({
  onPlaceLogo,
  onClearAll,
  onClearZone,
}: Props) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<Zone>(ZONES[0]);
  const [size, setSize] = useState(120);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePlace = () => {
    if (!logoUrl) return;
    onPlaceLogo(selectedZone, logoUrl, size);
  };

  return (
    <div className="absolute top-5 right-5 w-72 bg-black/90 backdrop-blur rounded-2xl p-5 text-white z-10 space-y-4">
      <h2 className="text-lg font-bold">🎨 Logo Yerleştirici</h2>

      {/* Logo Upload */}
      <div>
        <label className="text-xs text-gray-400 block mb-1">Logo Yükle</label>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFile}
          className="w-full text-xs bg-white text-black rounded-lg p-2"
        />
        {logoUrl && (
          <div className="mt-2 w-16 h-16 bg-white rounded-lg flex items-center justify-center border-2 border-green-500">
            <img
              src={logoUrl}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>

      {/* Zone Selector */}
      <div>
        <label className="text-xs text-gray-400 block mb-1">
          Yerleştirme Bölgesi
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ZONES.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              className={`text-xs px-3 py-2 rounded-lg border transition-all ${
                selectedZone.id === zone.id
                  ? "bg-green-500 border-green-400 text-white"
                  : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20"
              }`}
            >
              {zone.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size Slider */}
      <div>
        <label className="text-xs text-gray-400 flex justify-between">
          <span>Logo Boyutu</span>
          <span>{size}</span>
        </label>
        <input
          type="range"
          min={40}
          max={280}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-full mt-1"
        />
      </div>

      {/* Actions */}
      <button
        onClick={handlePlace}
        disabled={!logoUrl}
        className="w-full py-2 bg-green-500 hover:bg-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold text-sm transition-all"
      >
        ✅ Bölgeye Yerleştir
      </button>

      <button
        onClick={() => onClearZone(selectedZone.id)}
        className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm transition-all"
      >
        🗑️ Bu Bölgeyi Temizle
      </button>

      <button
        onClick={onClearAll}
        className="w-full py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm transition-all"
      >
        🗑️ Tümünü Temizle
      </button>
    </div>
  );
}
