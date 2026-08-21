import { type RGB, rgbToHex, rgbToHsl, hslToRgb, rotateHue, withLightness } from "./color";
import { generateShades, type Shade } from "./shades";

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

// ---------------------------------------------------------------------------
// Export formats
// ---------------------------------------------------------------------------

export function toCssVariables(ds: DesignSystem): string {
  const lines: string[] = [":root {", "  /* ── Colors ── */"];
  ds.colors.forEach((c) => {
    const varName = `--${ds.name}-${c.role.toLowerCase().replace(/\s+/g, "-")}`;
    lines.push(`  ${varName}: ${c.hex};`);
  });
  lines.push("");
  lines.push("  /* ── Shade scale ── */");
  ds.shades.forEach((s) => {
    lines.push(`  --${ds.name}-${s.step}: ${rgbToHex(s.rgb)};`);
  });
  lines.push("");
  lines.push("  /* ── Typography ── */");
  ds.typography.forEach((t) => {
    const prefix = `--${ds.name}-text-${t.name.toLowerCase().replace(/\s+/g, "-")}`;
    lines.push(`  ${prefix}-size: ${t.size};`);
    lines.push(`  ${prefix}-line-height: ${t.lineHeight};`);
    lines.push(`  ${prefix}-weight: ${t.fontWeight};`);
  });
  lines.push("");
  lines.push("  /* ── Spacing ── */");
  ds.spacing.forEach((s) => {
    lines.push(`  --${ds.name}-space-${s.name}: ${s.value};`);
  });
  lines.push("");
  lines.push("  /* ── Border Radius ── */");
  ds.radius.forEach((r) => {
    lines.push(`  --${ds.name}-radius-${r.name}: ${r.value};`);
  });
  lines.push("");
  lines.push("  /* ── Shadows ── */");
  ds.shadows.forEach((s) => {
    lines.push(`  --${ds.name}-shadow-${s.name}: ${s.css};`);
  });
  lines.push("}");
  return lines.join("\n");
}

export function toTailwindConfig(ds: DesignSystem): string {
  const colorObj: Record<string, string> = {};
  ds.colors.forEach((c) => {
    const key = c.role.toLowerCase().replace(/\s+/g, "-");
    colorObj[key] = c.hex;
  });

  const shadeObj: Record<string, string> = {};
  ds.shades.forEach((s) => {
    shadeObj[s.step] = rgbToHex(s.rgb);
  });

  const spacingObj: Record<string, string> = {};
  ds.spacing.forEach((s) => {
    spacingObj[s.name] = s.value;
  });

  const radiusObj: Record<string, string> = {};
  ds.radius.forEach((r) => {
    radiusObj[r.name] = r.value;
  });

  const config = {
    theme: {
      extend: {
        colors: {
          [ds.name]: colorObj,
          [`${ds.name}-shade`]: shadeObj,
        },
        spacing: spacingObj,
        borderRadius: radiusObj,
        boxShadow: Object.fromEntries(ds.shadows.map((s) => [s.name, s.css])),
      },
    },
  };

  return `// tailwind.config.js\nexport default ${JSON.stringify(config, null, 2)};`;
}

export function toJsonTokens(ds: DesignSystem): string {
  const tokens: Record<string, unknown> = {
    [ds.name]: {
      color: Object.fromEntries(
        ds.colors.map((c) => [
          c.role.toLowerCase().replace(/\s+/g, "-"),
          { $type: "color", $value: c.hex, $description: c.usage },
        ]),
      ),
      shade: Object.fromEntries(
        ds.shades.map((s) => [String(s.step), { $type: "color", $value: rgbToHex(s.rgb) }]),
      ),
      typography: Object.fromEntries(
        ds.typography.map((t) => [
          t.name.toLowerCase().replace(/\s+/g, "-"),
          {
            $type: "typography",
            $value: {
              fontSize: t.size,
              lineHeight: t.lineHeight,
              fontWeight: t.fontWeight,
            },
            $description: t.usage,
          },
        ]),
      ),
      spacing: Object.fromEntries(
        ds.spacing.map((s) => [
          s.name,
          { $type: "dimension", $value: s.value, $description: s.usage },
        ]),
      ),
      radius: Object.fromEntries(
        ds.radius.map((r) => [
          r.name,
          { $type: "dimension", $value: r.value, $description: r.usage },
        ]),
      ),
      shadow: Object.fromEntries(
        ds.shadows.map((s) => [s.name, { $type: "shadow", $value: s.css, $description: s.usage }]),
      ),
    },
  };
  return JSON.stringify(tokens, null, 2);
}

