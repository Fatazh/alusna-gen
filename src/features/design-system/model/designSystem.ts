import {
  bestTextOn,
  contrastRatio,
  generateShades,
  hslToRgb,
  rgbToHex,
  rgbToHsl,
  rotateHue,
  type RGB,
  type Shade,
  withLightness,
} from "../../color";

export type ThemeMode = "light" | "dark" | "high-contrast";

export type DesignSystemOptions = {
  name?: string;
  mode?: ThemeMode;
  fontFamily?: string;
  spacingBase?: number;
  radiusBase?: number;
};

export type DesignToken = {
  name: string;
  value: string;
  category: "color" | "typography" | "spacing" | "radius" | "shadow";
};

export function sanitizeTokenName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32);
}

export function sanitizeFontFamily(name: string): string {
  return name
    .replace(/[{};<>]/g, "")
    .replace(/[\r\n\t]+/g, " ")
    .trim()
    .slice(0, 80);
}

export type ColorRole = {
  token: string;
  role: string;
  hex: string;
  rgb: RGB;
  usage: string;
};

export type ComponentColorToken = {
  component: "button" | "card" | "input" | "alert";
  property: string;
  reference: string;
  usage: string;
};

export type TypographyScale = {
  name: string;
  size: string;
  lineHeight: number;
  fontWeight: number;
  fontFamily: string;
  letterSpacing: string;
  usage: string;
};

export type SpacingScale = { name: string; value: string; px: number; usage: string };
export type RadiusScale = { name: string; value: string; px: number; usage: string };

export type ShadowLayer = {
  color: RGB;
  alpha: number;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  inset?: boolean;
};

export type ShadowScale = {
  name: string;
  css: string;
  layers: ShadowLayer[];
  usage: string;
};

export type ContrastCheck = {
  label: string;
  foregroundToken: string;
  backgroundToken: string;
  foreground: string;
  background: string;
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  aaa: boolean;
};

export type DesignSystem = {
  name: string;
  mode: ThemeMode;
  fontFamily: string;
  spacingBase: number;
  radiusBase: number;
  colors: ColorRole[];
  shades: Shade[];
  componentColors: ComponentColorToken[];
  typography: TypographyScale[];
  spacing: SpacingScale[];
  radius: RadiusScale[];
  shadows: ShadowScale[];
  contrastChecks: ContrastCheck[];
};

const WHITE: RGB = { r: 255, g: 255, b: 255 };
const BLACK: RGB = { r: 0, g: 0, b: 0 };

const colorRole = (token: string, role: string, rgb: RGB, usage: string): ColorRole => ({
  token,
  role,
  hex: rgbToHex(rgb),
  rgb,
  usage,
});

const textOn = (color: RGB): RGB => (bestTextOn(color) === "#000000" ? BLACK : WHITE);
const remValue = (px: number) => (px === 0 ? "0" : `${Number((px / 16).toFixed(4))}rem`);

const shadowCss = (layers: ShadowLayer[]) =>
  layers
    .map((layer) => {
      const prefix = layer.inset ? "inset " : "";
      return `${prefix}${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${layer.spread}px rgba(${layer.color.r},${layer.color.g},${layer.color.b},${layer.alpha})`;
    })
    .join(", ");

