import { GOOGLE_FONTS_CATALOG, GOOGLE_FONTS_CATALOG_META } from "../data/googleFonts.generated";
import { FONT_WEIGHTS, type FontCategory } from "./font";

export type FontStyle = "normal" | "italic";

export type FontDef = {
  family: string;
  category: FontCategory;
  weights: number[];
  styles: FontStyle[];
  styleWeights: Record<FontStyle, number[]>;
  subsets: string[];
  lastModified?: string;
  variableWeight?: { min: number; max: number };
};

export const GOOGLE_FONTS: FontDef[] = GOOGLE_FONTS_CATALOG.map((font) => {
  const generated = font as typeof font & {
    lastModified?: string;
    variableWeight?: { min: number; max: number };
    styleWeights?: {
      readonly normal?: readonly number[];
      readonly italic?: readonly number[];
    };
  };
  const variableWeights = generated.variableWeight
    ? FONT_WEIGHTS.filter(
        (weight) =>
          weight >= generated.variableWeight!.min && weight <= generated.variableWeight!.max,
      )
    : [];
  const styles = [...generated.styles] as FontStyle[];
  const normalWeights = [
    ...(generated.styleWeights?.normal ?? []),
    ...(styles.includes("normal") ? variableWeights : []),
  ];
  const italicWeights = [
    ...(generated.styleWeights?.italic ?? []),
    ...(styles.includes("italic") ? variableWeights : []),
  ];
  const weights = [...new Set([...generated.weights, ...normalWeights, ...italicWeights])].sort(
    (a, b) => a - b,
  );
  return {
    family: generated.family,
    category: generated.category,
    weights,
    styles,
    styleWeights: {
      normal: [...new Set(normalWeights)].sort((a, b) => a - b),
      italic: [...new Set(italicWeights)].sort((a, b) => a - b),
    },
    subsets: [...generated.subsets],
    ...(generated.lastModified ? { lastModified: generated.lastModified } : {}),
    ...(generated.variableWeight
      ? {
          variableWeight: {
            min: generated.variableWeight.min,
            max: generated.variableWeight.max,
          },
        }
      : {}),
  };
});

export const GOOGLE_FONTS_META: {
  source: "curated-fallback" | "google-fonts-developer-api";
  generatedAt: string | null;
  limit: number;
} = GOOGLE_FONTS_CATALOG_META;
export const FILTER_FONT_PAGE_SIZE = 40;

export function findGoogleFont(family: string): FontDef | undefined {
  return GOOGLE_FONTS.find((font) => font.family === family);
}

export function filterGoogleFonts(
  fonts: FontDef[],
  options: { category: FontCategory | "all"; search: string; style: FontStyle | "all" },
): FontDef[] {
  const query = options.search.trim().toLocaleLowerCase();
  return fonts.filter((font) => {
    if (options.category !== "all" && font.category !== options.category) return false;
    if (options.style !== "all" && !font.styles.includes(options.style)) return false;
    return query.length === 0 || font.family.toLocaleLowerCase().includes(query);
  });
}

export function nearestFontWeight(weights: number[], requested: number): number {
  if (weights.length === 0) return 400;
  return [...weights].sort((a, b) => Math.abs(a - requested) - Math.abs(b - requested))[0];
}
