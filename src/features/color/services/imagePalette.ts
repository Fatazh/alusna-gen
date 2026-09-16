import { type RGB } from "@alusna/shared/color";
import {
  extractDominantColors,
  extractPixelsFromImageData,
  IMAGE_PALETTE_MAX_DIM,
} from "./paletteMath";
import PaletteWorker from "./imagePalette.worker?worker";
import { type PaletteWorkerResponse } from "./imagePalette.worker";

/**
 * Dominant-color extraction. Runs in a Web Worker (createImageBitmap +
 * OffscreenCanvas) so decoding and median-cut never block the UI, with an
 * automatic main-thread fallback for browsers without worker/OffscreenCanvas
 * support or when the worker path fails.
 */
export async function extractPalette(file: File, count = 6): Promise<RGB[]> {
  if (typeof Worker === "undefined" || typeof createImageBitmap === "undefined") {
    return extractPaletteMainThread(file, count);
  }
  try {
    return await extractPaletteInWorker(file, count);
  } catch {
    return extractPaletteMainThread(file, count);
  }
}

let worker: Worker | null = null;
let nextRequestId = 0;
const pending = new Map<
  number,
  { resolve: (colors: RGB[]) => void; reject: (error: Error) => void }
>();

function getWorker(): Worker {
  if (worker) return worker;
  const instance = new PaletteWorker();
  instance.onmessage = (event: MessageEvent<PaletteWorkerResponse>) => {
    const entry = pending.get(event.data.id);
    if (!entry) return;
    pending.delete(event.data.id);
    entry.resolve(event.data.colors);
  };
  instance.onerror = () => {
    const entries = [...pending.values()];
    pending.clear();
    worker = null;
    for (const entry of entries) entry.reject(new Error("Palette worker failed"));
  };
  worker = instance;
  return instance;
}

async function extractPaletteInWorker(file: File, count: number): Promise<RGB[]> {
  const bitmap = await createImageBitmap(file);
  return new Promise<RGB[]>((resolve, reject) => {
    const id = nextRequestId;
    nextRequestId += 1;
    pending.set(id, { resolve, reject });
    getWorker().postMessage({ id, bitmap, count });
  });
}

async function extractPaletteMainThread(file: File, count: number): Promise<RGB[]> {
  const img = await loadImage(file);
  const scale = Math.min(1, IMAGE_PALETTE_MAX_DIM / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.drawImage(img, 0, 0, w, h);

  const { data } = ctx.getImageData(0, 0, w, h);
  const pixels = extractPixelsFromImageData(data, w, h);
  return extractDominantColors(pixels, count);
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gagal memuat gambar"));
    };
    img.src = url;
  });
}
