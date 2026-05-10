"use client";

import { useEffect, useRef } from "react";

interface GarmentViewerProps {
  onZoneToggle?: (zoneId: string, selected: boolean) => void;
}

export default function GarmentViewer({ onZoneToggle }: GarmentViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initRef = useRef(false);
  const onZoneToggleRef = useRef(onZoneToggle);
  onZoneToggleRef.current = onZoneToggle;

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const loadThree = async () => {
      // Load Three.js from CDN
      if (!(window as unknown as Record<string, unknown>).THREE) {
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js",
        );
      }
      initGarment3d(onZoneToggleRef);
    };

    loadThree();
  }, []);

  return (
    <div className="sb-garment" id="sb-garment-viewer">
      <div
        className="sb-garment-tabs"
        role="tablist"
        aria-label="Garment views"
      >
        <button
          type="button"
          className="sb-garment-tab is-active"
          data-view="front"
          role="tab"
          aria-selected="true"
        >
          Front
        </button>
        <button
          type="button"
          className="sb-garment-tab"
          data-view="back"
          role="tab"
          aria-selected="false"
        >
          Back
        </button>
        <button
          type="button"
          className="sb-garment-tab"
          data-view="left"
          role="tab"
          aria-selected="false"
        >
          Left Sleeve
        </button>
        <button
          type="button"
          className="sb-garment-tab"
          data-view="right"
          role="tab"
          aria-selected="false"
        >
          Right Sleeve
        </button>
      </div>
      <div className="sb-garment-stage sb-garment-stage--3d">
        <canvas
          ref={canvasRef}
          id="sb-garment-canvas"
          className="sb-garment-canvas"
          aria-label="3D garment preview — drag to rotate, click zones to select"
        ></canvas>
        <p className="sb-drag-hint" id="sb-drag-hint" aria-hidden="true">
          ← Drag to rotate · Click zones to select →
        </p>
        <div id="sb-garment-fallback" className="sb-garment-fallback" hidden>
          <p className="sb-note">
            3D preview unavailable in this browser. Please use a WebGL-enabled
            browser.
          </p>
        </div>
      </div>
    </div>
  );
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function initGarment3d(
  onZoneToggleRef: React.RefObject<
    ((zoneId: string, selected: boolean) => void) | undefined
  >,
) {
  // This loads the garment3d.js logic inline
  // The full 3D viewer is initialized here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const THREE = (window as unknown as Record<string, unknown>).THREE as any;
  if (!THREE) return;

  const canvas = document.getElementById(
    "sb-garment-canvas",
  ) as HTMLCanvasElement | null;
  if (!canvas) return;

  // WebGL check
  try {
    const ctx =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!ctx) throw new Error("No WebGL");
  } catch {
    canvas.style.display = "none";
    const fb = document.getElementById("sb-garment-fallback");
    if (fb) fb.removeAttribute("hidden");
    return;
  }

  const ZONE_DEFS = [
    {
      id: "f1",
      label: "Front Left Support",
      side: "front",
      nx: -0.55,
      ny: 0.55,
      w: 0.55,
      h: 0.4,
      zExtra: 0.0,
    },
    {
      id: "f2",
      label: "Front Right Support",
      side: "front",
      nx: 0.55,
      ny: 0.55,
      w: 0.55,
      h: 0.4,
      zExtra: 0.0,
    },
    {
      id: "f3",
      label: "Front Hero",
      side: "front",
      nx: 0.0,
      ny: 0.0,
      w: 1.1,
      h: 0.65,
      zExtra: 0.0,
    },
    {
      id: "b1",
      label: "Back Hero",
      side: "back",
      nx: 0.0,
      ny: 0.45,
      w: 1.1,
      h: 0.75,
      zExtra: 0.0,
    },
    {
      id: "b2",
      label: "Back Left Support",
      side: "back",
      nx: -0.5,
      ny: -0.28,
      w: 0.55,
      h: 0.4,
      zExtra: 0.0,
    },
    {
      id: "b3",
      label: "Back Right Support",
      side: "back",
      nx: 0.5,
      ny: -0.28,
      w: 0.55,
      h: 0.4,
      zExtra: 0.0,
    },
    {
      id: "s1",
      label: "Left Sleeve Motion",
      side: "left",
      nx: -2.27,
      ny: 1.3,
      w: 0.46,
      h: 0.46,
    },
    {
      id: "s2",
      label: "Right Sleeve Motion",
      side: "right",
      nx: 2.27,
      ny: 1.3,
      w: 0.46,
      h: 0.46,
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const T = THREE as any;
  const W = canvas.parentElement?.offsetWidth || 700;
  const H = Math.min(500, W * 0.72);
  canvas.width = W;
  canvas.height = H;

  const scene = new T.Scene();
  scene.background = new T.Color(0x080806);

  const camera = new T.PerspectiveCamera(42, W / H, 0.1, 100);
  let camZ = 7;
  let targetCamZ = 7;
  camera.position.set(0, 0, camZ);
  camera.lookAt(0, 0, 0);

  const renderer = new T.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
  });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.physicallyCorrectLights = true;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  // Lights
  scene.add(new T.AmbientLight(0xffffff, 1.2));
  const key = new T.DirectionalLight(0xffffff, 3.5);
  key.position.set(3, 4, 5);
  key.castShadow = true;
  scene.add(key);
  const fill = new T.DirectionalLight(0xffffff, 1.5);
  fill.position.set(-3, 2, 3);
  scene.add(fill);
  const rim = new T.DirectionalLight(0xfff5e8, 0.8);
  rim.position.set(0, -3, -4);
  scene.add(rim);
  const top = new T.DirectionalLight(0xffffff, 1.0);
  top.position.set(0, 5, 2);
  scene.add(top);

  const raycaster = new T.Raycaster();
  const shirtGroup = new T.Group();
  scene.add(shirtGroup);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const zoneMeshes: any[] = [];
  const selectedZones = new Set<string>();
  let isDragging = false;
  let prevMouse = { x: 0, y: 0 };
  let rotY = 0,
    targetRotY = 0;
  let rotX = 0,
    targetRotX = 0;
  const ZOOM_MIN = 3.5,
    ZOOM_MAX = 12.0,
    ZOOM_SPEED = 0.8;

  function clampZoom(z: number) {
    return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z));
  }

  // Build shirt
  if (T.GLTFLoader) {
    const loader = new T.GLTFLoader();
    loader.load(
      "/models/tshirt1.glb",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (gltf: any) => {
        const model = gltf.scene;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        model.traverse((child: any) => {
          if (child.isMesh) {
            const mats = Array.isArray(child.material)
              ? child.material
              : [child.material];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            mats.forEach((m: any) => {
              if (m) {
                m.side = T.DoubleSide;
                m.needsUpdate = true;
              }
            });
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        const SCALE = 5.0 / 637.1;
        model.scale.setScalar(SCALE);
        model.position.set(0.3 * SCALE, -1212.0 * SCALE, -1.0 * SCALE);
        shirtGroup.add(model);
        const box = new T.Box3().setFromObject(model);
        buildZonePlanes(box.max.z + 0.012, box.min.z - 0.012);
      },
      undefined,
      () => {
        const geo = new T.BoxGeometry(1.5, 2, 0.3);
        const mat = new T.MeshStandardMaterial({
          color: 0xf4f2ed,
          roughness: 0.75,
        });
        shirtGroup.add(new T.Mesh(geo, mat));
        buildZonePlanes(1.185, -1.185);
      },
    );
  } else {
    const geo = new T.BoxGeometry(1.5, 2, 0.3);
    const mat = new T.MeshStandardMaterial({
      color: 0xf4f2ed,
      roughness: 0.75,
    });
    shirtGroup.add(new T.Mesh(geo, mat));
    buildZonePlanes(1.185, -1.185);
  }

  function buildZonePlanes(FRONT_Z: number, BACK_Z: number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ZONE_DEFS.forEach((def: any) => {
      const geo = new T.PlaneGeometry(def.w, def.h);
      const tc = document.createElement("canvas");
      tc.width = 256;
      tc.height = 256;
      const ctx = tc.getContext("2d")!;
      ctx.clearRect(0, 0, 256, 256);
      ctx.strokeStyle =
        def.id === "f3" || def.id === "b1" ? "#080806" : "#7a7672";
      ctx.lineWidth = def.id === "f3" || def.id === "b1" ? 5 : 3.5;
      ctx.setLineDash([14, 8]);
      ctx.strokeRect(6, 6, 244, 244);
      ctx.fillStyle = "#080806";
      ctx.font = `bold ${def.id === "f3" || def.id === "b1" ? 28 : 22}px monospace`;
      ctx.textAlign = "center";
      ctx.fillText(def.id.toUpperCase(), 128, 148);

      const tex = new T.CanvasTexture(tc);
      const mat = new T.MeshBasicMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        depthTest: true,
        side: T.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4,
      });

      const mesh = new T.Mesh(geo, mat);
      mesh.userData = { zoneId: def.id, zoneLabel: def.label, selected: false };

      if (def.side === "front") {
        mesh.position.set(def.nx, def.ny, FRONT_Z);
      } else if (def.side === "back") {
        mesh.position.set(-def.nx, def.ny, BACK_Z);
        mesh.rotation.y = Math.PI;
      } else if (def.side === "left" || def.side === "right") {
        mesh.position.set(def.nx, def.ny, 0.1);
        mesh.rotation.y = -Math.PI / 2.0;
        mesh.rotation.z = 1.5;
        mesh.rotation.x = 0.1;
      }

      shirtGroup.add(mesh);
      zoneMeshes.push(mesh);
    });
  }

  function selectZoneById(id: string) {
    const mesh = zoneMeshes.find(
      (m: { userData: { zoneId: string } }) => m.userData.zoneId === id,
    );
    if (!mesh) return;
    const newState = !mesh.userData.selected;
    mesh.userData.selected = newState;
    if (newState) selectedZones.add(id);
    else selectedZones.delete(id);
    updateZonesReadout();
    onZoneToggleRef.current?.(id, newState);
  }

  function updateZonesReadout() {
    const labels: Record<string, string> = {
      f1: "Front Left Support",
      f2: "Front Right Support",
      f3: "Front Hero",
      b1: "Back Hero",
      b2: "Back Left Support",
      b3: "Back Right Support",
      s1: "Left Sleeve Motion",
      s2: "Right Sleeve Motion",
    };
    const selected = Array.from(selectedZones)
      .map((id) => labels[id] || id)
      .join(", ");
    const list = document.getElementById("sb-zones-list");
    const hidden = document.getElementById(
      "sb-h-zones",
    ) as HTMLInputElement | null;
    if (list) list.textContent = selected || "None selected";
    if (hidden) hidden.value = selected || "None";
  }

  // Public API
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).garment3dHighlight = (packageName: string) => {
    const zoneMap: Record<string, string[]> = {
      "Support Allocation": ["f1", "f2", "b2", "b3"],
      "Motion Allocation": ["s1", "s2"],
      "Hero Allocation": ["f3", "b1"],
      "Editorial Entry Allocation": ["f3", "b1", "s1", "s2", "f1", "f2"],
      "Founding Partner Allocation": [
        "f3",
        "b1",
        "s1",
        "s2",
        "f1",
        "f2",
        "b2",
        "b3",
      ],
    };
    zoneMeshes.forEach((m: { userData: { selected: boolean } }) => {
      m.userData.selected = false;
    });
    selectedZones.clear();
    (zoneMap[packageName] || []).forEach((id: string) => {
      const mesh = zoneMeshes.find(
        (m: { userData: { zoneId: string } }) => m.userData.zoneId === id,
      );
      if (mesh) {
        mesh.userData.selected = true;
        selectedZones.add(id);
      }
    });
    updateZonesReadout();
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).garment3dSelectZone = selectZoneById;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).garment3dGetSelected = () => new Set(selectedZones);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).garment3dZoom = (delta: number) => {
    targetCamZ = clampZoom(targetCamZ + delta);
  };

  // Events
  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    prevMouse = { x: e.clientX, y: e.clientY };
  });
  canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    targetRotY += (e.clientX - prevMouse.x) * 0.012;
    targetRotX += (e.clientY - prevMouse.y) * 0.012;
    targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX));
    prevMouse = { x: e.clientX, y: e.clientY };
  });
  canvas.addEventListener("mouseup", () => {
    isDragging = false;
  });
  canvas.addEventListener("mouseleave", () => {
    isDragging = false;
  });
  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      targetCamZ = clampZoom(
        targetCamZ + (e.deltaY > 0 ? ZOOM_SPEED : -ZOOM_SPEED),
      );
    },
    { passive: false },
  );

  canvas.addEventListener("click", (e) => {
    if (Math.abs(targetRotY - rotY) > 0.05) return;
    const rect = canvas.getBoundingClientRect();
    const mouse = new T.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(zoneMeshes);
    if (hits.length > 0) selectZoneById(hits[0].object.userData.zoneId);
  });

  // View tabs
  document.querySelectorAll(".sb-garment-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      const snapMap: Record<string, number> = {
        front: 0,
        back: Math.PI,
        left: -Math.PI / 2,
        right: Math.PI / 2,
      };
      const view = (btn as HTMLElement).dataset.view || "";
      if (snapMap[view] !== undefined) targetRotY = snapMap[view];
      document.querySelectorAll(".sb-garment-tab").forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
    });
  });

  // Animate
  function animate() {
    requestAnimationFrame(animate);
    rotY += (targetRotY - rotY) * 0.1;
    rotX += (targetRotX - rotX) * 0.1;
    shirtGroup.rotation.y = rotY;
    shirtGroup.rotation.x = rotX;
    camZ += (targetCamZ - camZ) * 0.1;
    camera.position.z = camZ;
    renderer.render(scene, camera);
  }
  animate();

  // Resize
  window.addEventListener("resize", () => {
    const w = canvas.parentElement?.offsetWidth || 700;
    const h = Math.min(500, w * 0.72);
    canvas.width = w;
    canvas.height = h;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}
