import { type RGB } from "../features/color/domain";

export type SavedColor = { id: string; rgb: RGB; name: string };

export type NamedPalette = { id: string; name: string; colors: SavedColor[] };

export type UploadedFont = {
  family: string;
  fileName: string;
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

export type StudioState = {
  activeModule: "color" | "font";
  setActiveModule: (module: "color" | "font") => void;

  theme: Theme;
  setTheme: (theme: Theme) => void;

  savedBrandKits: SavedBrandKit[];
  saveBrandKit: (kit: Omit<SavedBrandKit, "id" | "createdAt">) => void;
  loadBrandKit: (id: string) => SavedBrandKit | undefined;
  deleteBrandKit: (id: string) => void;
  renameBrandKit: (id: string, name: string) => void;

  paletteLibrary: NamedPalette[];
  saveCurrentPaletteAs: (name: string) => void;
  loadPalette: (id: string) => void;
  renamePalette: (id: string, name: string) => void;
  deletePalette: (id: string) => void;

  selectedColor: RGB;
  selectedAlpha: number;
  setSelectedColor: (rgb: RGB) => void;
  setSelectedAlpha: (alpha: number) => void;

  colorHistory: RGB[];
  pushColorHistory: (rgb: RGB) => void;

  savedColors: SavedColor[];
  saveColor: (rgb: RGB, name?: string) => void;
  removeColor: (id: string) => void;

  uploadedFonts: UploadedFont[];
  addUploadedFont: (font: UploadedFont) => void;

  activeFontFamily: string;
  setActiveFontFamily: (family: string) => void;
};
