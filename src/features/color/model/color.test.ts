import { describe, it, expect } from "vitest";
import {
  hexToRgb,
  rgbToHex,
  hexToRgba,
  rgbaToHex,
  rgbToHsl,
  hslToRgb,
  rgbToCmyk,
  cmykToRgb,
  rgbToHsv,
  contrastRatio,
  bestTextOn,
  relativeLuminance,
  harmony,
  mixColors,
  rotateHue,
  withLightness,
  withSaturation,
  randomColor,
  isValidHex,
  formatHex,
  formatRgb,
  formatRgba,
  formatCmyk,
  formatHsl,
  describe as describeColor,
  type RGB,
} from "./color";

const eq = (a: RGB, b: RGB, tol = 1) =>
  Math.abs(a.r - b.r) <= tol && Math.abs(a.g - b.g) <= tol && Math.abs(a.b - b.b) <= tol;

describe("hexToRgb", () => {
  it("parses 6-digit hex", () => {
    expect(hexToRgb("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
  });
  it("parses 3-digit shorthand", () => {
    expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
  });
  it("ignores leading #", () => {
    expect(hexToRgb("00ff00")).toEqual({ r: 0, g: 255, b: 0 });
  });
  it("returns null for invalid", () => {
    expect(hexToRgb("nope")).toBeNull();
    expect(hexToRgb("#12")).toBeNull();
  });
  it("parses 8-digit hex (ignores alpha)", () => {
    expect(hexToRgb("#ff000080")).toEqual({ r: 255, g: 0, b: 0 });
  });
  it("handles mixed case", () => {
    expect(hexToRgb("#AbCdEf")).toEqual({ r: 171, g: 205, b: 239 });
  });
});

describe("rgbToHex", () => {
  it("uppercases 6-digit", () => {
    expect(rgbToHex({ r: 99, g: 102, b: 241 })).toBe("#6366F1");
  });
  it("appends alpha when given", () => {
    expect(rgbToHex({ r: 0, g: 0, b: 0 }, 1)).toBe("#000000FF");
  });
  it("handles fractional alpha", () => {
    expect(rgbToHex({ r: 255, g: 255, b: 255 }, 0.5)).toBe("#FFFFFF80");
  });
});

describe("hexToRgba", () => {
  it("converts hex to RGBA with alpha", () => {
    expect(hexToRgba("#ff0000", 0.5)).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
  });
  it("returns null for invalid hex", () => {
    expect(hexToRgba("invalid")).toBeNull();
  });
  it("clamps alpha to 0-1", () => {
    expect(hexToRgba("#000", 1.5)).toEqual({ r: 0, g: 0, b: 0, a: 1 });
  });
});

describe("rgbaToHex", () => {
  it("converts RGBA to hex with alpha", () => {
    expect(rgbaToHex({ r: 255, g: 0, b: 0, a: 1 })).toBe("#FF0000FF");
  });
});

describe("hsl roundtrip", () => {
  it("hsl -> rgb -> hsl is stable within tolerance", () => {
    const orig = { r: 34, g: 139, b: 230 };
    const back = hslToRgb(rgbToHsl(orig));
    expect(eq(orig, back)).toBe(true);
  });
  it("red maps to hue 0", () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 }).h).toBe(0);
  });
  it("gray has zero saturation", () => {
    expect(rgbToHsl({ r: 128, g: 128, b: 128 }).s).toBe(0);
  });
  it("pure blue has hue 240", () => {
    expect(rgbToHsl({ r: 0, g: 0, b: 255 }).h).toBe(240);
  });
  it("pure green has hue 120", () => {
    expect(rgbToHsl({ r: 0, g: 255, b: 0 }).h).toBe(120);
  });
});

describe("cmyk roundtrip", () => {
  it("cmyk -> rgb -> cmyk is stable", () => {
    const cmyk = { c: 30, m: 10, y: 0, k: 20 };
    const back = rgbToCmyk(cmykToRgb(cmyk));
    expect(Math.abs(back.c - cmyk.c)).toBeLessThanOrEqual(2);
    expect(Math.abs(back.k - cmyk.k)).toBeLessThanOrEqual(2);
  });
  it("black gives full k", () => {
    expect(rgbToCmyk({ r: 0, g: 0, b: 0 })).toEqual({ c: 0, m: 0, y: 0, k: 100 });
  });
  it("white gives zero cmyk", () => {
    expect(rgbToCmyk({ r: 255, g: 255, b: 255 })).toEqual({ c: 0, m: 0, y: 0, k: 0 });
  });
});

