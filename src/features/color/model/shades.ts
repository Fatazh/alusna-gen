import { hslToRgb, rgbToHsl, type RGB } from "./color";

// Tailwind-like 50..950 scale (lightness targets per step).
const SHADE_STOPS: { step: number; l: number }[] = [
  { step: 50, l: 97 },
  { step: 100, l: 94 },
  { step: 200, l: 86 },
  { step: 300, l: 76 },
  { step: 400, l: 64 },
  { step: 500, l: 52 },
  { step: 600, l: 44 },
  { step: 700, l: 36 },
  { step: 800, l: 28 },
  { step: 900, l: 20 },
  { step: 950, l: 12 },
];

export type Shade = { step: number; rgb: RGB };

export function generateShades(base: RGB): Shade[] {
  const { h, s } = rgbToHsl(base);
  return SHADE_STOPS.map(({ step, l }) => ({
    step,
    rgb: hslToRgb({ h, s, l }),
  }));
}

export function shadesToCssVars(name: string, shades: Shade[]): string {
  const root = shades
    .map((sh) => {
      const hex = `#${toHex(sh.rgb.r)}${toHex(sh.rgb.g)}${toHex(sh.rgb.b)}`;
      return `  --${name}-${sh.step}: ${hex.toUpperCase()};`;
    })
    .join("\n");
  return `:root {\n${root}\n}`;
}

export function shadesToTailwind(name: string, shades: Shade[]): string {
  const obj = shades
    .map((sh) => `        ${sh.step}: '#${toHex(sh.rgb.r)}${toHex(sh.rgb.g)}${toHex(sh.rgb.b)}',`)
    .join("\n");
  return `// tailwind.config.js\nexport default {\n  theme: {\n    extend: {\n      colors: {\n        ${name}: {\n${obj}\n        },\n      },\n    },\n  },\n};`;
}

function toHex(n: number): string {
  return Math.max(0, Math.min(255, Math.round(n)))
    .toString(16)
    .padStart(2, "0");
}
