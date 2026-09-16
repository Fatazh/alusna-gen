import { describe, expect, it } from "vitest";
import { extractDominantColors, extractPixelsFromImageData } from "./paletteMath";

describe("extractPixelsFromImageData", () => {
  it("samples every second opaque pixel and skips transparent ones", () => {
    const data = new Uint8ClampedArray([
      // Pixel 0: opaque red (kept)
      255, 0, 0, 255,
      // Pixel 1: opaque blue (skipped by the even-offset sampling)
      0, 0, 255, 255,
      // Pixel 2: transparent (skipped by alpha)
      0, 255, 0, 0,
    ]);
    const pixels = extractPixelsFromImageData(data, 3, 1);
    expect(pixels).toEqual([{ r: 255, g: 0, b: 0 }]);
  });
});

describe("extractDominantColors", () => {
  it("averages identical pixels to that same color", () => {
    const pixels = [
      { r: 10, g: 20, b: 30 },
      { r: 10, g: 20, b: 30 },
    ];
    const colors = extractDominantColors(pixels, 6);
    expect(colors.length).toBeGreaterThan(0);
    for (const color of colors) expect(color).toEqual({ r: 10, g: 20, b: 30 });
  });

  it("respects the requested color cap", () => {
    const pixels = Array.from({ length: 32 }, (_, i) => ({
      r: (i * 8) % 256,
      g: (i * 5) % 256,
      b: (i * 3) % 256,
    }));
    expect(extractDominantColors(pixels, 4).length).toBeLessThanOrEqual(4);
  });

  it("keeps every output within the input channel bounds", () => {
    const reds = Array.from({ length: 6 }, () => ({ r: 220, g: 30, b: 40 }));
    const blues = Array.from({ length: 2 }, () => ({ r: 20, g: 40, b: 220 }));
    for (const color of extractDominantColors([...reds, ...blues], 6)) {
      expect(color.r).toBeGreaterThanOrEqual(20);
      expect(color.r).toBeLessThanOrEqual(220);
      expect(color.g).toBeGreaterThanOrEqual(30);
      expect(color.g).toBeLessThanOrEqual(40);
      expect(color.b).toBeGreaterThanOrEqual(40);
      expect(color.b).toBeLessThanOrEqual(220);
    }
  });

  it("returns empty for no pixels", () => {
    expect(extractDominantColors([], 6)).toEqual([]);
  });
});