function semanticColors(base: RGB, mode: ThemeMode): ColorRole[] {
  const hsl = rgbToHsl(base);
  const primary = mode === "dark" ? withLightness(base, Math.max(hsl.l, 65)) : base;
  const primaryLightness = rgbToHsl(primary).l;
  const primaryHover = withLightness(
    primary,
    mode === "dark" ? Math.min(primaryLightness + 8, 88) : Math.max(primaryLightness - 8, 12),
  );
  const primaryActive = withLightness(
    primary,
    mode === "dark" ? Math.min(primaryLightness + 15, 92) : Math.max(primaryLightness - 16, 8),
  );
  const secondary = rotateHue(primary, 150);
  const accent = rotateHue(primary, 30);
  const neutralHsl = rgbToHsl(withLightness(base, 50));
  const neutral = (lightness: number) =>
    hslToRgb({ h: neutralHsl.h, s: Math.min(neutralHsl.s, 12), l: lightness });

  const canvas =
    mode === "high-contrast"
      ? { background: BLACK, surface: BLACK, variant: { r: 24, g: 24, b: 27 } }
      : mode === "dark"
        ? { background: neutral(7), surface: neutral(11), variant: neutral(17) }
        : { background: neutral(99), surface: neutral(97), variant: neutral(92) };
  const text =
    mode === "high-contrast"
      ? { primary: WHITE, secondary: WHITE, tertiary: { r: 229, g: 229, b: 229 } }
      : mode === "dark"
        ? { primary: neutral(96), secondary: neutral(76), tertiary: neutral(64) }
        : { primary: neutral(10), secondary: neutral(38), tertiary: neutral(50) };
  const border = mode === "high-contrast" ? WHITE : mode === "dark" ? neutral(28) : neutral(82);
  const success = mode === "dark" ? { r: 74, g: 222, b: 128 } : { r: 22, g: 163, b: 74 };
  const warning = mode === "dark" ? { r: 250, g: 204, b: 21 } : { r: 161, g: 98, b: 7 };
  const error = mode === "dark" ? { r: 248, g: 113, b: 113 } : { r: 220, g: 38, b: 38 };
  const info = mode === "dark" ? { r: 96, g: 165, b: 250 } : { r: 37, g: 99, b: 235 };

  return [
    colorRole("primary", "Primary", primary, "Main brand color, CTAs, links, focus rings"),
    colorRole("primary-hover", "Primary Hover", primaryHover, "Primary hover state"),
    colorRole("primary-active", "Primary Active", primaryActive, "Primary pressed state"),
    colorRole("on-primary", "On Primary", textOn(primary), "Text and icons on primary"),
    colorRole("secondary", "Secondary", secondary, "Secondary actions, badges, tags"),
    colorRole("on-secondary", "On Secondary", textOn(secondary), "Text and icons on secondary"),
    colorRole("accent", "Accent", accent, "Highlights and illustrations"),
    colorRole("on-accent", "On Accent", textOn(accent), "Text and icons on accent"),
    colorRole("background", "Background", canvas.background, "Page background"),
    colorRole("surface", "Surface", canvas.surface, "Card and panel background"),
    colorRole("surface-variant", "Surface Variant", canvas.variant, "Subtle grouped background"),
    colorRole("text-primary", "Text Primary", text.primary, "Headings and primary body text"),
    colorRole(
      "text-secondary",
      "Text Secondary",
      text.secondary,
      "Descriptions and supporting text",
    ),
    colorRole("text-tertiary", "Text Tertiary", text.tertiary, "Placeholders and disabled text"),
    colorRole("border", "Border", border, "Borders and dividers"),
    colorRole("success", "Success", success, "Success states and positive feedback"),
    colorRole("on-success", "On Success", textOn(success), "Text and icons on success"),
    colorRole("warning", "Warning", warning, "Warnings and caution indicators"),
    colorRole("on-warning", "On Warning", textOn(warning), "Text and icons on warning"),
    colorRole("error", "Error", error, "Errors and destructive actions"),
    colorRole("on-error", "On Error", textOn(error), "Text and icons on error"),
    colorRole("info", "Info", info, "Informational states"),
    colorRole("on-info", "On Info", textOn(info), "Text and icons on info"),
  ];
}

