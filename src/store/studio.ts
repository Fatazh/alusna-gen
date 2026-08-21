import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { hexToRgb, rgbToHex, type RGB } from "../lib/color";
import {
  ALUSNA_STUDIO_STORAGE_KEY,
  ALUSNA_STUDIO_STORAGE_VERSION,
} from "./migrations/studioStorage";
import { sanitizePersistedStudioState } from "./persistence/sanitizeStudioState";
import { studioStateStorage } from "./persistence/studioStateStorage";
import { STUDIO_LIMITS } from "./studio.constants";
import { type StudioState, type Theme } from "./studio.types";

export { sanitizePersistedStudioState } from "./persistence/sanitizeStudioState";
export { STUDIO_LIMITS } from "./studio.constants";
export type { NamedPalette, SavedBrandKit, SavedColor, Theme, UploadedFont } from "./studio.types";

const HISTORY_CAP = 12;

const initialHex = "#6366F1";
const initialRgb = hexToRgb(initialHex) ?? { r: 99, g: 102, b: 241 };

let idCounter = 0;
const uid = () => `c${Date.now()}_${idCounter++}`;

const sameRgb = (a: RGB, b: RGB) => a.r === b.r && a.g === b.g && a.b === b.b;

const MAX_SAVED_COLORS = STUDIO_LIMITS.savedColors;
const MAX_PALETTES = STUDIO_LIMITS.palettes;
const MAX_BRAND_KITS = STUDIO_LIMITS.brandKits;

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
      name: ALUSNA_STUDIO_STORAGE_KEY,
      version: ALUSNA_STUDIO_STORAGE_VERSION,
      storage: createJSONStorage(() => studioStateStorage),
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
