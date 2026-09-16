import { hexToRgb, rgbToHex, type RGB } from "@alusna/shared/color";

export const MAX_SHARE_URL_LENGTH = 2000;
const MAX_BRAND_TEXT_CHARS = 200;
const MAX_COLOR_LIST = 32;
const BRAND_TONES = new Set(["modern", "classic", "playful", "minimal", "bold"]);

export type ToolShareState = {
  /** Selected color (color tools). */
  c?: RGB;
  /** Font family (font tools, 1..100 chars). */
  f?: string;
  /** Brand kit configuration, without logo or font binaries (brand tools). */
  b?: {
    brandName: string;
    tagline: string;
    primaryColor: RGB;
    secondaryColor: RGB;
    accentColor: RGB;
    backgroundColor: RGB;
    textColor: RGB;
    headlineFont: string;
    bodyFont: string;
    monoFont: string;
    tone: string;
  };
  /** Extra color hex list, comma separated (palette tools). */
  p?: RGB[];
};

/**
 * Single source of truth for shareable font-family names, used by BOTH encode
 * and decode so a value that goes out can always come back. The two rules
 * previously diverged: names with dots passed encode, then failed decode and
 * killed the whole shared link at the receiver.
 */
export function isSafeFontFamily(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const family = value.trim().slice(0, 100);
  return family.length > 0 && /^[a-zA-Z0-9 ._-]+$/.test(family);
}

const safeFont = (value: unknown): string | undefined => {
  const family = typeof value === "string" ? value.trim().slice(0, 100) : "";
  return isSafeFontFamily(family) ? family : undefined;
};

const safeText = (value: unknown): string =>
  typeof value === "string" ? value.trim().slice(0, MAX_BRAND_TEXT_CHARS) : "";

const safeTone = (value: unknown): string =>
  typeof value === "string" && BRAND_TONES.has(value) ? value : "modern";

export function buildToolShareState(state: {
  selectedColor?: RGB;
  activeFontFamily?: string;
  brandKit?: ToolShareState["b"];
  paletteColors?: RGB[];
}): ToolShareState {
  const shared: ToolShareState = {};
  if (state.selectedColor) shared.c = state.selectedColor;
  if (state.activeFontFamily && safeFont(state.activeFontFamily)) shared.f = state.activeFontFamily;
  if (state.brandKit) shared.b = state.brandKit;
  if (state.paletteColors && state.paletteColors.length > 0)
    shared.p = state.paletteColors.slice(0, MAX_COLOR_LIST);
  return shared;
}

export function encodeToolShareState(shared: ToolShareState): URLSearchParams {
  const params = new URLSearchParams();
  if (shared.c) params.set("c", rgbToHex(shared.c));
  if (shared.f) params.set("f", shared.f);
  if (shared.b) {
    const b = shared.b;
    const packed = [
      b.brandName,
      b.tagline,
      rgbToHex(b.primaryColor),
      rgbToHex(b.secondaryColor),
      rgbToHex(b.accentColor),
      rgbToHex(b.backgroundColor),
      rgbToHex(b.textColor),
      b.headlineFont,
      b.bodyFont,
      b.monoFont,
      b.tone,
    ].join("~");
    params.set("b", btoa(unescape(encodeURIComponent(packed))));
  }
  if (shared.p && shared.p.length > 0)
    params.set("p", shared.p.map((rgb) => rgbToHex(rgb).slice(1)).join(","));
  return params;
}

/**
 * Decodes shared tool state with PARTIAL degradation: each parameter is
 * validated independently and invalid ones are dropped instead of failing the
 * whole link. Returns null only when nothing usable remains (or the legacy
 * token parameter is present — tokens were never shareable).
 */
export function decodeToolShareState(params: URLSearchParams): ToolShareState | null {
  const shared: ToolShareState = {};
  const hexParam = params.get("c");
  if (hexParam) {
    const parsed = hexToRgb(hexParam);
    if (parsed) shared.c = parsed;
  }

  const fontParam = params.get("f");
  if (fontParam) {
    const family = safeFont(fontParam);
    if (family) shared.f = family;
  }

  const tokensParam = params.get("t");
  if (tokensParam) return null;

  const brandParam = params.get("b");
  if (brandParam) {
    let packed: string;
    try {
      packed = decodeURIComponent(escape(atob(brandParam)));
    } catch {
      packed = "";
    }
    const parts = packed.split("~");
    if (parts.length === 11) {
      const colors = parts.slice(2, 7).map((hex) => hexToRgb(hex));
      if (!colors.some((color) => !color)) {
        shared.b = {
          brandName: safeText(parts[0]) || "Brand",
          tagline: safeText(parts[1]),
          primaryColor: colors[0] as RGB,
          secondaryColor: colors[1] as RGB,
          accentColor: colors[2] as RGB,
          backgroundColor: colors[3] as RGB,
          textColor: colors[4] as RGB,
          headlineFont: safeFont(parts[7]) ?? "Inter",
          bodyFont: safeFont(parts[8]) ?? "Inter",
          monoFont: safeFont(parts[9]) ?? "JetBrains Mono",
          tone: safeTone(parts[10]),
        };
      }
    }
  }

  const paletteParam = params.get("p");
  if (paletteParam) {
    const colors = paletteParam
      .split(",")
      .slice(0, MAX_COLOR_LIST)
      .map((hex) => hexToRgb(`#${hex.replace(/[^0-9a-fA-F]/g, "").slice(0, 6)}`));
    const valid = colors.filter((color): color is RGB => color !== null);
    if (valid.length > 0) shared.p = valid;
  }

  return Object.keys(shared).length > 0 ? shared : null;
}
