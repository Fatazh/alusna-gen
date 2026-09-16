import { describe, it, expect } from "vitest";
import { getSmartPairings, ROLE_META } from "./colorMatch";
import { rgbToHsl } from "./color";

describe("getSmartPairings", () => {
  it("always returns 7 pairs (6 roles + text)", () => {
    expect(getSmartPairings({ r: 200, g: 50, b: 50 })).toHaveLength(7);
    expect(getSmartPairings({ r: 20, g: 20, b: 20 })).toHaveLength(7);
  });

  it("text role is always ranked last", () => {
    const pairs = getSmartPairings({ r: 123, g: 200, b: 80 });
    expect(pairs[pairs.length - 1].role).toBe("teks");
    expect(pairs[pairs.length - 1].rank).toBe(7);
  });

  it("pairs are sorted ascending by rank", () => {
    const pairs = getSmartPairings({ r: 60, g: 120, b: 200 });
    const ranks = pairs.map((p) => p.rank);
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
  });

  it("dark achromatic yields white-ish dominant", () => {
    const pairs = getSmartPairings({ r: 10, g: 10, b: 10 });
    const dom = pairs.find((p) => p.role === "dominan")!;
    expect(rgbToHsl(dom.rgb).l).toBeGreaterThan(80);
  });

  it("light achromatic yields dark dominant", () => {
    const pairs = getSmartPairings({ r: 245, g: 245, b: 245 });
    const dom = pairs.find((p) => p.role === "dominan")!;
    expect(rgbToHsl(dom.rgb).l).toBeLessThan(20);
  });

  it("chromatic primary gets a complementary dominant", () => {
    const pairs = getSmartPairings({ r: 255, g: 0, b: 0 });
    const dom = pairs.find((p) => p.role === "dominan")!;
    expect(rgbToHsl(dom.rgb).h).toBeCloseTo(180, 0);
  });

  it("every role has metadata", () => {
    const pairs = getSmartPairings({ r: 100, g: 150, b: 200 });
    for (const p of pairs) {
      expect(ROLE_META[p.role]).toBeDefined();
    }
  });
});
