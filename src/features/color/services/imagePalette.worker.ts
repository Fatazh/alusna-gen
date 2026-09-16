import { type RGB } from "@alusna/shared/color";
import {
  extractDominantColors,
  extractPixelsFromImageData,
  IMAGE_PALETTE_MAX_DIM,
} from "./paletteMath";

export type PaletteWorkerRequest = {
  id: number;
  bitmap: ImageBitmap;
  count: number;
};

export type PaletteWorkerResponse = {
  id: number;
  colors: RGB[];
};

// Typed without lib "webworker" so the file compiles under the DOM lib.
const workerScope = self as unknown as {
  onmessage: ((event: MessageEvent<PaletteWorkerRequest>) => void) | null;
  postMessage(message: PaletteWorkerResponse): void;
};

workerScope.onmessage = (event) => {
  const { id, bitmap, count } = event.data;
  try {
    const scale = Math.min(1, IMAGE_PALETTE_MAX_DIM / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      workerScope.postMessage({ id, colors: [] });
      return;
    }
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();

    const { data } = ctx.getImageData(0, 0, w, h);
    const pixels = extractPixelsFromImageData(data, w, h);
    workerScope.postMessage({ id, colors: extractDominantColors(pixels, count) });
  } catch {
    workerScope.postMessage({ id, colors: [] });
  }
};
