import { useRef, useCallback } from 'react';
import * as THREE from 'three';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import type { PlacedDecal, Zone } from './types';

export function useDecals(
  sceneRef: React.RefObject<THREE.Scene | null>,
  modelRef: React.RefObject<THREE.Group | null>
) {
  const decalsRef = useRef<PlacedDecal[]>([]);

  const placeDecalOnZone = useCallback((zone: Zone, imageUrl: string, size: number) => {
    const scene = sceneRef.current;
    const model = modelRef.current;
    if (!scene || !model || !imageUrl) return;

    // Raycast from zone center outward to find the actual mesh surface
    const raycaster = new THREE.Raycaster();
    raycaster.set(zone.center, zone.normal);

    const meshes: THREE.Mesh[] = [];
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) meshes.push(child as THREE.Mesh);
    });

    const hits = raycaster.intersectObjects(meshes, true);

    let hitPoint: THREE.Vector3;
    let hitNormal: THREE.Vector3;
    let hitMesh: THREE.Mesh;

    if (hits.length > 0) {
      const hit = hits[0];
      hitPoint = hit.point;
      hitNormal = hit.face!.normal.clone().transformDirection(hit.object.matrixWorld);
      hitMesh = hit.object as THREE.Mesh;
    } else {
      // Fallback: use zone center directly cast onto nearest mesh surface
      // by raycasting from further back
      const farOrigin = zone.center.clone().sub(zone.normal.clone().multiplyScalar(500));
      raycaster.set(farOrigin, zone.normal);
      const hits2 = raycaster.intersectObjects(meshes, true);
      if (hits2.length === 0) return;
      const hit = hits2[0];
      hitPoint = hit.point;
      hitNormal = hit.face!.normal.clone().transformDirection(hit.object.matrixWorld);
      hitMesh = hit.object as THREE.Mesh;
    }

    const texture = new THREE.TextureLoader().load(imageUrl);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      side: THREE.DoubleSide,
    });

    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      hitNormal
    );
    const euler = new THREE.Euler().setFromQuaternion(quaternion);

    const decalSize = new THREE.Vector3(size, size, size);
    const geometry = new DecalGeometry(hitMesh, hitPoint, euler, decalSize);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const decal: PlacedDecal = {
      id: crypto.randomUUID(),
      zoneId: zone.id,
      mesh,
    };
    decalsRef.current.push(decal);

    // Remove previous decal on same zone (one logo per zone)
    const previous = decalsRef.current.filter(
      (d) => d.zoneId === zone.id && d.id !== decal.id
    );
    previous.forEach((d) => {
      scene.remove(d.mesh);
      d.mesh.geometry.dispose();
      (d.mesh.material as THREE.Material).dispose();
    });
    decalsRef.current = decalsRef.current.filter(
      (d) => d.zoneId !== zone.id || d.id === decal.id
    );
  }, []);

  const clearAll = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    decalsRef.current.forEach((d) => {
      scene.remove(d.mesh);
      d.mesh.geometry.dispose();
      (d.mesh.material as THREE.Material).dispose();
    });
    decalsRef.current = [];
  }, []);

  const clearZone = useCallback((zoneId: string) => {
    const scene = sceneRef.current;
    if (!scene) return;
    decalsRef.current
      .filter((d) => d.zoneId === zoneId)
      .forEach((d) => {
        scene.remove(d.mesh);
        d.mesh.geometry.dispose();
        (d.mesh.material as THREE.Material).dispose();
      });
    decalsRef.current = decalsRef.current.filter((d) => d.zoneId !== zoneId);
  }, []);

  return { placeDecalOnZone, clearAll, clearZone };
}