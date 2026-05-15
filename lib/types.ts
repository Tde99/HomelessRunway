import * as THREE from 'three';

export interface Zone {
  id: string;
  label: string;
  // World-space center of the placement target point
  center: THREE.Vector3;
  // Normal direction to face out from (shirt surface direction)
  normal: THREE.Vector3;
  // Max decal size in world units
  maxSize: number;
}

export interface PlacedDecal {
  id: string;
  zoneId: string;
  mesh: THREE.Mesh;
}