describe("rgbToHsv", () => {
  it("red has full saturation and value", () => {
    expect(rgbToHsv({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, v: 100 });
  });
  it("black has zero saturation and value", () => {
    expect(rgbToHsv({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, v: 0 });
  });
});

describe("relativeLuminance", () => {
  it("white has luminance 1", () => {
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 2);
  });
  it("black has luminance 0", () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0, 2);
  });
});

describe("contrast & readability", () => {
  it("white on black is max contrast", () => {
    expect(contrastRatio({ r: 255, g: 255, b: 255 }, { r: 0, g: 0, b: 0 })).toBeCloseTo(21, 1);
  });
  it("same color has contrast 1", () => {
    expect(contrastRatio({ r: 10, g: 20, b: 30 }, { r: 10, g: 20, b: 30 })).toBeCloseTo(1, 5);
  });
  it("dark bg needs white text", () => {
    expect(bestTextOn({ r: 0, g: 0, b: 0 })).toBe("#FFFFFF");
  });
  it("light bg needs black text", () => {
    expect(bestTextOn({ r: 255, g: 255, b: 255 })).toBe("#000000");
  });
});

describe("harmony", () => {
  it("complementary rotates hue 180", () => {
    const comp = harmony({ r: 255, g: 0, b: 0 }, "complementary")[1];
    expect(rgbToHsl(comp).h).toBeCloseTo(180, 0);
  });
  it("achromatic color uses lightness-based harmony", () => {
    const comp = harmony({ r: 128, g: 128, b: 128 }, "complementary")[1];
    expect(rgbToHsl(comp).s).toBeLessThanOrEqual(10);
  });
  it("monochromatic returns multiple tones", () => {
    expect(harmony({ r: 200, g: 50, b: 50 }, "monochromatic").length).toBeGreaterThan(3);
  });
  it("analogous returns 3 colors", () => {
    expect(harmony({ r: 100, g: 100, b: 200 }, "analogous").length).toBe(3);
  });
  it("triadic returns 3 colors", () => {
    expect(harmony({ r: 100, g: 200, b: 100 }, "triadic").length).toBe(3);
  });
  it("tetradic returns 4 colors", () => {
    expect(harmony({ r: 200, g: 100, b: 100 }, "tetradic").length).toBe(4);
  });
  it("splitComplementary returns 3 colors", () => {
    expect(harmony({ r: 100, g: 100, b: 200 }, "splitComplementary").length).toBe(3);
  });
  it("rotateHue wraps around", () => {
    const h = rgbToHsl(rotateHue({ r: 230, g: 20, b: 20 }, 200)).h;
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThan(360);
  });
  it("withLightness overrides lightness", () => {
    expect(rgbToHsl(withLightness({ r: 200, g: 50, b: 50 }, 50)).l).toBe(50);
  });
  it("withSaturation overrides saturation", () => {
    expect(rgbToHsl(withSaturation({ r: 200, g: 50, b: 50 }, 0)).s).toBe(0);
  });
});

