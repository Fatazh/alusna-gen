import { type RGB } from "./color";

export type ColorBlindType =
  | "normal"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "protanomaly"
  | "deuteranomaly"
  | "tritanomaly"
  | "achromatopsia";

export const COLOR_BLIND_TYPES: { id: ColorBlindType; label: string }[] = [
  { id: "normal", label: "Normal" },
  { id: "protanopia", label: "Protanopia" },
  { id: "deuteranopia", label: "Deuteranopia" },
  { id: "tritanopia", label: "Tritanopia" },
  { id: "protanomaly", label: "Protanomaly" },
  { id: "deuteranomaly", label: "Deuteranomaly" },
  { id: "tritanomaly", label: "Tritanomaly" },
  { id: "achromatopsia", label: "Achromatopsia" },
];

// 3x3 matrices (row-major) acting on sRGB in [0,1].
// Source: commonly used color-blindness simulation matrices.
const MATRICES: Record<ColorBlindType, number[]> = {
  normal: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  protanopia: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  deuteranopia: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  tritanopia: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
  protanomaly: [0.817, 0.183, 0, 0.333, 0.667, 0, 0, 0.125, 0.875],
  deuteranomaly: [0.8, 0.2, 0, 0.258, 0.742, 0, 0, 0.142, 0.858],
  tritanomaly: [0.967, 0.033, 0, 0, 0.733, 0.267, 0, 0.183, 0.817],
  achromatopsia: [0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114],
};

export function simulateColorBlindness(rgb: RGB, type: ColorBlindType): RGB {
  const m = MATRICES[type];
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const nr = r * m[0] + g * m[1] + b * m[2];
  const ng = r * m[3] + g * m[4] + b * m[5];
  const nb = r * m[6] + g * m[7] + b * m[8];
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  return {
    r: Math.round(clamp(nr) * 255),
    g: Math.round(clamp(ng) * 255),
    b: Math.round(clamp(nb) * 255),
  };
}
