/**
 * Convert a File (PDF, SVG, or raster image) to a rasterised PNG blob-URL
 * that can be used in <img> tags and Three.js TextureLoader.
 *
 * - PNG / JPEG / WebP / GIF → returned as-is via createObjectURL
 * - SVG → drawn onto a canvas at high resolution, returned as PNG blob-URL
 * - PDF → first page rendered via pdf.js, returned as PNG blob-URL
 * - AI / EPS → not supported in-browser; returns null
 */

const RASTER_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/bmp",
];

/** Maximum rasterisation dimension (px) for PDFs and SVGs */
const MAX_DIM = 2048;

/* ---------- helpers ---------- */

function canvasToBlobUrl(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Canvas toBlob failed"));
      resolve(URL.createObjectURL(blob));
    }, "image/png");
  });
}

function rasteriseSvg(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const svgText = reader.result as string;
      const img = new Image();
      // Encode as data-URI so the image loads synchronously-ish
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
      img.onload = () => {
        const w = img.naturalWidth || 800;
        const h = img.naturalHeight || 800;
        const scale = Math.min(1, MAX_DIM / Math.max(w, h));
        const cw = Math.round(w * scale);
        const ch = Math.round(h * scale);
        const canvas = document.createElement("canvas");
        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas 2D context unavailable"));
        ctx.drawImage(img, 0, 0, cw, ch);
        canvasToBlobUrl(canvas).then(resolve).catch(reject);
      };
      img.onerror = () => reject(new Error("Failed to load SVG as image"));
    };
    reader.onerror = () => reject(new Error("Failed to read SVG file"));
    reader.readAsText(file);
  });
}

async function rasterisePdf(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  // Use the bundled worker
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;
  const page = await pdf.getPage(1);

  const viewport = page.getViewport({ scale: 1 });
  const scale = Math.min(1, MAX_DIM / Math.max(viewport.width, viewport.height));
  const scaled = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(scaled.width);
  canvas.height = Math.round(scaled.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  await page.render({ canvasContext: ctx, viewport: scaled, canvas }).promise;
  return canvasToBlobUrl(canvas);
}

/* ---------- main export ---------- */

export type RasterResult = { preview: string; rasterised: boolean };

/**
 * Rasterise a File into a displayable blob-URL.
 * Returns `null` for unsupported formats (AI, EPS).
 */
export async function rasterizeFile(
  file: File,
): Promise<RasterResult | null> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

  // Native raster images — just create a blob URL
  if (RASTER_TYPES.includes(file.type) || ["png", "jpg", "jpeg", "webp", "gif", "bmp"].includes(ext)) {
    return { preview: URL.createObjectURL(file), rasterised: false };
  }

<<<<<<< HEAD
  // SVG — not supported; users should convert to PNG
  if (file.type === "image/svg+xml" || ext === "svg") {
    return null;
=======
  // SVG
  if (file.type === "image/svg+xml" || ext === "svg") {
    const preview = await rasteriseSvg(file);
    return { preview, rasterised: true };
>>>>>>> e1772656e7725b17156f55e8da3b712dc5fe1315
  }

  // PDF
  if (file.type === "application/pdf" || ext === "pdf") {
    const preview = await rasterisePdf(file);
    return { preview, rasterised: true };
  }

  // AI / EPS — not renderable in-browser
  if (["ai", "eps"].includes(ext)) {
    return null;
  }

  // Unknown — try as a native image
  return { preview: URL.createObjectURL(file), rasterised: false };
}