function makeTypography(fontFamily: string): TypographyScale[] {
  const item = (
    name: string,
    size: string,
    lineHeight: number,
    fontWeight: number,
    letterSpacing: string,
    usage: string,
  ): TypographyScale => ({ name, size, lineHeight, fontWeight, fontFamily, letterSpacing, usage });

  return [
    item("Display XL", "3.5rem", 1.1, 800, "-0.03em", "Hero headings and splash screens"),
    item("Display", "2.5rem", 1.15, 700, "-0.025em", "Section headings and feature titles"),
    item("H1", "2rem", 1.2, 700, "-0.02em", "Page titles"),
    item("H2", "1.5rem", 1.25, 600, "-0.015em", "Section titles"),
    item("H3", "1.25rem", 1.3, 600, "-0.01em", "Card titles and subsection headers"),
    item("H4", "1.125rem", 1.35, 600, "0", "Small headings and labels"),
    item("Body Large", "1.125rem", 1.6, 400, "0", "Lead paragraphs and intros"),
    item("Body", "1rem", 1.6, 400, "0", "Default body text"),
    item("Body Small", "0.875rem", 1.5, 400, "0", "Secondary text and descriptions"),
    item("Caption", "0.75rem", 1.4, 500, "0.01em", "Captions and metadata"),
    item("Overline", "0.6875rem", 1.3, 600, "0.08em", "Labels and categories"),
    item("Code", "0.875rem", 1.6, 400, "0", "Inline code and code blocks"),
  ];
}

function makeSpacing(base: number): SpacingScale[] {
  const values: Array<[string, number, string]> = [
    ["0", 0, "No spacing"],
    ["0.5", 0.5, "Micro gap"],
    ["1", 1, "Tight spacing"],
    ["1.5", 1.5, "Compact spacing"],
    ["2", 2, "Small spacing"],
    ["3", 3, "Default control padding"],
    ["4", 4, "Default card padding"],
    ["5", 5, "Large spacing"],
    ["6", 6, "Extra large spacing"],
    ["8", 8, "Section padding"],
    ["10", 10, "Large section gap"],
    ["12", 12, "Page margins"],
    ["16", 16, "Large layout spacing"],
    ["20", 20, "Hero spacing"],
    ["24", 24, "Extra large section spacing"],
  ];
  return values.map(([name, multiplier, usage]) => {
    const px = Number((base * multiplier).toFixed(2));
    return { name, px, value: remValue(px), usage };
  });
}

function makeRadius(base: number): RadiusScale[] {
  const values: Array<[string, number, string]> = [
    ["none", 0, "Sharp corners"],
    ["sm", 0.5, "Inputs and badges"],
    ["md", 0.75, "Buttons"],
    ["lg", 1, "Cards and panels"],
    ["xl", 1.5, "Modals and dropdowns"],
    ["2xl", 2, "Large cards"],
    ["3xl", 3, "Feature cards"],
  ];
  const radius = values.map(([name, multiplier, usage]) => {
    const px = Number((base * multiplier).toFixed(2));
    return { name, px, value: remValue(px), usage };
  });
  radius.push({ name: "full", px: 9999, value: "9999px", usage: "Pills and circles" });
  return radius;
}

function makeShadows(base: RGB, mode: ThemeMode): ShadowScale[] {
  const shadowColor = mode === "light" ? BLACK : WHITE;
  const alphaMultiplier = mode === "light" ? 1 : 0.65;
  const layer = (offsetY: number, blur: number, spread: number, alpha: number): ShadowLayer => ({
    color: shadowColor,
    alpha: Number((alpha * alphaMultiplier).toFixed(3)),
    offsetX: 0,
    offsetY,
    blur,
    spread,
  });
  const define = (name: string, layers: ShadowLayer[], usage: string): ShadowScale => ({
    name,
    layers,
    css: shadowCss(layers),
    usage,
  });

  return [
    define("xs", [layer(1, 2, 0, 0.05)], "Subtle lift for small elements"),
    define("sm", [layer(1, 3, 0, 0.1), layer(1, 2, -1, 0.1)], "Cards and buttons"),
    define("md", [layer(4, 6, -1, 0.1), layer(2, 4, -2, 0.1)], "Dropdowns and popovers"),
    define("lg", [layer(10, 15, -3, 0.1), layer(4, 6, -4, 0.1)], "Modals and hover cards"),
    define("xl", [layer(20, 25, -5, 0.1), layer(8, 10, -6, 0.1)], "Large modals"),
    define("2xl", [layer(25, 50, -12, 0.25)], "Prominent floating panels"),
    define("inner", [{ ...layer(2, 4, 0, 0.05), inset: true }], "Inset and pressed states"),
    define(
      "glow",
      [{ color: base, alpha: 0.2, offsetX: 0, offsetY: 0, blur: 20, spread: 4 }],
      "Brand focus and glow effect",
    ),
  ];
}

