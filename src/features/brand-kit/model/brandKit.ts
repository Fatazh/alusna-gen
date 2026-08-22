import { type RGB, rgbToHex, rgbToHsl, rotateHue, withLightness } from "../../color";

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
