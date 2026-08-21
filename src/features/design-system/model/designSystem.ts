import { type RGB, rgbToHex, rgbToHsl, hslToRgb, rotateHue, withLightness } from "../../color";
import { generateShades, type Shade } from "../../color";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DesignToken = {
  name: string;
  value: string;
  category: "color" | "typography" | "spacing" | "radius" | "shadow";
};

// Token/prefix names are embedded into exported code (CSS variable names,
// JSON keys, SCSS vars). Restrict to a safe identifier character set.
export function sanitizeTokenName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32);
}

export type ColorRole = {
  role: string;
  hex: string;
  rgb: RGB;
  usage: string;
};

export type TypographyScale = {
  name: string;
  size: string;
  lineHeight: string;
  fontWeight: number;
  usage: string;
};

export type SpacingScale = {
  name: string;
  value: string;
  px: number;
  usage: string;
};

export type RadiusScale = {
  name: string;
  value: string;
  usage: string;
};

export type ShadowScale = {
  name: string;
  css: string;
  usage: string;
};

export type DesignSystem = {
  name: string;
  colors: ColorRole[];
  shades: Shade[];
  typography: TypographyScale[];
  spacing: SpacingScale[];
  radius: RadiusScale[];
  shadows: ShadowScale[];
};

// ---------------------------------------------------------------------------
// Generate full design system from a base color
// ---------------------------------------------------------------------------

