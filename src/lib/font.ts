// Font utilities: Google Fonts catalog, loader, font file parsing.

export type FontCategory =
  | "serif"
  | "sans-serif"
  | "display"
  | "handwriting"
  | "monospace";

export type FontDef = {
  family: string;
  category: FontCategory;
  variants: string[];
};

// A curated subset of popular Google Fonts (kept local to avoid network dependency at startup).
export const GOOGLE_FONTS: FontDef[] = [
  {
    family: "Inter",
    category: "sans-serif",
    variants: ["400", "500", "600", "700"],
  },
  {
    family: "Roboto",
    category: "sans-serif",
    variants: ["300", "400", "500", "700"],
  },
  {
    family: "Open Sans",
    category: "sans-serif",
    variants: ["400", "600", "700"],
  },
  { family: "Lato", category: "sans-serif", variants: ["400", "700"] },
  {
    family: "Montserrat",
    category: "sans-serif",
    variants: ["400", "600", "700"],
  },
  {
    family: "Poppins",
    category: "sans-serif",
    variants: ["400", "500", "600", "700"],
  },
  { family: "Nunito", category: "sans-serif", variants: ["400", "600", "700"] },
  {
    family: "Raleway",
    category: "sans-serif",
    variants: ["400", "600", "700"],
  },
  {
    family: "Work Sans",
    category: "sans-serif",
    variants: ["400", "600", "700"],
  },
  {
    family: "Source Sans 3",
    category: "sans-serif",
    variants: ["400", "600", "700"],
  },
  {
    family: "Playfair Display",
    category: "serif",
    variants: ["400", "600", "700"],
  },
  { family: "Merriweather", category: "serif", variants: ["400", "700"] },
  { family: "Lora", category: "serif", variants: ["400", "600", "700"] },
  {
    family: "Crimson Text",
    category: "serif",
    variants: ["400", "600", "700"],
  },
  { family: "EB Garamond", category: "serif", variants: ["400", "600", "700"] },
  { family: "PT Serif", category: "serif", variants: ["400", "700"] },
  { family: "Bebas Neue", category: "display", variants: ["400"] },
  { family: "Oswald", category: "display", variants: ["400", "600", "700"] },
  { family: "Anton", category: "display", variants: ["400"] },
  { family: "Archivo Black", category: "display", variants: ["400"] },
  { family: "Righteous", category: "display", variants: ["400"] },
  { family: "Pacifico", category: "handwriting", variants: ["400"] },
  {
    family: "Dancing Script",
    category: "handwriting",
    variants: ["400", "700"],
  },
  { family: "Caveat", category: "handwriting", variants: ["400", "700"] },
  { family: "Sacramento", category: "handwriting", variants: ["400"] },
  { family: "JetBrains Mono", category: "monospace", variants: ["400", "700"] },
  { family: "Fira Code", category: "monospace", variants: ["400", "700"] },
  {
    family: "Source Code Pro",
    category: "monospace",
    variants: ["400", "700"],
  },
  { family: "Space Mono", category: "monospace", variants: ["400", "700"] },
  { family: "IBM Plex Mono", category: "monospace", variants: ["400", "700"] },
];

// Font family names are embedded into CSS `font-family` strings, so they must
// be restricted to a safe character set. This guards against CSS injection via
// crafted file names or tampered localStorage values.
const SAFE_FAMILY_CHARS = /[^a-zA-Z0-9 _-]/g;

/** Strip unsafe characters from a font family name (used for CSS embedding). */
export function sanitizeFontFamily(name: string): string {
  const cleaned = name.replace(SAFE_FAMILY_CHARS, "").trim();
  return cleaned || "Uploaded Font";
}

const loadedFamilies = new Set<string>();

export function loadGoogleFont(
  family: string,
  variants: string[] = ["400"],
): void {
  if (loadedFamilies.has(family)) return;
  const params = new URLSearchParams({
    family: `${family}:wght@${variants.map((v) => v).join(";")}`,
  });
  const href = `https://fonts.googleapis.com/css2?${params.toString()}`;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
  loadedFamilies.add(family);
}

// Load an uploaded font file (ttf/otf/woff/woff2) and register it via the FontFace API.
// Note: FontFace with an ArrayBuffer does not require an explicit format hint.
export async function loadUploadedFont(file: File): Promise<{ family: string; dataUrl: string }> {
  const buffer = await file.arrayBuffer();
  const family = sanitizeFontFamily(
    file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "),
  );
  const face = new FontFace(family, buffer);
  await face.load();
  (document.fonts as FontFaceSet).add(face);
  const dataUrl = await fileToDataUrl(file);
  return { family, dataUrl };
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

// Re-register a previously persisted font from its base64 data URL.
export async function restoreUploadedFont(dataUrl: string, family: string): Promise<void> {
  if (!isSafeFontDataUrl(dataUrl)) return;
  const face = new FontFace(family, dataUrl);
  await face.load();
  (document.fonts as FontFaceSet).add(face);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
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

export const FONT_WEIGHTS = [300, 400, 500, 600, 700, 800, 900] as const;
