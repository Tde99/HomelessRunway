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


