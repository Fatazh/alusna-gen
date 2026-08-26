import { describe, expect, it } from "vitest";
import { buildGoogleFontCssUrl } from "../services/fontLoader";
import { sanitizeFontFamily, fontStack, isSafeFontDataUrl } from "./font";
import { GOOGLE_FONTS, filterGoogleFonts, nearestFontWeight } from "./googleFonts";

describe("Google Fonts catalog", () => {
  it("contains unique, sanitized families with supported metadata", () => {
    expect(GOOGLE_FONTS.length).toBeGreaterThanOrEqual(30);
    expect(new Set(GOOGLE_FONTS.map((font) => font.family)).size).toBe(GOOGLE_FONTS.length);
    for (const font of GOOGLE_FONTS) {
      expect(sanitizeFontFamily(font.family)).toBe(font.family);
      expect(font.weights.length).toBeGreaterThan(0);
      expect(font.weights).toEqual([...font.weights].sort((a, b) => a - b));
      expect(font.styles.length).toBeGreaterThan(0);
      for (const style of font.styles) expect(font.styleWeights[style].length).toBeGreaterThan(0);
    }
  });

  it("filters by family, category, and available style", () => {
    const result = filterGoogleFonts(GOOGLE_FONTS, {
      category: "serif",
      search: "playfair",
      style: "italic",
    });
    expect(result.map((font) => font.family)).toEqual(["Playfair Display"]);
    expect(
      filterGoogleFonts(GOOGLE_FONTS, {
        category: "handwriting",
        search: "sacramento",
        style: "italic",
      }),
    ).toEqual([]);
  });

  it("chooses the nearest supported weight", () => {
    expect(nearestFontWeight([300, 400, 700], 650)).toBe(700);
    expect(nearestFontWeight([300, 400, 700], 450)).toBe(400);
    expect(nearestFontWeight([], 700)).toBe(400);
  });

  it("preserves the exact weight matrix for each style", () => {
    const playfair = GOOGLE_FONTS.find((font) => font.family === "Playfair Display");
    expect(playfair?.styleWeights.normal).toEqual([400, 600, 700]);
    expect(playfair?.styleWeights.italic).toEqual([400, 600, 700]);
  });
});

describe("buildGoogleFontCssUrl", () => {
  it("builds a deduplicated CSS2 request without exposing any API key", () => {
    const url = new URL(buildGoogleFontCssUrl("Roboto", [700, 400, 700]));
    expect(url.origin).toBe("https://fonts.googleapis.com");
    expect(url.searchParams.get("family")).toBe("Roboto:wght@400;700");
    expect(url.searchParams.get("display")).toBe("swap");
    expect(url.searchParams.has("key")).toBe(false);
  });

  it("uses the italic axis and sanitizes the family", () => {
    const url = new URL(buildGoogleFontCssUrl('Roboto";color:red', [400], "italic"));
    expect(url.searchParams.get("family")).toBe("Robotocolorred:ital,wght@1,400");
  });
});

describe("sanitizeFontFamily", () => {
  it("keeps safe characters and spaces", () => {
    expect(sanitizeFontFamily("Roboto")).toBe("Roboto");
    expect(sanitizeFontFamily("JetBrains Mono")).toBe("JetBrains Mono");
    expect(sanitizeFontFamily("  Inter  ")).toBe("Inter");
  });

  it("strips CSS-breaking / HTML characters", () => {
    expect(sanitizeFontFamily("O'Brien")).toBe("OBrien");
    expect(sanitizeFontFamily('Foo";}</style><script>alert(1)</script>')).toBe(
      "Foostylescriptalert1script",
    );
  });

  it("falls back to a safe default when empty", () => {
    expect(sanitizeFontFamily("")).toBe("Uploaded Font");
    expect(sanitizeFontFamily("!!!")).toBe("Uploaded Font");
    expect(sanitizeFontFamily("  ")).toBe("Uploaded Font");
  });
});

describe("fontStack", () => {
  it("quotes the family and appends fallbacks", () => {
    expect(fontStack("Inter")).toBe("'Inter', system-ui, sans-serif");
    expect(fontStack("Playfair Display", "serif")).toBe("'Playfair Display', Georgia, serif");
    expect(fontStack("JetBrains Mono", "monospace")).toBe(
      "'JetBrains Mono', Menlo, Monaco, monospace",
    );
  });
});

describe("isSafeFontDataUrl", () => {
  it("accepts base64 font data URLs", () => {
    expect(isSafeFontDataUrl("data:font/ttf;base64,AAEAAA")).toBe(true);
    expect(isSafeFontDataUrl("data:font/woff2;base64,d09GR")).toBe(true);
  });

  it("rejects remote URLs (FontFace would fetch them)", () => {
    expect(isSafeFontDataUrl("https://evil.example/font.woff")).toBe(false);
    expect(isSafeFontDataUrl("//evil.example/font.woff")).toBe(false);
  });

  it("rejects non-base64 data URLs and empty values", () => {
    expect(isSafeFontDataUrl("data:text/plain,hello")).toBe(false);
    expect(isSafeFontDataUrl("")).toBe(false);
  });

  it("rejects oversized values", () => {
    const big = "data:font/ttf;base64," + "A".repeat(9 * 1024 * 1024);
    expect(isSafeFontDataUrl(big)).toBe(false);
  });

  it("rejects non-strings", () => {
    expect(isSafeFontDataUrl(null)).toBe(false);
    expect(isSafeFontDataUrl(42)).toBe(false);
  });
});
