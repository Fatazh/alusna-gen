import { type RGB } from "@alusna/shared/color";

/**
 * Framework-free pixel math for dominant-color extraction (median cut).
 * Pure functions only: shared by the Web Worker and the main-thread fallback.
 */

export const IMAGE_PALETTE_MAX_DIM = 220;

export type Pixel = { r: number; g: number; b: number };

/** Collects sampled opaque pixels from raw RGBA data (skips alpha < 125). */
export function extractPixelsFromImageData(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): Pixel[] {
  const pixels: Pixel[] = [];
  for (let i = 0; i < width * height * 4; i += 4) {
    const alpha = data[i + 3];
    if (alpha < 125) continue;
    // Sample every 2nd pixel for speed.
    if (i % 8 === 0) pixels.push({ r: data[i], g: data[i + 1], b: data[i + 2] });
  }
  return pixels;
}

function channelRange(pixels: Pixel[], ch: keyof Pixel): [number, number] {
  let min = 255;
  let max = 0;
  for (const p of pixels) {
    if (p[ch] < min) min = p[ch];
    if (p[ch] > max) max = p[ch];
  }
  return [min, max];
}

function medianCut(pixels: Pixel[], depth: number): Pixel[][] {
  if (depth === 0 || pixels.length === 0) return [pixels];
  const ranges: Record<keyof Pixel, number> = {
    r: channelRange(pixels, "r")[1] - channelRange(pixels, "r")[0],
    g: channelRange(pixels, "g")[1] - channelRange(pixels, "g")[0],
    b: channelRange(pixels, "b")[1] - channelRange(pixels, "b")[0],
  };
  const ch: keyof Pixel =
    ranges.r >= ranges.g && ranges.r >= ranges.b ? "r" : ranges.g >= ranges.b ? "g" : "b";
  pixels.sort((a, b) => a[ch] - b[ch]);
  const mid = Math.floor(pixels.length / 2);
  return [
    ...medianCut(pixels.slice(0, mid), depth - 1),
    ...medianCut(pixels.slice(mid), depth - 1),
  ];
}

function average(pixels: Pixel[]): RGB {
  const n = pixels.length || 1;
  return {
    r: Math.round(pixels.reduce((a, p) => a + p.r, 0) / n),
    g: Math.round(pixels.reduce((a, p) => a + p.g, 0) / n),
    b: Math.round(pixels.reduce((a, p) => a + p.b, 0) / n),
  };
}

/** Reduces sampled pixels to up to `count` dominant colors via median cut. */
export function extractDominantColors(pixels: Pixel[], count: number): RGB[] {
  if (pixels.length === 0) return [];
  const depth = Math.max(1, Math.ceil(Math.log2(count)));
  const buckets = medianCut(pixels, depth)
    .map((b) => (b.length ? average(b) : null))
    .filter(Boolean) as RGB[];
  return buckets.slice(0, count);
}
