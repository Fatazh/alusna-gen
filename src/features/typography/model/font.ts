// Font utilities: family sanitization, local upload validation, and CSS stacks.

export type FontCategory = "serif" | "sans-serif" | "display" | "handwriting" | "monospace";

// Font family names are embedded into CSS `font-family` strings, so they must
// be restricted to a safe character set. This guards against CSS injection via
// crafted file names or tampered localStorage values.
const SAFE_FAMILY_CHARS = /[^a-zA-Z0-9 _-]/g;

/** Strip unsafe characters from a font family name (used for CSS embedding). */
export function sanitizeFontFamily(name: string): string {
  const cleaned = name.replace(SAFE_FAMILY_CHARS, "").trim();
  return cleaned || "Uploaded Font";
}

// Persisted fonts are re-registered from their base64 data URL on reload.
// FontFace also accepts a plain URL as source, so a tampered localStorage
// value could otherwise make the browser fetch an arbitrary URL. Only `data:`
// URLs are accepted here, and oversized values are dropped (the ~5MB upload
// limit grows to ~6.7MB once base64-encoded).
const MAX_FONT_DATA_URL_LENGTH = 8 * 1024 * 1024;

export function isSafeFontDataUrl(data: unknown): data is string {
  if (typeof data !== "string" || data.length === 0) return false;
  if (data.length > MAX_FONT_DATA_URL_LENGTH) return false;
  return data.startsWith("data:") && data.includes(";base64,");
}

export function fontStack(family: string, category?: FontCategory): string {
  const fallback =
    category === "serif"
      ? "Georgia, serif"
      : category === "monospace"
        ? "Menlo, Monaco, monospace"
        : category === "handwriting" || category === "display"
          ? "cursive, sans-serif"
          : "system-ui, sans-serif";
  return `'${family}', ${fallback}`;
}

export const FONT_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
