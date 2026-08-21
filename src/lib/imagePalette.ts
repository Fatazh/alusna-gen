import { type RGB } from "./color";

type Pixel = { r: number; g: number; b: number };

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

export async function extractPalette(file: File, count = 6): Promise<RGB[]> {
  const img = await loadImage(file);
  const maxDim = 220; // downscale for speed
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.drawImage(img, 0, 0, w, h);

  const { data } = ctx.getImageData(0, 0, w, h);
  const pixels: Pixel[] = [];
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 2 + 1];
    if (a < 125) continue;
    // Skip near-transparent; sample every 2nd pixel for speed.
    if (i % 8 === 0) pixels.push({ r, g, b });
  }
  if (pixels.length === 0) return [];

  const depth = Math.max(1, Math.ceil(Math.log2(count)));
  const buckets = medianCut(pixels, depth)
    .map((b) => (b.length ? average(b) : null))
    .filter(Boolean) as RGB[];

  // Return up to `count` distinct averages.
  return buckets.slice(0, count);
}
