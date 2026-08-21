export * from "../features/design-system";

import { type RGB, rgbToHex, rgbToHsl, rotateHue, withLightness } from "../features/color";

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