export function generateDesignSystem(base: RGB, name: string = "brand"): DesignSystem {
  const hsl = rgbToHsl(base);
  const shades = generateShades(base);

  // Derive color roles from the base color
  const primary = base;
  const primaryLight = hslToRgb({
    h: hsl.h,
    s: Math.max(hsl.s - 15, 10),
    l: Math.min(hsl.l + 25, 90),
  });
  const primaryDark = hslToRgb({
    h: hsl.h,
    s: Math.min(hsl.s + 10, 100),
    l: Math.max(hsl.l - 25, 10),
  });

  // Secondary: complementary-ish (rotate 150°)
  const secondary = rotateHue(base, 150);
  const secondaryHsl = rgbToHsl(secondary);
  const secondaryLight = hslToRgb({
    h: secondaryHsl.h,
    s: Math.max(secondaryHsl.s - 15, 10),
    l: Math.min(secondaryHsl.l + 25, 90),
  });

  // Accent: analogous warm (rotate 30°)
  const accent = rotateHue(base, 30);
  const accentHsl = rgbToHsl(accent);
  const accentLight = hslToRgb({
    h: accentHsl.h,
    s: Math.max(accentHsl.s - 10, 10),
    l: Math.min(accentHsl.l + 20, 88),
  });

  // Neutrals: desaturated version of the base
  const neutralBase = withLightness(base, 50);
  const neutralHsl = rgbToHsl(neutralBase);
  const neutral = (l: number) => hslToRgb({ h: neutralHsl.h, s: Math.min(neutralHsl.s, 15), l });

  // Semantic colors
  const success = { r: 34, g: 197, b: 94 }; // green-500
  const warning = { r: 234, g: 179, b: 8 }; // yellow-500
  const error = { r: 239, g: 68, b: 68 }; // red-500
  const info = { r: 59, g: 130, b: 246 }; // blue-500

  const colors: ColorRole[] = [
    {
      role: "Primary",
      hex: rgbToHex(primary),
      rgb: primary,
      usage: "Main brand color, CTAs, links, focus rings",
    },
    {
      role: "Primary Light",
      hex: rgbToHex(primaryLight),
      rgb: primaryLight,
      usage: "Hover states, secondary buttons, highlights",
    },
    {
      role: "Primary Dark",
      hex: rgbToHex(primaryDark),
      rgb: primaryDark,
      usage: "Active states, emphasis, dark mode accents",
    },
    {
      role: "Secondary",
      hex: rgbToHex(secondary),
      rgb: secondary,
      usage: "Secondary actions, badges, tags",
    },
    {
      role: "Secondary Light",
      hex: rgbToHex(secondaryLight),
      rgb: secondaryLight,
      usage: "Secondary hover, subtle backgrounds",
    },
    {
      role: "Accent",
      hex: rgbToHex(accent),
      rgb: accent,
      usage: "Accents, highlights, illustrations",
    },
    {
      role: "Accent Light",
      hex: rgbToHex(accentLight),
      rgb: accentLight,
      usage: "Accent backgrounds, subtle highlights",
    },
    { role: "Background", hex: rgbToHex(neutral(99)), rgb: neutral(99), usage: "Page background" },
    {
      role: "Surface",
      hex: rgbToHex(neutral(98)),
      rgb: neutral(98),
      usage: "Card/panel background",
    },
    {
      role: "Surface Variant",
      hex: rgbToHex(neutral(94)),
      rgb: neutral(94),
      usage: "Borders, dividers, subtle backgrounds",
    },
    {
      role: "Text Primary",
      hex: rgbToHex(neutral(10)),
      rgb: neutral(10),
      usage: "Headings, primary body text",
    },
    {
      role: "Text Secondary",
      hex: rgbToHex(neutral(50)),
      rgb: neutral(50),
      usage: "Subtitles, descriptions, captions",
    },
    {
      role: "Text Tertiary",
      hex: rgbToHex(neutral(60)),
      rgb: neutral(60),
      usage: "Placeholders, disabled text",
    },
    {
      role: "Border",
      hex: rgbToHex(neutral(85)),
      rgb: neutral(85),
      usage: "Default borders, dividers",
    },
    {
      role: "Success",
      hex: rgbToHex(success),
      rgb: success,
      usage: "Success states, positive feedback",
    },
    {
      role: "Warning",
      hex: rgbToHex(warning),
      rgb: warning,
      usage: "Warning states, caution indicators",
    },
    { role: "Error", hex: rgbToHex(error), rgb: error, usage: "Error states, destructive actions" },
    {
      role: "Info",
      hex: rgbToHex(info),
      rgb: info,
      usage: "Informational states, neutral highlights",
    },
  ];

  // Typography scale
  const typography: TypographyScale[] = [
    {
      name: "Display XL",
      size: "3.5rem",
      lineHeight: "1.1",
      fontWeight: 800,
      usage: "Hero headings, splash screens",
    },
    {
      name: "Display",
      size: "2.5rem",
      lineHeight: "1.15",
      fontWeight: 700,
      usage: "Section headings, feature titles",
    },
    { name: "H1", size: "2rem", lineHeight: "1.2", fontWeight: 700, usage: "Page titles" },
    { name: "H2", size: "1.5rem", lineHeight: "1.25", fontWeight: 600, usage: "Section titles" },
    {
      name: "H3",
      size: "1.25rem",
      lineHeight: "1.3",
      fontWeight: 600,
      usage: "Card titles, subsection headers",
    },
    {
      name: "H4",
      size: "1.125rem",
      lineHeight: "1.35",
      fontWeight: 600,
      usage: "Small headings, labels",
    },
    {
      name: "Body Large",
      size: "1.125rem",
      lineHeight: "1.6",
      fontWeight: 400,
      usage: "Lead paragraphs, intros",
    },
    { name: "Body", size: "1rem", lineHeight: "1.6", fontWeight: 400, usage: "Default body text" },
    {
      name: "Body Small",
      size: "0.875rem",
      lineHeight: "1.5",
      fontWeight: 400,
      usage: "Secondary text, descriptions",
    },
    {
      name: "Caption",
      size: "0.75rem",
      lineHeight: "1.4",
      fontWeight: 500,
      usage: "Captions, timestamps, metadata",
    },
    {
      name: "Overline",
      size: "0.6875rem",
      lineHeight: "1.3",
      fontWeight: 600,
      usage: "Labels, categories, uppercase tags",
    },
    {
      name: "Code",
      size: "0.875rem",
      lineHeight: "1.6",
      fontWeight: 400,
      usage: "Inline code, code blocks (monospace)",
    },
  ];

  // Spacing scale (4px base)
  const spacing: SpacingScale[] = [
    { name: "0", value: "0", px: 0, usage: "No spacing" },
    { name: "0.5", value: "0.125rem", px: 2, usage: "Micro gap" },
    { name: "1", value: "0.25rem", px: 4, usage: "Tight spacing (icon gaps)" },
    { name: "1.5", value: "0.375rem", px: 6, usage: "Compact spacing" },
    { name: "2", value: "0.5rem", px: 8, usage: "Small spacing (inline elements)" },
    { name: "3", value: "0.75rem", px: 12, usage: "Default spacing (button padding)" },
    { name: "4", value: "1rem", px: 16, usage: "Medium spacing (card padding)" },
    { name: "5", value: "1.25rem", px: 20, usage: "Large spacing (section gaps)" },
    { name: "6", value: "1.5rem", px: 24, usage: "Extra large spacing" },
    { name: "8", value: "2rem", px: 32, usage: "2x spacing (section padding)" },
    { name: "10", value: "2.5rem", px: 40, usage: "3x spacing" },
    { name: "12", value: "3rem", px: 48, usage: "4x spacing (page margins)" },
    { name: "16", value: "4rem", px: 64, usage: "Large section spacing" },
    { name: "20", value: "5rem", px: 80, usage: "Hero spacing" },
    { name: "24", value: "6rem", px: 96, usage: "Extra large section spacing" },
  ];

  // Border radius scale
  const radius: RadiusScale[] = [
    { name: "none", value: "0", usage: "Sharp corners" },
    { name: "sm", value: "0.25rem", usage: "Subtle rounding (inputs, badges)" },
    { name: "md", value: "0.375rem", usage: "Default rounding (buttons)" },
    { name: "lg", value: "0.5rem", usage: "Cards, panels" },
    { name: "xl", value: "0.75rem", usage: "Modals, dropdowns" },
    { name: "2xl", value: "1rem", usage: "Large cards, hero sections" },
    { name: "3xl", value: "1.5rem", usage: "Feature cards" },
    { name: "full", value: "9999px", usage: "Pills, circular elements" },
  ];

  // Shadow scale
  const shadows: ShadowScale[] = [
    { name: "xs", css: "0 1px 2px 0 rgba(0,0,0,0.05)", usage: "Subtle lift for small elements" },
    {
      name: "sm",
      css: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
      usage: "Cards, buttons",
    },
    {
      name: "md",
      css: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
      usage: "Dropdowns, popovers",
    },
    {
      name: "lg",
      css: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
      usage: "Modals, cards on hover",
    },
    {
      name: "xl",
      css: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
      usage: "Large modals, floating panels",
    },
    {
      name: "2xl",
      css: "0 25px 50px -12px rgba(0,0,0,0.25)",
      usage: "Tooltips, prominent popovers",
    },
    {
      name: "inner",
      css: "inset 0 2px 4px 0 rgba(0,0,0,0.05)",
      usage: "Input focus, inset effects",
    },
    {
      name: "glow",
      css: `0 0 20px 4px ${rgbToHex(base)}33`,
      usage: "Brand glow, focus ring effect",
    },
  ];

  return {
    name,
    colors,
    shades,
    typography,
    spacing,
    radius,
    shadows,
  };
}
