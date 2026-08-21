import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import { hexToRgb, rgbToHex, type RGB } from "../lib/color";
import { isSafeFontDataUrl, sanitizeFontFamily } from "../lib/font";

export type SavedColor = { id: string; rgb: RGB; name: string };

export type NamedPalette = { id: string; name: string; colors: SavedColor[] };

export type UploadedFont = {
  family: string;
  fileName: string;
  // base64 data URL — lets us re-register the font after a reload.
  data?: string;
};

export type SavedBrandKit = {
  id: string;
  name: string;
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
  tone: "modern" | "classic" | "playful" | "minimal" | "bold";
  logoDataUrl?: string;
  createdAt: number;
};

export type Theme = "dark" | "light";

type StudioState = {
  // Global navigation
  activeModule: "color" | "font";
  setActiveModule: (m: "color" | "font") => void;

  // Studio theme
  theme: Theme;
  setTheme: (t: Theme) => void;

  // Saved brand kits
  savedBrandKits: SavedBrandKit[];
  saveBrandKit: (kit: Omit<SavedBrandKit, "id" | "createdAt">) => void;
  loadBrandKit: (id: string) => SavedBrandKit | undefined;
  deleteBrandKit: (id: string) => void;
  renameBrandKit: (id: string, name: string) => void;

  // Saved palette library (named snapshots of savedColors)
  paletteLibrary: NamedPalette[];
  saveCurrentPaletteAs: (name: string) => void;
  loadPalette: (id: string) => void;
  renamePalette: (id: string, name: string) => void;
  deletePalette: (id: string) => void;

  // Shared selected color (drives font preview)
  selectedColor: RGB;
  selectedAlpha: number;
  setSelectedColor: (rgb: RGB) => void;
  setSelectedAlpha: (a: number) => void;

  // Recently picked colors (most recent first, capped)
  colorHistory: RGB[];
  pushColorHistory: (rgb: RGB) => void;

  // Saved palette (swatches the user pins)
  savedColors: SavedColor[];
  saveColor: (rgb: RGB, name?: string) => void;
  removeColor: (id: string) => void;

  // Uploaded fonts — persisted as base64 so they survive reloads.
  uploadedFonts: UploadedFont[];
  addUploadedFont: (f: UploadedFont) => void;

  // Currently active font for the font module
  activeFontFamily: string;
  setActiveFontFamily: (family: string) => void;
};

const HISTORY_CAP = 12;

const initialHex = "#6366F1";
const initialRgb = hexToRgb(initialHex) ?? { r: 99, g: 102, b: 241 };

let idCounter = 0;
const uid = () => `c${Date.now()}_${idCounter++}`;

const sameRgb = (a: RGB, b: RGB) => a.r === b.r && a.g === b.g && a.b === b.b;

export const STUDIO_LIMITS = {
  savedColors: 200,
  palettes: 50,
  brandKits: 25,
  uploadedFonts: 20,
} as const;
const MAX_SAVED_COLORS = STUDIO_LIMITS.savedColors;
const MAX_PALETTES = STUDIO_LIMITS.palettes;
const MAX_BRAND_KITS = STUDIO_LIMITS.brandKits;
const MAX_TEXT_LENGTH = 200;
const MAX_LOGO_DATA_URL_LENGTH = 3 * 1024 * 1024;
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
  typeof value === "string" ? value.trim().slice(0, MAX_TEXT_LENGTH) || fallback : fallback;

function sanitizeSavedColors(value: unknown): SavedColor[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .filter((color) => typeof color.id === "string" && isRgb(color.rgb))
    .slice(0, MAX_SAVED_COLORS)
    .map((color) => ({
      id: (color.id as string).slice(0, 100),
      rgb: color.rgb as RGB,
      name: safeText(color.name, rgbToHex(color.rgb as RGB)),
    }));
}

function isSafeLogoDataUrl(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= MAX_LOGO_DATA_URL_LENGTH &&
    /^data:image\/(?:png|jpeg|webp);base64,/i.test(value)
  );
}