export function toReactNativeTheme(ds: DesignSystem): string {
  const colors: Record<string, string> = {};
  ds.colors.forEach((c) => {
    colors[c.role.toLowerCase().replace(/\s+/g, "_")] = c.hex;
  });

  const theme = {
    colors,
    typography: Object.fromEntries(
      ds.typography.map((t) => [
        t.name.toLowerCase().replace(/\s+/g, "_"),
        {
          fontSize: parseFloat(t.size) * 16,
          lineHeight: parseFloat(t.lineHeight) * parseFloat(t.size) * 16,
          fontWeight: String(t.fontWeight),
        },
      ]),
    ),
    spacing: Object.fromEntries(ds.spacing.map((s) => [s.name, s.px])),
    borderRadius: Object.fromEntries(
      ds.radius.map((r) => [r.name, r.value === "9999px" ? 9999 : parseFloat(r.value) * 16]),
    ),
  };

  return `// theme.ts\nimport { DefaultTheme } from 'styled-components';\n\nexport const theme = ${JSON.stringify(theme, null, 2)} as const;\n\nexport type AppTheme = typeof theme;`;
}

export function toScssVariables(ds: DesignSystem): string {
  const lines: string[] = ["// ── Design System SCSS Variables ──", ""];

  lines.push("// Colors");
  ds.colors.forEach((c) => {
    const varName = `$${ds.name}-${c.role.toLowerCase().replace(/\s+/g, "-")}`;
    lines.push(`${varName}: ${c.hex};`);
  });

  lines.push("");
  lines.push("// Shade scale");
  ds.shades.forEach((s) => {
    lines.push(`$${ds.name}-${s.step}: ${rgbToHex(s.rgb)};`);
  });

  lines.push("");
  lines.push("// Typography");
  ds.typography.forEach((t) => {
    const prefix = `$${ds.name}-text-${t.name.toLowerCase().replace(/\s+/g, "-")}`;
    lines.push(`${prefix}-size: ${t.size};`);
    lines.push(`${prefix}-line-height: ${t.lineHeight};`);
    lines.push(`${prefix}-weight: ${t.fontWeight};`);
  });

  lines.push("");
  lines.push("// Spacing");
  ds.spacing.forEach((s) => {
    lines.push(`$${ds.name}-space-${s.name}: ${s.value};`);
  });

  lines.push("");
  lines.push("// Border Radius");
  ds.radius.forEach((r) => {
    lines.push(`$${ds.name}-radius-${r.name}: ${r.value};`);
  });

  lines.push("");
  lines.push("// Shadows");
  ds.shadows.forEach((s) => {
    lines.push(`$${ds.name}-shadow-${s.name}: ${s.css};`);
  });

  return lines.join("\n");
}

export type ExportFormat = "css" | "tailwind" | "json" | "react-native" | "scss";

export function exportDesignSystem(ds: DesignSystem, format: ExportFormat): string {
  switch (format) {
    case "css":
      return toCssVariables(ds);
    case "tailwind":
      return toTailwindConfig(ds);
    case "json":
      return toJsonTokens(ds);
    case "react-native":
      return toReactNativeTheme(ds);
    case "scss":
      return toScssVariables(ds);
  }
}

// ---------------------------------------------------------------------------
// Brand Kit
// ---------------------------------------------------------------------------

export type BrandKit = {
  brandName: string;
  tagline: string;
  logoDataUrl?: string;
  primaryColor: RGB;
  secondaryColor: RGB;
  accentColor: RGB;
  backgroundColor: RGB;
  textColor: RGB;
  headlineFont: string;
  bodyFont: string;
  monoFont: string;
  tone: "modern" | "classic" | "playful" | "minimal" | "bold";
  guidelines: BrandGuideline[];
};

export type BrandGuideline = {
  section: string;
  items: { label: string; value: string; hex?: string }[];
};

// ---------------------------------------------------------------------------
// Brand Tone — each tone drives the brand voice, font pairing & preview style
// ---------------------------------------------------------------------------

export type BrandTone = "modern" | "classic" | "playful" | "minimal" | "bold";

