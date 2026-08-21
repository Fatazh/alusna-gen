import { beforeEach, describe, expect, it } from "vitest";
import { sanitizePersistedStudioState } from "./persistence/sanitizeStudioState";
import { STUDIO_LIMITS } from "./studio.constants";
import { useStudio } from "./studio";

const rgb = { r: 10, g: 20, b: 30 };

function validBrandKit() {
  return {
    id: "kit-1",
    name: "  Example Kit  ",
    brandName: "  Example  ",
    tagline: "  Build clearly  ",
    primaryColor: rgb,
    secondaryColor: rgb,
    accentColor: rgb,
    backgroundColor: rgb,
    textColor: rgb,
    headlineFont: "Playfair Display",
    bodyFont: "Inter",
    monoFont: "Fira Code",
    tone: "modern" as const,
    createdAt: 123,
  };
}

describe("sanitizePersistedStudioState", () => {
  it("accepts and normalizes valid persisted fields", () => {
    const result = sanitizePersistedStudioState({
      theme: "light",
      savedColors: [{ id: "color-1", name: "  Ink  ", rgb }],
      paletteLibrary: [
        {
          id: "palette-1",
          name: "  Core  ",
          colors: [{ id: "color-1", name: "Ink", rgb }],
        },
      ],
      uploadedFonts: [
        {
          family: "Unsafe'; Font",
          fileName: "font.woff2",
          data: "data:font/woff2;base64,AAEAAA",
        },
      ],
      savedBrandKits: [validBrandKit()],
    });

    expect(result.theme).toBe("light");
    expect(result.savedColors).toEqual([{ id: "color-1", name: "Ink", rgb }]);
    expect(result.paletteLibrary?.[0].name).toBe("Core");
    expect(result.uploadedFonts?.[0].family).toBe("Unsafe Font");
    expect(result.savedBrandKits?.[0]).toMatchObject({
      name: "Example Kit",
      brandName: "Example",
      tagline: "Build clearly",
      tone: "modern",
    });
  });

  it("drops malformed and unsafe entries", () => {
    const result = sanitizePersistedStudioState({
      theme: "system",
      activeModule: "admin",
      savedColors: [{ id: "bad", name: "Bad", rgb: { r: 999, g: 0, b: 0 } }, null],
      uploadedFonts: [
        {
          family: "Remote",
          fileName: "remote.woff2",
          data: "https://example.com/font.woff2",
        },
      ],
      savedBrandKits: [
        { ...validBrandKit(), tone: "unknown" },
        {
          ...validBrandKit(),
          logoDataUrl: "data:image/svg+xml;base64,PHN2Zz4=",
        },
      ],
    });

    expect(result.theme).toBeUndefined();
    expect(result).not.toHaveProperty("activeModule");
    expect(result.savedColors).toEqual([]);
    expect(result.uploadedFonts).toEqual([]);
    expect(result.savedBrandKits).toEqual([]);
  });

  it("returns an empty object for non-object state", () => {
    expect(sanitizePersistedStudioState(null)).toEqual({});
    expect(sanitizePersistedStudioState("invalid")).toEqual({});
  });
});

describe("studio storage limits", () => {
  beforeEach(() => {
    useStudio.setState({
      savedColors: [],
      paletteLibrary: [],
      savedBrandKits: [],
      uploadedFonts: [],
    });
  });

  it("caps new saved colors, palettes, brand kits, and uploaded fonts", () => {
    const { id: _id, createdAt: _createdAt, ...brandKit } = validBrandKit();
    for (let index = 0; index < STUDIO_LIMITS.savedColors + 1; index += 1) {
      useStudio.getState().saveColor({ r: index % 256, g: 0, b: 0 });
    }
    for (let index = 0; index < STUDIO_LIMITS.palettes + 1; index += 1) {
      useStudio.getState().saveCurrentPaletteAs(`Palette ${index}`);
    }
    for (let index = 0; index < STUDIO_LIMITS.brandKits + 1; index += 1) {
      useStudio.getState().saveBrandKit({
        ...brandKit,
        name: `Kit ${index}`,
      });
    }
    for (let index = 0; index < STUDIO_LIMITS.uploadedFonts + 1; index += 1) {
      useStudio
        .getState()
        .addUploadedFont({ family: `Font ${index}`, fileName: `font-${index}.woff2` });
    }

    const state = useStudio.getState();
    expect(state.savedColors).toHaveLength(STUDIO_LIMITS.savedColors);
    expect(state.paletteLibrary).toHaveLength(STUDIO_LIMITS.palettes);
    expect(state.savedBrandKits).toHaveLength(STUDIO_LIMITS.brandKits);
    expect(state.uploadedFonts).toHaveLength(STUDIO_LIMITS.uploadedFonts);
  });
});
