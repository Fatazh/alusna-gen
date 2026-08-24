// Core color utilities: parsing, conversion, harmony, and mixing.

export type RGB = { r: number; g: number; b: number };
export type RGBA = { r: number; g: number; b: number; a: number };
export type HSL = { h: number; s: number; l: number };
export type HSV = { h: number; s: number; v: number };
export type CMYK = { c: number; m: number; y: number; k: number };

export type ColorFormat = "hex" | "rgb" | "rgba" | "cmyk" | "hsl";

const clamp = (n: number, min = 0, max = 255) => Math.min(max, Math.max(min, n));
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const round = (n: number) => Math.round(n);

export function hexToRgb(hex: string): RGB | null {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (h.length === 8) h = h.slice(0, 6); // ignore alpha part for rgb
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: RGB, alpha?: number): string {
  const toHex = (n: number) => clamp(round(n)).toString(16).padStart(2, "0");
  const base = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  if (alpha === undefined) return base.toUpperCase();
  return `${base}${toHex(alpha * 255)}`.toUpperCase();
}

export function hexToRgba(hex: string, alpha = 1): RGBA | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return { ...rgb, a: clamp01(alpha) };
}

export function rgbaToHex({ r, g, b, a }: RGBA): string {
  return rgbToHex({ r, g, b }, a);
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rN:
        h = ((gN - bN) / d) % 6;
        break;
      case gN:
        h = (bN - rN) / d + 2;
        break;
      default:
        h = (rN - gN) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: round(h), s: round(s * 100), l: round(l * 100) };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const hN = ((h % 360) + 360) % 360;
  const sN = clamp01(s / 100);
  const lN = clamp01(l / 100);
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const x = c * (1 - Math.abs(((hN / 60) % 2) - 1));
  const m = lN - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hN < 60) [r, g, b] = [c, x, 0];
  else if (hN < 120) [r, g, b] = [x, c, 0];
  else if (hN < 180) [r, g, b] = [0, c, x];
  else if (hN < 240) [r, g, b] = [0, x, c];
  else if (hN < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return {
    r: round((r + m) * 255),
    g: round((g + m) * 255),
    b: round((b + m) * 255),
  };
}

export function rgbToHsv({ r, g, b }: RGB): HSV {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case rN:
        h = ((gN - bN) / d) % 6;
        break;
      case gN:
        h = (bN - rN) / d + 2;
        break;
      default:
        h = (rN - gN) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return {
    h: round(h),
    s: round(max === 0 ? 0 : (d / max) * 100),
    v: round(max * 100),
  };
}

export function rgbToCmyk({ r, g, b }: RGB): CMYK {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const k = 1 - Math.max(rN, gN, bN);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = (1 - rN - k) / (1 - k);
  const m = (1 - gN - k) / (1 - k);
  const y = (1 - bN - k) / (1 - k);
  return {
    c: round(c * 100),
    m: round(m * 100),
    y: round(y * 100),
    k: round(k * 100),
  };
}

export function cmykToRgb({ c, m, y, k }: CMYK): RGB {
  const cN = c / 100;
  const mN = m / 100;
  const yN = y / 100;
  const kN = k / 100;
  return {
    r: round(255 * (1 - cN) * (1 - kN)),
    g: round(255 * (1 - mN) * (1 - kN)),
    b: round(255 * (1 - yN) * (1 - kN)),
  };
}

// ---------- Formatting ----------
export function formatHex(rgb: RGB): string {
  return rgbToHex(rgb);
}
export function formatRgb({ r, g, b }: RGB): string {
  return `rgb(${round(r)}, ${round(g)}, ${round(b)})`;
}
export function formatRgba({ r, g, b, a }: RGBA): string {
  return `rgba(${round(r)}, ${round(g)}, ${round(b)}, ${Number(a.toFixed(2))})`;
}
export function formatCmyk({ c, m, y, k }: CMYK): string {
  return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;
}
export function formatHsl({ h, s, l }: HSL): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function describe(rgb: RGB): {
  hex: string;
  rgb: string;
  rgba: string;
  cmyk: string;
  hsl: string;
} {
  return {
    hex: formatHex(rgb),
    rgb: formatRgb(rgb),
    rgba: formatRgba({ ...rgb, a: 1 }),
    cmyk: formatCmyk(rgbToCmyk(rgb)),
    hsl: formatHsl(rgbToHsl(rgb)),
  };
}