export type BrandToneProfile = {
  id: BrandTone;
  label: string;
  icon: string;
  desc: string;
  voice: {
    tone: string;
    voice: string;
    language: string;
    keywords: string;
  };
  headlineFont: string;
  bodyFont: string;
  monoFont: string;
  style: {
    // Corner radius (px) applied to cards & panels in the live preview / HTML export
    radius: number;
    // Corner radius (px) for buttons
    buttonRadius: number;
    headingWeight: number;
    headingSize: number; // px
    letterSpacing: string;
    headingTransform: "uppercase" | "none";
    // Card padding (px) — also scales hero padding
    spacing: number;
    // Button / card shadow
    shadow: string;
  };
};

export const TONE_PROFILES: Record<BrandTone, BrandToneProfile> = {
  modern: {
    id: "modern",
    label: "Modern",
    icon: "✨",
    desc: "Clean, sleek, contemporary",
    voice: {
      tone: "Clean, sleek, contemporary",
      voice: "Confident, forward-thinking, precise",
      language: "Simple, direct, with a tech-forward edge",
      keywords: "Innovative · Scalable · Cutting-edge",
    },
    headlineFont: "Poppins",
    bodyFont: "Inter",
    monoFont: "JetBrains Mono",
    style: {
      radius: 16,
      buttonRadius: 10,
      headingWeight: 700,
      headingSize: 30,
      letterSpacing: "-0.02em",
      headingTransform: "none",
      spacing: 24,
      shadow: "0 10px 30px -12px rgba(0, 0, 0, 0.4)",
    },
  },
  classic: {
    id: "classic",
    label: "Classic",
    icon: "🏛",
    desc: "Timeless, elegant, refined",
    voice: {
      tone: "Timeless, elegant, refined",
      voice: "Respected, trustworthy, measured",
      language: "Formal, polished, carefully worded",
      keywords: "Heritage · Quality · Trust",
    },
    headlineFont: "Playfair Display",
    bodyFont: "Lora",
    monoFont: "IBM Plex Mono",
    style: {
      radius: 4,
      buttonRadius: 2,
      headingWeight: 600,
      headingSize: 34,
      letterSpacing: "0.01em",
      headingTransform: "none",
      spacing: 32,
      shadow: "0 4px 16px -8px rgba(0, 0, 0, 0.25)",
    },
  },
  playful: {
    id: "playful",
    label: "Playful",
    icon: "🎨",
    desc: "Fun, vibrant, energetic",
    voice: {
      tone: "Fun, vibrant, energetic",
      voice: "Cheerful, friendly, enthusiastic",
      language: "Casual, colorful, with playful puns",
      keywords: "Fun · Creative · Friendly",
    },
    headlineFont: "Baloo 2",
    bodyFont: "Nunito",
    monoFont: "Fira Code",
    style: {
      radius: 24,
      buttonRadius: 999,
      headingWeight: 800,
      headingSize: 32,
      letterSpacing: "-0.01em",
      headingTransform: "none",
      spacing: 20,
      shadow: "0 12px 32px -10px rgba(0, 0, 0, 0.35)",
    },
  },
  minimal: {
    id: "minimal",
    label: "Minimal",
    icon: "🧘",
    desc: "Simple, focused, zen",
    voice: {
      tone: "Simple, focused, zen",
      voice: "Calm, understated, precise",
      language: "Sparse, honest, no filler",
      keywords: "Less · Focus · Clarity",
    },
    headlineFont: "Inter",
    bodyFont: "Inter",
    monoFont: "Space Mono",
    style: {
      radius: 8,
      buttonRadius: 6,
      headingWeight: 600,
      headingSize: 26,
      letterSpacing: "0.02em",
      headingTransform: "uppercase",
      spacing: 40,
      shadow: "0 2px 8px -4px rgba(0, 0, 0, 0.15)",
    },
  },
  bold: {
    id: "bold",
    label: "Bold",
    icon: "💪",
    desc: "Strong, impactful, confident",
    voice: {
      tone: "Strong, impactful, confident",
      voice: "Assertive, powerful, unapologetic",
      language: "Direct, punchy, commanding",
      keywords: "Power · Impact · Action",
    },
    headlineFont: "Bebas Neue",
    bodyFont: "Roboto",
    monoFont: "Fira Code",
    style: {
      radius: 0,
      buttonRadius: 4,
      headingWeight: 700,
      headingSize: 40,
      letterSpacing: "0.04em",
      headingTransform: "uppercase",
      spacing: 28,
      shadow: "0 16px 40px -12px rgba(0, 0, 0, 0.5)",
    },
  },
};

