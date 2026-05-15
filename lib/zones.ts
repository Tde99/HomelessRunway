import * as THREE from 'three';
import type { Zone } from './types';

// Shirt model scale: Y ~893–1530, X ~-318 to 318, Z ~-149 to 151
// Front face: Z positive side

export const ZONES: Zone[] = [
  {
    id: 'front-chest',
    label: 'Front Chest',
    center: new THREE.Vector3(0, 1350, 100),   // Upper body, front face
    normal: new THREE.Vector3(0, 0, 1),
    maxSize: 120,
  },
  {
    id: 'front-center',
    label: 'Front Center',
    center: new THREE.Vector3(0, 1150, 120),   // Mid body, front face
    normal: new THREE.Vector3(0, 0, 1),
    maxSize: 160,
  },
  {
    id: 'back-center',
    label: 'Back Center',
    center: new THREE.Vector3(0, 1200, -100),  // Back face
    normal: new THREE.Vector3(0, 0, -1),
    maxSize: 200,
  },
  {
    id: 'sleeve-left',
    label: 'Left Sleeve',
    center: new THREE.Vector3(-180, 1400, -20),
    normal: new THREE.Vector3(-1, 0, 0),
    maxSize: 80,
  },
  {
    id: 'sleeve-right',
    label: 'Right Sleeve',
    center: new THREE.Vector3(180, 1400, -20),
    normal: new THREE.Vector3(1, 0, 0),
    maxSize: 80,
  },
];