// ---------- Harmony ----------
export type HarmonyType =
  "complementary" | "analogous" | "triadic" | "tetradic" | "splitComplementary" | "monochromatic";

export function rotateHue(rgb: RGB, deg: number): RGB {
  const hsl = rgbToHsl(rgb);
  return hslToRgb({ h: hsl.h + deg, s: hsl.s, l: hsl.l });
}

export function withLightness(rgb: RGB, l: number): RGB {
  const hsl = rgbToHsl(rgb);
  return hslToRgb({ h: hsl.h, s: hsl.s, l });
}

export function withSaturation(rgb: RGB, s: number): RGB {
  const hsl = rgbToHsl(rgb);
  return hslToRgb({ h: hsl.h, s, l: hsl.l });
}

// For achromatic colors (s < 10) hue rotation produces identical swatches.
// This helper produces meaningful lightness-based harmony instead.
function achromaticHarmony(hsl: HSL, type: HarmonyType): RGB[] {
  const { l, s } = hsl;
  const g = (lv: number) => hslToRgb({ h: 0, s, l: Math.max(0, Math.min(100, lv)) });
  const t = (h: number, lv: number) => hslToRgb({ h, s: 20, l: Math.max(0, Math.min(100, lv)) });

  switch (type) {
    case "complementary":
      // High-contrast opposite: dark → bright, bright → dark
      return [g(l), g(l < 50 ? l + 70 : l - 70)];
    case "analogous":
      return [g(l - 25), g(l), g(l + 25)];
    case "triadic":
      // Two subtle chromatic tints alongside the gray
      return [g(l), t(30, l + 5), t(210, l + 5)];
    case "tetradic":
      return [g(l), g(l + 22), t(30, l + 12), g(l - 22)];
    case "splitComplementary": {
      const opp = l < 50 ? l + 58 : l - 58;
      return [g(l), g(opp - 10), g(opp + 10)];
    }
    case "monochromatic":
      return [5, 18, 33, 50, 65, 80, 93].map((lv) => g(lv));
  }
}

export function harmony(rgb: RGB, type: HarmonyType): RGB[] {
  const hsl = rgbToHsl(rgb);

  // When saturation is near-zero, hue rotation is meaningless.
  if (hsl.s < 10) return achromaticHarmony(hsl, type);

  switch (type) {
    case "complementary":
      return [rgb, rotateHue(rgb, 180)];
    case "analogous":
      return [rotateHue(rgb, -30), rgb, rotateHue(rgb, 30)];
    case "triadic":
      return [rgb, rotateHue(rgb, 120), rotateHue(rgb, 240)];
    case "tetradic":
      return [rgb, rotateHue(rgb, 90), rotateHue(rgb, 180), rotateHue(rgb, 270)];
    case "splitComplementary":
      return [rgb, rotateHue(rgb, 150), rotateHue(rgb, 210)];
    case "monochromatic": {
      const levels = [10, 25, 40, 55, 70, 85, 95];
      return levels
        .map((l) => withLightness(rgb, l))
        .filter((c, i, arr) => arr.findIndex((x) => formatHex(x) === formatHex(c)) === i);
    }
  }
}

