export interface PackageData {
  name: string;
  price: number;
  label: string;
  zones: string;
  placements: number;
  assets: number;
  badge?: string;
  badgeType?: "recommended" | "limited";
}

export interface ZoneDef {
  id: string;
  label: string;
  side: "front" | "back" | "left" | "right";
  nx: number;
  ny: number;
  w: number;
  h: number;
  zExtra?: number;
}

export interface NavLink {
  href: string;
  label: string;
  isCta?: boolean;
}

export interface AllocationFormState {
  currentStep: number;
  selectedPackage: string | null;
  selectedPrice: number | null;
  selectedLabel: string | null;
  selectedZones: Set<string>;
  primaryLogoName: string | null;
  primaryLogoDataUrl: string | null;
}
