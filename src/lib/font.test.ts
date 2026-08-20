import { describe, expect, it } from "vitest";
import { sanitizeFontFamily, fontStack, isSafeFontDataUrl } from "./font";

describe("sanitizeFontFamily", () => {
  it("keeps safe characters and spaces", () => {
    expect(sanitizeFontFamily("Roboto")).toBe("Roboto");
    expect(sanitizeFontFamily("JetBrains Mono")).toBe("JetBrains Mono");
    expect(sanitizeFontFamily("  Inter  ")).toBe("Inter");
  });

  it("strips CSS-breaking / HTML characters", () => {
    expect(sanitizeFontFamily("O'Brien")).toBe("OBrien");
    expect(
      sanitizeFontFamily('Foo";}</style><script>alert(1)</script>'),
    ).toBe("Foostylescriptalert1script");
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
    expect(fontStack("Playfair Display", "serif")).toBe(
      "'Playfair Display', Georgia, serif",
    );
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