// ---------- Contrast & readability ----------
export function relativeLuminance({ r, g, b }: RGB): number {
  const lin = (c: number) => {
    const cN = c / 255;
    return cN <= 0.03928 ? cN / 12.92 : Math.pow((cN + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(a: RGB, b: RGB): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

// WCAG threshold: sqrt(1.05 * 0.05) - 0.05 ≈ 0.179
// Above this luminance, black text gives better contrast; below, white text does.
export function bestTextOn(bg: RGB): "#FFFFFF" | "#000000" {
  return relativeLuminance(bg) > 0.179 ? "#000000" : "#FFFFFF";
}

// ---------- Mixing ----------
export type MixMode = "average" | "additive" | "subtractive" | "weighted";

export function mixColors(
  colors: { color: RGB; weight?: number }[],
  mode: MixMode = "average",
): RGB {
  if (colors.length === 0) return { r: 0, g: 0, b: 0 };
  if (colors.length === 1 && mode !== "subtractive") return colors[0].color;

  const totalWeight = colors.reduce((acc, c) => acc + (c.weight ?? 1), 0) || 1;

  switch (mode) {
    case "additive":
      return {
        r: clamp((colors.reduce((a, c) => a + c.color.r * (c.weight ?? 1), 0) / totalWeight) * 2),
        g: clamp((colors.reduce((a, c) => a + c.color.g * (c.weight ?? 1), 0) / totalWeight) * 2),
        b: clamp((colors.reduce((a, c) => a + c.color.b * (c.weight ?? 1), 0) / totalWeight) * 2),
      };
    case "subtractive":
      // Approximate ideal CMYK-style ink coverage over a white substrate.
      // A weight of 0–5 maps to 0–100% coverage; an omitted weight means
      // full coverage for backwards-compatible direct model calls.
      const subtractiveChannel = (channel: keyof RGB) =>
        clamp(
          colors.reduce((transmittance, entry) => {
            const coverage =
              entry.weight === undefined ? 1 : clamp01(Math.max(0, entry.weight) / 5);
            const pigmentAbsorption = 1 - entry.color[channel] / 255;
            return transmittance * (1 - coverage * pigmentAbsorption);
          }, 1) * 255,
        );
      return {
        r: round(subtractiveChannel("r")),
        g: round(subtractiveChannel("g")),
        b: round(subtractiveChannel("b")),
      };
    case "weighted":
      return {
        r: round(colors.reduce((a, c) => a + c.color.r * (c.weight ?? 1), 0) / totalWeight),
        g: round(colors.reduce((a, c) => a + c.color.g * (c.weight ?? 1), 0) / totalWeight),
        b: round(colors.reduce((a, c) => a + c.color.b * (c.weight ?? 1), 0) / totalWeight),
      };
    case "average":
    default:
      // Pure equal-weight average — intentionally ignores weight; use
      // 'weighted' mode to apply weights.
      return {
        r: round(colors.reduce((a, c) => a + c.color.r, 0) / colors.length),
        g: round(colors.reduce((a, c) => a + c.color.g, 0) / colors.length),
        b: round(colors.reduce((a, c) => a + c.color.b, 0) / colors.length),
      };
  }
}

// Curated pattern palettes
export type Palette = { name: string; colors: string[] };

export const PALETTES: Palette[] = [
  {
    name: "Sunset",
    colors: ["#FF6B6B", "#FF8E53", "#FFA94D", "#FFD93D", "#6BCB77"],
  },
  {
    name: "Ocean",
    colors: ["#03045E", "#023E8A", "#0077B6", "#00B4D8", "#90E0EF"],
  },
  {
    name: "Forest",
    colors: ["#1B4332", "#2D6A4F", "#40916C", "#74C69D", "#B7E4C7"],
  },
  {
    name: "Berry",
    colors: ["#5A189A", "#7B2CBF", "#9D4EDD", "#C77DFF", "#E0AAFF"],
  },
  {
    name: "Earth",
    colors: ["#582F0E", "#7F4F24", "#936639", "#A68A64", "#C2C5AA"],
  },
  {
    name: "Candy",
    colors: ["#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF"],
  },
  {
    name: "Cyberpunk",
    colors: ["#0D0221", "#FF2A6D", "#05D9E8", "#D1F7FF", "#01012B"],
  },
  {
    name: "Pastel",
    colors: ["#FFB5A7", "#FCD5CE", "#F8EDEB", "#F9DCC4", "#FEC89A"],
  },
  {
    name: "Mono Blue",
    colors: ["#0B1F3F", "#1B3B6F", "#3D5A80", "#98C1D9", "#E0FBFC"],
  },
  {
    name: "Autumn",
    colors: ["#6A040F", "#9D0208", "#D00000", "#DC2F02", "#F48C06"],
  },
  {
    name: "Mint",
    colors: ["#06281D", "#0E4D3A", "#16A085", "#58D68D", "#D5F5E3"],
  },
  {
    name: "Royal",
    colors: ["#1A1A2E", "#16213E", "#0F3460", "#533483", "#E94560"],
  },
];

export function randomColor(): RGB {
  return hslToRgb({
    h: round(Math.random() * 360),
    s: round(50 + Math.random() * 40),
    l: round(40 + Math.random() * 30),
  });
}

export function isValidHex(hex: string): boolean {
  return /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(hex.trim());
}
