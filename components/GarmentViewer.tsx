"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { DecalGeometry } from "three/addons/geometries/DecalGeometry.js";
import { ZONE_DEFS } from "@/lib/constants";

interface LogoState {
  id: string;
  file: File | null;
  preview: string;
  selectedZones: string[];
  label: string;
}

interface GarmentViewerProps {
  logos?: LogoState[];
  activeLogoId?: string;
  onZoneToggle?: (zoneId: string) => void;
  /** Hide controls for read-only preview (e.g. review step) */
  readOnly?: boolean;
}

// Zone snap points derived from your actual tshirt1.glb bounding boxes
// Tweak these after first render using the debug spheres below
const ZONE_SNAP: Record<
  string,
  { center: THREE.Vector3; normal: THREE.Vector3 }
> = {
  f1: {
    center: new THREE.Vector3(-70, 1380, -110),
    normal: new THREE.Vector3(0, 0, -1),
  },
  f2: {
    center: new THREE.Vector3(70, 1380, -110),
    normal: new THREE.Vector3(0, 0, -1),
  },
  f3: {
    center: new THREE.Vector3(0, 1160, -120),
    normal: new THREE.Vector3(0, 0, -1),
  },
  b1: {
    center: new THREE.Vector3(0, 1250, 100),
    normal: new THREE.Vector3(0, 0, 1),
  },
  b2: {
    center: new THREE.Vector3(-80, 1100, 100),
    normal: new THREE.Vector3(0, 0, 1),
  },
  b3: {
    center: new THREE.Vector3(80, 1100, 100),
    normal: new THREE.Vector3(0, 0, 1),
  },
  s1: {
    center: new THREE.Vector3(-190, 1400, -20),
    normal: new THREE.Vector3(-1, 0, 0),
  },
  s2: {
    center: new THREE.Vector3(190, 1400, -20),
    normal: new THREE.Vector3(1, 0, 0),
  },
};

// Hero zones are 2.5× larger than support zones
const DECAL_SIZE_SUPPORT = 100;
const DECAL_SIZE_HERO = DECAL_SIZE_SUPPORT * 2.5; // 250

const ZONE_DECAL_SIZE: Record<string, number> = {
  f1: DECAL_SIZE_SUPPORT,
  f2: DECAL_SIZE_SUPPORT,
  f3: DECAL_SIZE_HERO,
  b1: DECAL_SIZE_HERO,
  b2: DECAL_SIZE_SUPPORT,
  b3: DECAL_SIZE_SUPPORT,
  s1: DECAL_SIZE_SUPPORT,
  s2: DECAL_SIZE_SUPPORT,
};

export default function GarmentViewer({
  logos = [],
  activeLogoId,
  onZoneToggle,
  readOnly = false,
}: GarmentViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const decalMeshesRef = useRef<THREE.Mesh[]>([]);
  const animIdRef = useRef<number>(0);

  // --- Init Three.js scene once ---
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      1,
      5000,
    );
    camera.position.set(0, 1200, 900);
    camera.lookAt(0, 1200, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1200, 0);
    controls.update();
    controlsRef.current = controls;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(300, 600, 400);
    scene.add(dirLight);
    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.4);
    fillLight.position.set(-300, 200, -300);
    scene.add(fillLight);

    // Load model
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
    );
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load("/models/tshirt1.glb", (gltf) => {
      const model = gltf.scene;
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      scene.add(model);
      modelRef.current = model;
    });

    // Animate
    const animate = () => {
      animIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(animIdRef.current);
      ro.disconnect();
      renderer.dispose();
      if (mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);
    };
  }, []);

  // --- Re-render decals whenever logos change ---
  useEffect(() => {
    const scene = sceneRef.current;
    const model = modelRef.current;
    if (!scene || !model) return;

    // Clear old decals
    decalMeshesRef.current.forEach((m) => {
      scene.remove(m);
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    });
    decalMeshesRef.current = [];

    // Collect meshes for raycasting
    const meshes: THREE.Mesh[] = [];
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) meshes.push(child as THREE.Mesh);
    });
    if (meshes.length === 0) return;

    logos.forEach((logo) => {
      if (!logo.preview) return;
      logo.selectedZones.forEach((zoneId) => {
        const snap = ZONE_SNAP[zoneId];
        if (!snap) return;

        // Raycast from behind the surface to find hit point
        const origin = snap.center
          .clone()
          .sub(snap.normal.clone().multiplyScalar(400));
        const raycaster = new THREE.Raycaster(
          origin,
          snap.normal.clone().normalize(),
        );
        const hits = raycaster.intersectObjects(meshes, true);
        if (hits.length === 0) return;

        const hit = hits[0];
        const hitPoint = hit.point;
        const hitNormal = hit
          .face!.normal.clone()
          .transformDirection(hit.object.matrixWorld);
        const hitMesh = hit.object as THREE.Mesh;

        const texture = new THREE.TextureLoader().load(logo.preview);
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
          hitNormal,
        );
        const euler = new THREE.Euler().setFromQuaternion(quaternion);

        const size = ZONE_DECAL_SIZE[zoneId] ?? DECAL_SIZE_SUPPORT;
        const geometry = new DecalGeometry(
          hitMesh,
          hitPoint,
          euler,
          new THREE.Vector3(size, size, size),
        );

        const decalMesh = new THREE.Mesh(geometry, material);
        scene.add(decalMesh);
        decalMeshesRef.current.push(decalMesh);
      });
    });
  }, [logos]);

  return (
    <div
      className="sb-garment"
      id="sb-garment-viewer"
      style={{ position: "relative" }}
    >
      {/* Three.js canvas */}
      <div ref={mountRef} style={{ width: "100%", height: "480px" }} />
    </div>
  );
}