const COMPONENT_COLORS: ComponentColorToken[] = [
  { component: "button", property: "background", reference: "primary", usage: "Primary button" },
  {
    component: "button",
    property: "foreground",
    reference: "on-primary",
    usage: "Primary button label",
  },
  {
    component: "button",
    property: "hover",
    reference: "primary-hover",
    usage: "Primary button hover",
  },
  { component: "card", property: "background", reference: "surface", usage: "Card surface" },
  { component: "card", property: "foreground", reference: "text-primary", usage: "Card content" },
  { component: "card", property: "border", reference: "border", usage: "Card boundary" },
  { component: "input", property: "background", reference: "surface", usage: "Input background" },
  { component: "input", property: "foreground", reference: "text-primary", usage: "Input value" },
  { component: "input", property: "border", reference: "border", usage: "Input border" },
  { component: "alert", property: "background", reference: "info", usage: "Information alert" },
  {
    component: "alert",
    property: "foreground",
    reference: "on-info",
    usage: "Information alert text",
  },
];

function makeContrastChecks(colors: ColorRole[]): ContrastCheck[] {
  const byToken = new Map(colors.map((color) => [color.token, color]));
  const pairs: Array<[string, string, string]> = [
    ["Primary action", "on-primary", "primary"],
    ["Page content", "text-primary", "background"],
    ["Card content", "text-primary", "surface"],
    ["Secondary text", "text-secondary", "surface"],
    ["Error message", "on-error", "error"],
    ["Information alert", "on-info", "info"],
  ];

  return pairs.map(([label, foregroundToken, backgroundToken]) => {
    const foreground = byToken.get(foregroundToken);
    const background = byToken.get(backgroundToken);
    if (!foreground || !background) throw new Error(`Missing contrast token for ${label}`);
    const ratio = contrastRatio(foreground.rgb, background.rgb);
    return {
      label,
      foregroundToken,
      backgroundToken,
      foreground: foreground.hex,
      background: background.hex,
      ratio,
      aaNormal: ratio >= 4.5,
      aaLarge: ratio >= 3,
      aaa: ratio >= 7,
    };
  });
}

export function getDesignSystemColor(system: DesignSystem, token: string): ColorRole {
  const color = system.colors.find((candidate) => candidate.token === token);
  if (!color) throw new Error(`Unknown design-system color token: ${token}`);
  return color;
}

export function generateDesignSystem(
  base: RGB,
  nameOrOptions: string | DesignSystemOptions = "brand",
): DesignSystem {
  const options = typeof nameOrOptions === "string" ? { name: nameOrOptions } : nameOrOptions;
  const name = sanitizeTokenName(options.name ?? "brand") || "brand";
  const mode = options.mode ?? "light";
  const fontFamily = sanitizeFontFamily(options.fontFamily ?? "") || "Inter";
  const spacingBase = Math.min(8, Math.max(2, options.spacingBase ?? 4));
  const radiusBase = Math.min(24, Math.max(0, options.radiusBase ?? 8));
  const colors = semanticColors(base, mode);

  return {
    name,
    mode,
    fontFamily,
    spacingBase,
    radiusBase,
    colors,
    shades: generateShades(base),
    componentColors: COMPONENT_COLORS,
    typography: makeTypography(fontFamily),
    spacing: makeSpacing(spacingBase),
    radius: makeRadius(radiusBase),
    shadows: makeShadows(base, mode),
    contrastChecks: makeContrastChecks(colors),
  };
}
