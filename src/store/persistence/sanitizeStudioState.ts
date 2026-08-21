import { rgbToHex, type RGB } from "../../lib/color";
import { isSafeFontDataUrl, sanitizeFontFamily } from "../../lib/font";
import { STUDIO_LIMITS, STUDIO_LOGO_DATA_URL_LIMIT, STUDIO_TEXT_LIMIT } from "../studio.constants";
import { type SavedBrandKit, type SavedColor, type StudioState } from "../studio.types";

const BRAND_TONES = new Set<SavedBrandKit["tone"]>([
  "modern",
  "classic",
  "playful",
  "minimal",
  "bold",
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isRgb = (value: unknown): value is RGB =>
  isRecord(value) &&
  [value.r, value.g, value.b].every(
    (channel) =>
      typeof channel === "number" && Number.isInteger(channel) && channel >= 0 && channel <= 255,
  );

const safeText = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value.trim().slice(0, STUDIO_TEXT_LIMIT) || fallback : fallback;

function sanitizeSavedColors(value: unknown): SavedColor[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .filter((color) => typeof color.id === "string" && isRgb(color.rgb))
    .slice(0, STUDIO_LIMITS.savedColors)
    .map((color) => ({
      id: (color.id as string).slice(0, 100),
      rgb: color.rgb as RGB,
      name: safeText(color.name, rgbToHex(color.rgb as RGB)),
    }));
}

function isSafeLogoDataUrl(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= STUDIO_LOGO_DATA_URL_LIMIT &&
    /^data:image\/(?:png|jpeg|webp);base64,/i.test(value)
  );
}

export function sanitizePersistedStudioState(value: unknown): Partial<StudioState> {
  if (!isRecord(value)) return {};
  const sanitized: Partial<StudioState> = {};

  if (value.theme === "dark" || value.theme === "light") sanitized.theme = value.theme;

  if (Array.isArray(value.savedColors)) {
    sanitized.savedColors = sanitizeSavedColors(value.savedColors);
  }

  if (Array.isArray(value.paletteLibrary)) {
    sanitized.paletteLibrary = value.paletteLibrary
      .filter(isRecord)
      .filter((palette) => typeof palette.id === "string")
      .slice(0, STUDIO_LIMITS.palettes)
      .map((palette) => ({
        id: (palette.id as string).slice(0, 100),
        name: safeText(palette.name, "Palet"),
        colors: sanitizeSavedColors(palette.colors),
      }));
  }

  if (Array.isArray(value.uploadedFonts)) {
    sanitized.uploadedFonts = value.uploadedFonts
      .filter(isRecord)
      .filter(
        (font) =>
          typeof font.family === "string" &&
          typeof font.fileName === "string" &&
          (font.data === undefined || isSafeFontDataUrl(font.data)),
      )
      .slice(0, STUDIO_LIMITS.uploadedFonts)
      .map((font) => ({
        family: sanitizeFontFamily(font.family as string),
        fileName: (font.fileName as string).slice(0, STUDIO_TEXT_LIMIT),
        ...(typeof font.data === "string" ? { data: font.data } : {}),
      }));
  }

  if (Array.isArray(value.savedBrandKits)) {
    sanitized.savedBrandKits = value.savedBrandKits
      .filter(isRecord)
      .filter(
        (kit) =>
          typeof kit.id === "string" &&
          typeof kit.createdAt === "number" &&
          Number.isFinite(kit.createdAt) &&
          isRgb(kit.primaryColor) &&
          isRgb(kit.secondaryColor) &&
          isRgb(kit.accentColor) &&
          isRgb(kit.backgroundColor) &&
          isRgb(kit.textColor) &&
          typeof kit.tone === "string" &&
          BRAND_TONES.has(kit.tone as SavedBrandKit["tone"]) &&
          (kit.logoDataUrl === undefined || isSafeLogoDataUrl(kit.logoDataUrl)),
      )
      .slice(0, STUDIO_LIMITS.brandKits)
      .map((kit) => ({
        id: (kit.id as string).slice(0, 100),
        name: safeText(kit.name, "Brand Kit"),
        brandName: safeText(kit.brandName, "My Brand"),
        tagline: safeText(kit.tagline),
        primaryColor: kit.primaryColor as RGB,
        secondaryColor: kit.secondaryColor as RGB,
        accentColor: kit.accentColor as RGB,
        backgroundColor: kit.backgroundColor as RGB,
        textColor: kit.textColor as RGB,
        headlineFont: sanitizeFontFamily(safeText(kit.headlineFont, "Inter")),
        bodyFont: sanitizeFontFamily(safeText(kit.bodyFont, "Inter")),
        monoFont: sanitizeFontFamily(safeText(kit.monoFont, "JetBrains Mono")),
        tone: kit.tone as SavedBrandKit["tone"],
        ...(typeof kit.logoDataUrl === "string" ? { logoDataUrl: kit.logoDataUrl } : {}),
        createdAt: kit.createdAt as number,
      }));
  }

  return sanitized;
}