export function generateBrandKit(
  primary: RGB,
  brandName: string = "My Brand",
  tone: BrandTone = "modern",
): BrandKit {
  const hsl = rgbToHsl(primary);
  // Defensive fallback: persisted kits may carry an invalid tone from older
  // localStorage versions, so never index TONE_PROFILES with an unknown key.
  const profile = TONE_PROFILES[tone] ?? TONE_PROFILES.modern;

  // Derive secondary and accent from primary
  const secondary = rotateHue(primary, hsl.s < 20 ? 0 : 150);
  const accent = rotateHue(primary, hsl.s < 20 ? 0 : 30);

  // Smart background & text based on luminance
  const bgLight = withLightness(primary, 99);
  const bgDark = withLightness(primary, 5);
  const textLight = withLightness(primary, 12);
  const textDark = withLightness(primary, 95);

  const luminance = rgbToHsl(primary).l / 100;
  const backgroundColor = luminance > 0.5 ? bgDark : bgLight;
  const textColor = luminance > 0.5 ? textDark : textLight;

  const guidelines: BrandGuideline[] = [
    {
      section: "Color Palette",
      items: [
        { label: "Primary", value: rgbToHex(primary), hex: rgbToHex(primary) },
        { label: "Secondary", value: rgbToHex(secondary), hex: rgbToHex(secondary) },
        { label: "Accent", value: rgbToHex(accent), hex: rgbToHex(accent) },
        { label: "Background", value: rgbToHex(backgroundColor), hex: rgbToHex(backgroundColor) },
        { label: "Text", value: rgbToHex(textColor), hex: rgbToHex(textColor) },
      ],
    },
    {
      section: "Typography",
      items: [
        { label: "Headline Font", value: profile.headlineFont },
        { label: "Body Font", value: profile.bodyFont },
        { label: "Monospace Font", value: profile.monoFont },
        {
          label: "Primary Heading",
          value: `${profile.style.headingWeight === 800 ? "ExtraBold" : profile.style.headingWeight === 600 ? "Semibold" : "Bold"} ${profile.style.headingWeight}, ${profile.style.headingSize / 16}rem / 1.2`,
        },
        { label: "Body Text", value: "Regular 400, 1rem / 1.6" },
      ],
    },
    {
      section: "Spacing & Layout",
      items: [
        { label: "Base Unit", value: "4px" },
        { label: "Content Max Width", value: "1280px" },
        { label: "Card Padding", value: `${profile.style.spacing}px` },
        { label: "Section Gap", value: "48px (space-12)" },
      ],
    },
    {
      section: "Brand Voice",
      items: [
        { label: "Tone", value: profile.voice.tone },
        { label: "Voice", value: profile.voice.voice },
        { label: "Language", value: profile.voice.language },
        { label: "Keywords", value: profile.voice.keywords },
      ],
    },
    {
      section: "Logo Usage",
      items: [
        { label: "Minimum Size", value: "24px height" },
        { label: "Clear Space", value: "1x logo height on all sides" },
        { label: "On Dark", value: `Use ${rgbToHex(textDark)} on dark backgrounds` },
        { label: "On Light", value: `Use ${rgbToHex(textLight)} on light backgrounds` },
      ],
    },
  ];

  return {
    brandName,
    tagline: "",
    primaryColor: primary,
    secondaryColor: secondary,
    accentColor: accent,
    backgroundColor,
    textColor,
    headlineFont: profile.headlineFont,
    bodyFont: profile.bodyFont,
    monoFont: profile.monoFont,
    tone: profile.id,
    guidelines,
  };
}