describe("mixColors", () => {
  it("empty returns black", () => {
    expect(mixColors([], "average")).toEqual({ r: 0, g: 0, b: 0 });
  });
  it("single color returns itself", () => {
    const c = { r: 12, g: 34, b: 56 };
    expect(mixColors([{ color: c }], "average")).toEqual(c);
  });
  it("average of equal halves is midpoint", () => {
    const mix = mixColors(
      [{ color: { r: 0, g: 0, b: 0 } }, { color: { r: 100, g: 100, b: 100 } }],
      "average",
    );
    expect(mix).toEqual({ r: 50, g: 50, b: 50 });
  });
  it("weighted respects weights", () => {
    const mix = mixColors(
      [
        { color: { r: 0, g: 0, b: 0 }, weight: 3 },
        { color: { r: 100, g: 100, b: 100 }, weight: 1 },
      ],
      "weighted",
    );
    expect(mix.r).toBe(25);
  });
  it("average ignores weights", () => {
    const mix = mixColors(
      [
        { color: { r: 0, g: 0, b: 0 }, weight: 9 },
        { color: { r: 100, g: 100, b: 100 }, weight: 1 },
      ],
      "average",
    );
    expect(mix.r).toBe(50);
  });
  it("subtractive stays within bounds", () => {
    const mix = mixColors(
      [{ color: { r: 200, g: 100, b: 50 } }, { color: { r: 50, g: 200, b: 150 } }],
      "subtractive",
    );
    for (const v of [mix.r, mix.g, mix.b]) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(255);
    }
  });
  it("subtractive weights behave as CMYK-style coverage", () => {
    const mix = mixColors(
      [
        { color: { r: 0, g: 255, b: 255 }, weight: 4.7 },
        { color: { r: 255, g: 0, b: 255 }, weight: 1.8 },
        { color: { r: 0, g: 0, b: 0 }, weight: 1.25 },
      ],
      "subtractive",
    );

    expect(mix).toEqual({ r: 11, g: 122, b: 191 });
  });
  it("subtractive supports partial coverage from a single pigment", () => {
    expect(mixColors([{ color: { r: 0, g: 0, b: 0 }, weight: 2.5 }], "subtractive")).toEqual({
      r: 128,
      g: 128,
      b: 128,
    });
  });
  it("additive stays within bounds", () => {
    const mix = mixColors(
      [{ color: { r: 200, g: 100, b: 50 } }, { color: { r: 50, g: 200, b: 150 } }],
      "additive",
    );
    for (const v of [mix.r, mix.g, mix.b]) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(255);
    }
  });
  it("additive weights behave as independent RGB light intensity", () => {
    expect(
      mixColors(
        [
          { color: { r: 0, g: 255, b: 0 }, weight: 0.15 },
          { color: { r: 0, g: 0, b: 255 }, weight: 5 },
        ],
        "additive",
      ),
    ).toEqual({ r: 0, g: 8, b: 255 });
  });
  it("additive supports partial intensity from a single light", () => {
    expect(mixColors([{ color: { r: 255, g: 0, b: 0 }, weight: 2.5 }], "additive")).toEqual({
      r: 128,
      g: 0,
      b: 0,
    });
  });
});

describe("randomColor", () => {
  it("returns a valid RGB color", () => {
    const c = randomColor();
    expect(c.r).toBeGreaterThanOrEqual(0);
    expect(c.r).toBeLessThanOrEqual(255);
    expect(c.g).toBeGreaterThanOrEqual(0);
    expect(c.g).toBeLessThanOrEqual(255);
    expect(c.b).toBeGreaterThanOrEqual(0);
    expect(c.b).toBeLessThanOrEqual(255);
  });
});

describe("isValidHex", () => {
  it("validates 3-digit hex", () => {
    expect(isValidHex("#fff")).toBe(true);
  });
  it("validates 6-digit hex", () => {
    expect(isValidHex("#ff0000")).toBe(true);
  });
  it("validates 8-digit hex", () => {
    expect(isValidHex("#ff000080")).toBe(true);
  });
  it("rejects invalid hex", () => {
    expect(isValidHex("#gg0000")).toBe(false);
    expect(isValidHex("#12")).toBe(false);
    expect(isValidHex("hello")).toBe(false);
  });
  it("handles without # prefix", () => {
    expect(isValidHex("ff0000")).toBe(true);
  });
});

describe("format functions", () => {
  it("formatHex returns uppercase", () => {
    expect(formatHex({ r: 10, g: 20, b: 30 })).toBe("#0A141E");
  });
  it("formatRgb returns rgb string", () => {
    expect(formatRgb({ r: 10, g: 20, b: 30 })).toBe("rgb(10, 20, 30)");
  });
  it("formatCmyk returns cmyk string", () => {
    expect(formatCmyk({ c: 10, m: 20, y: 30, k: 40 })).toBe("cmyk(10%, 20%, 30%, 40%)");
  });
  it("formatHsl returns hsl string", () => {
    expect(formatHsl({ h: 180, s: 50, l: 50 })).toBe("hsl(180, 50%, 50%)");
  });
});

describe("describeColor", () => {
  it("returns all color formats", () => {
    const result = describeColor({ r: 255, g: 0, b: 0 });
    expect(result.hex).toBe("#FF0000");
    expect(result.rgb).toBe("rgb(255, 0, 0)");
    expect(result.hsl).toContain("hsl");
    expect(result.cmyk).toContain("cmyk");
  });
});

describe("formatRgba", () => {
  it("formats with 2-decimal alpha", () => {
    expect(formatRgba({ r: 10, g: 20, b: 30, a: 0.5 })).toBe("rgba(10, 20, 30, 0.5)");
  });
  it("rounds alpha", () => {
    expect(formatRgba({ r: 0, g: 0, b: 0, a: 1 / 3 })).toBe("rgba(0, 0, 0, 0.33)");
  });
});
