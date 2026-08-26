import { describe, expect, it } from "vitest";
import {
  normalizeGoogleFont,
  renderGoogleFontsCatalog,
  resolveCatalogLimit,
} from "./google-font-catalog.mjs";

describe("Google Fonts sync contracts", () => {
  it("normalizes variants, subsets, and a variable weight axis", () => {
    expect(
      normalizeGoogleFont({
        family: "Example Sans",
        category: "sans-serif",
        variants: ["regular", "700", "700italic", "invalid"],
        subsets: ["latin", "latin", "bad subset"],
        axes: [{ tag: "wght", start: 100, end: 900 }],
        lastModified: "2026-08-26",
      }),
    ).toEqual({
      family: "Example Sans",
      category: "sans-serif",
      weights: [400, 700],
      styles: ["italic", "normal"],
      styleWeights: { normal: [400, 700], italic: [700] },
      subsets: ["latin"],
      lastModified: "2026-08-26",
      variableWeight: { min: 100, max: 900 },
    });
  });

  it("rejects unsafe family names and unsupported categories", () => {
    expect(
      normalizeGoogleFont({
        family: "</script>",
        category: "sans-serif",
        variants: ["regular"],
      }),
    ).toBeNull();
    expect(
      normalizeGoogleFont({ family: "Safe", category: "unknown", variants: ["regular"] }),
    ).toBeNull();
  });

  it("clamps catalog limits and renders no API credential", () => {
    expect(resolveCatalogLimit("5")).toBe(30);
    expect(resolveCatalogLimit("5000")).toBe(1000);
    expect(resolveCatalogLimit("invalid")).toBe(300);
    const source = renderGoogleFontsCatalog([], "2026-08-26T00:00:00.000Z");
    expect(source).toContain("google-fonts-developer-api");
    expect(source).not.toContain("API_KEY");
  });
});