/** Escape user-controlled strings before interpolating into exported HTML. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function brandKitToHtml(kit: BrandKit): string {
  const p = kit.primaryColor;
  const s = kit.secondaryColor;
  const a = kit.accentColor;
  const bg = kit.backgroundColor;
  const text = kit.textColor;
  const profile = TONE_PROFILES[kit.tone] ?? TONE_PROFILES.modern;
  const fontQuery = [kit.headlineFont, kit.bodyFont, kit.monoFont]
    .filter((f, i, arr) => f && arr.indexOf(f) === i)
    .map((f) => `family=${escapeHtml(f).replace(/ /g, "+")}:wght@400;700`)
    .join("&");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(kit.brandName)} — Brand Guidelines</title>
  <link href="https://fonts.googleapis.com/css2?${fontQuery}&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: ${rgbToHex(p)};
      --secondary: ${rgbToHex(s)};
      --accent: ${rgbToHex(a)};
      --bg: ${rgbToHex(bg)};
      --text: ${rgbToHex(text)};
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: '${kit.bodyFont}', sans-serif; background: #fafafa; color: #1a1a1a; line-height: 1.6; }
    .hero { background: var(--primary); color: white; padding: ${profile.style.spacing * 3}px 40px; text-align: center; }
    .hero h1 { font-family: '${kit.headlineFont}', sans-serif; font-size: ${profile.style.headingSize / 16}rem; font-weight: ${profile.style.headingWeight}; letter-spacing: ${profile.style.letterSpacing}; text-transform: ${profile.style.headingTransform}; margin-bottom: 16px; }
    .hero p { font-size: 1.25rem; opacity: 0.85; }
    .container { max-width: 960px; margin: 0 auto; padding: 60px 24px; }
    .section { margin-bottom: 60px; }
    .section h2 { font-size: 1.75rem; font-weight: 700; margin-bottom: 24px; border-bottom: 3px solid var(--primary); padding-bottom: 8px; display: inline-block; }
    .color-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
    .color-card { border-radius: ${profile.style.radius}px; overflow: hidden; box-shadow: ${profile.style.shadow}; }
    .color-swatch { height: 100px; }
    .color-info { padding: 12px 16px; background: white; }
    .color-info .name { font-weight: 600; font-size: 0.875rem; }
    .color-info .hex { font-family: '${kit.monoFont}', monospace; font-size: 0.75rem; color: #666; }
    .type-sample { margin-bottom: 20px; padding: 20px; background: white; border-radius: ${profile.style.radius}px; border: 1px solid #e5e5e5; }
    .type-sample .label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #999; margin-bottom: 8px; }
    .guideline-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
    .guideline-item:last-child { border-bottom: none; }
    .guideline-item .label { font-weight: 500; }
    .guideline-item .value { color: #666; font-family: '${kit.monoFont}', monospace; font-size: 0.875rem; }
    .spacing-demo { display: flex; align-items: flex-end; gap: 8px; flex-wrap: wrap; }
    .space-block { background: var(--primary); border-radius: 4px; opacity: 0.7; }
  </style>
</head>
<body>
  <div class="hero">
    <h1>${escapeHtml(kit.brandName)}</h1>
    <p>${escapeHtml(kit.tagline) || "Brand Guidelines"}</p>
  </div>
  <div class="container">
    <div class="section">
      <h2>Color Palette</h2>
      <div class="color-grid">
        ${kit.guidelines[0].items
          .map(
            (item) => `
        <div class="color-card">
          <div class="color-swatch" style="background: ${item.hex}"></div>
          <div class="color-info">
            <div class="name">${item.label}</div>
            <div class="hex">${item.value}</div>
          </div>
        </div>`,
          )
          .join("")}
      </div>
    </div>
    <div class="section">
      <h2>Typography</h2>
      <div class="type-sample">
        <div class="label">Heading 1</div>
        <div style="font-size: 2rem; font-weight: 700;">The quick brown fox</div>
      </div>
      <div class="type-sample">
        <div class="label">Heading 2</div>
        <div style="font-size: 1.5rem; font-weight: 600;">The quick brown fox</div>
      </div>
      <div class="type-sample">
        <div class="label">Body</div>
        <div style="font-size: 1rem;">The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.</div>
      </div>
      <div class="type-sample">
        <div class="label">Caption</div>
        <div style="font-size: 0.75rem; color: #666;">The quick brown fox jumps over the lazy dog.</div>
      </div>
    </div>
    <div class="section">
      <h2>Brand Guidelines</h2>
      ${kit.guidelines
        .slice(2)
        .map(
          (g) => `
      <h3 style="margin: 24px 0 12px; font-size: 1.125rem;">${g.section}</h3>
      ${g.items
        .map(
          (item) => `
      <div class="guideline-item">
        <span class="label">${item.label}</span>
        <span class="value">${item.value}</span>
      </div>`,
        )
        .join("")}`,
        )
        .join("")}
    </div>
  </div>
</body>
</html>`;
}
