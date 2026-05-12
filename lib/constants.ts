import { PackageData, ZoneDef } from "@/types";

export const PACKAGES: PackageData[] = [
  {
    name: "Support Allocation",
    price: 300,
    label: "Support Allocation — $300",
    zones: "20 × Support placements",
    placements: 20,
    assets: 20,
  },
  {
    name: "Motion Allocation",
    price: 500,
    label: "Motion Allocation — $500",
    zones: "20 × Motion placements",
    placements: 20,
    assets: 20,
  },
  {
    name: "Hero Allocation",
    price: 900,
    label: "Hero Allocation — $900",
    zones: "20 × Hero placements",
    placements: 20,
    assets: 20,
  },
  {
    name: "Editorial Entry Allocation",
    price: 1000,
    label: "Editorial Entry — $1,000",
    zones: "10 Hero + 10 Motion + 20 Support",
    placements: 40,
    assets: 40,
    badge: "Recommended",
    badgeType: "recommended",
  },
  {
    name: "Founding Partner Allocation",
    price: 2000,
    label: "Founding Partner — $2,000",
    zones: "20 Hero + 20 Motion + 40 Support",
    placements: 80,
    assets: 80,
    badge: "Limited",
    badgeType: "limited",
  },
];

export const ZONE_DEFS: ZoneDef[] = [
  { id: "f1", label: "Front Left Support", side: "front", nx: -0.55, ny: 0.55, w: 0.55, h: 0.4, zExtra: 0.0 },
  { id: "f2", label: "Front Right Support", side: "front", nx: 0.55, ny: 0.55, w: 0.55, h: 0.4, zExtra: 0.0 },
  { id: "f3", label: "Front Hero", side: "front", nx: 0.0, ny: 0.0, w: 1.1, h: 0.65, zExtra: 0.0 },
  { id: "b1", label: "Back Hero", side: "back", nx: 0.0, ny: 0.45, w: 1.1, h: 0.75, zExtra: 0.0 },
  { id: "b2", label: "Back Left Support", side: "back", nx: -0.5, ny: -0.28, w: 0.55, h: 0.4, zExtra: 0.0 },
  { id: "b3", label: "Back Right Support", side: "back", nx: 0.5, ny: -0.28, w: 0.55, h: 0.4, zExtra: 0.0 },
  { id: "s1", label: "Left Sleeve Motion", side: "left", nx: -2.27, ny: 1.3, w: 0.46, h: 0.46 },
  { id: "s2", label: "Right Sleeve Motion", side: "right", nx: 2.27, ny: 1.3, w: 0.46, h: 0.46 },
];

export const ZONE_LABELS: Record<string, string> = {
  f1: "Front Left Support",
  f2: "Front Right Support",
  f3: "Front Hero",
  b1: "Back Hero",
  b2: "Back Left Support",
  b3: "Back Right Support",
  s1: "Left Sleeve Motion",
  s2: "Right Sleeve Motion",
};

export const PACKAGE_ZONE_MAP: Record<string, string[]> = {
  "Support Allocation": ["f1", "f2", "b2", "b3"],
  "Motion Allocation": ["s1", "s2"],
  "Hero Allocation": ["f3", "b1"],
  "Editorial Entry Allocation": ["f3", "b1", "s1", "s2", "f1", "f2"],
  "Founding Partner Allocation": ["f3", "b1", "s1", "s2", "f1", "f2", "b2", "b3"],
};

export const INDUSTRY_OPTIONS = [
  "Fashion / Apparel",
  "Food & Beverage",
  "Music / Nightlife",
  "Art / Gallery",
  "Technology",
  "Creator / Personal Brand",
  "Hospitality",
  "Local Business",
  "Agency / Media",
  "Other",
];