export function sanitizePersistedStudioState(value: unknown): Partial<StudioState> {
  if (!isRecord(value)) return {};
  const sanitized: Partial<StudioState> = {};

  if (value.theme === "dark" || value.theme === "light") {
    sanitized.theme = value.theme;
  }

  if (Array.isArray(value.savedColors)) {
    sanitized.savedColors = sanitizeSavedColors(value.savedColors);
  }

  if (Array.isArray(value.paletteLibrary)) {
    sanitized.paletteLibrary = value.paletteLibrary
      .filter(isRecord)
      .filter((palette) => typeof palette.id === "string")
      .slice(0, MAX_PALETTES)
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
        fileName: (font.fileName as string).slice(0, MAX_TEXT_LENGTH),
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
      .slice(0, MAX_BRAND_KITS)
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

// localStorage wrapper that keeps the app usable when persistence is unavailable.
// Persisted font/logo binaries can exhaust the browser quota.
let storageErrorReported = false;
const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      // Keep the app running, but let the UI explain that changes are temporary.
      if (!storageErrorReported && typeof window !== "undefined") {
        storageErrorReported = true;
        window.dispatchEvent(new Event("cikp:storage-error"));
      }
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      /* noop */
    }
  },
};

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      activeModule: "color",
      setActiveModule: (m) => set({ activeModule: m }),

      selectedColor: initialRgb,
      selectedAlpha: 1,
      setSelectedColor: (rgb) => set({ selectedColor: rgb }),
      setSelectedAlpha: (a) => set({ selectedAlpha: Math.max(0, Math.min(1, a)) }),

      colorHistory: [],
      pushColorHistory: (rgb) =>
        set((s) =>
          s.colorHistory[0] && sameRgb(s.colorHistory[0], rgb)
            ? s
            : { colorHistory: [rgb, ...s.colorHistory].slice(0, HISTORY_CAP) },
        ),

      theme: "dark" as Theme,
      setTheme: (t) => set({ theme: t }),

      savedBrandKits: [],
      saveBrandKit: (kit) =>
        set((s) => {
          const id = `bk_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
          return {
            savedBrandKits: [
              ...s.savedBrandKits.slice(-(MAX_BRAND_KITS - 1)),
              { ...kit, id, createdAt: Date.now() },
            ],
          };
        }),
      loadBrandKit: (id) => {
        return get().savedBrandKits.find((k) => k.id === id);
      },
      deleteBrandKit: (id) =>
        set((s) => ({
          savedBrandKits: s.savedBrandKits.filter((k) => k.id !== id),
        })),
      renameBrandKit: (id, name) =>
        set((s) => ({
          savedBrandKits: s.savedBrandKits.map((k) =>
            k.id === id ? { ...k, name: name.trim() || k.name } : k,
          ),
        })),

      paletteLibrary: [],
      saveCurrentPaletteAs: (name) =>
        set((s) => {
          const trimmed = name.trim() || `Palet ${s.paletteLibrary.length + 1}`;
          return {
            paletteLibrary: [
              ...s.paletteLibrary.slice(-(MAX_PALETTES - 1)),
              {
                id: uid(),
                name: trimmed,
                colors: s.savedColors.map((c) => ({ ...c })),
              },
            ],
          };
        }),
      loadPalette: (id) =>
        set((s) => {
          const pal = s.paletteLibrary.find((p) => p.id === id);
          return pal ? { savedColors: pal.colors.map((c) => ({ ...c })) } : s;
        }),
      renamePalette: (id, name) =>
        set((s) => ({
          paletteLibrary: s.paletteLibrary.map((p) =>
            p.id === id ? { ...p, name: name.trim() || p.name } : p,
          ),
        })),
      deletePalette: (id) =>
        set((s) => ({
          paletteLibrary: s.paletteLibrary.filter((p) => p.id !== id),
        })),

      savedColors: [
        { id: uid(), name: "Indigo", rgb: { r: 99, g: 102, b: 241 } },
        { id: uid(), name: "Emerald", rgb: { r: 16, g: 185, b: 129 } },
        { id: uid(), name: "Rose", rgb: { r: 244, g: 63, b: 94 } },
      ],
      saveColor: (rgb, name) =>
        set((s) => ({
          savedColors: [
            ...s.savedColors.slice(-(MAX_SAVED_COLORS - 1)),
            { id: uid(), rgb, name: name ?? rgbToHex(rgb) },
          ],
        })),
      removeColor: (id) => set((s) => ({ savedColors: s.savedColors.filter((c) => c.id !== id) })),

      uploadedFonts: [],
      addUploadedFont: (f) =>
        set((s) =>
          s.uploadedFonts.some((u) => u.family === f.family)
            ? s
            : { uploadedFonts: [...s.uploadedFonts.slice(-(STUDIO_LIMITS.uploadedFonts - 1)), f] },
        ),

      activeFontFamily: "Inter",
      setActiveFontFamily: (family) => set({ activeFontFamily: family }),
    }),
    {
      name: "cikp-studio",
      storage: createJSONStorage(() => safeStorage),
      // Accept only validated fields from persisted/tampered legacy data.
      merge: (persisted, current) => ({
        ...current,
        ...sanitizePersistedStudioState(persisted),
      }),
      partialize: (s) => ({
        savedColors: s.savedColors,
        uploadedFonts: s.uploadedFonts,
        paletteLibrary: s.paletteLibrary,
        savedBrandKits: s.savedBrandKits,
        theme: s.theme,
      }),
    },
  ),
);
