/**
 * Resize an image (from a blob URL or File) to a max dimension,
 * returning a base64 data URL (JPEG for photos, PNG if transparency needed).
 */
export function resizeImage(
  src: string,
  maxDim = 400,
  quality = 0.85,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const { width, height } = img;
      const scale = Math.min(1, maxDim / Math.max(width, height));
      const w = Math.round(width * scale);
      const h = Math.round(height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas 2D context unavailable"));

      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

/**
 * Capture the Three.js renderer canvas inside a container as base64 JPEG.
 */
export function captureCanvas(container: HTMLElement): string | null {
  const canvas = container.querySelector("canvas");
  if (!canvas) return null;
  return canvas.toDataURL("image/jpeg", 0.9);
}
