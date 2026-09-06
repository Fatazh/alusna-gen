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

export type FontPairing = {
  heading: string;
  body: string;
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

const PAIRING_HEADINGS = [
  "Playfair Display",
  "Oswald",
  "Lora",
  "Bebas Neue",
  "Merriweather",
  "Montserrat",
];

const PAIRING_BODIES = [
  "Inter",
  "Open Sans",
  "Source Sans 3",
  "Roboto",
  "Lato",
  "Merriweather Sans",
];

export function findGoogleFont(family: string): FontDef | undefined {
  return GOOGLE_FONTS.find((font) => font.family === family);
}

/**
 * Suggests pairings around the currently selected family.
 *
 * Display/serif/handwriting families are treated as headings and receive a
 * readable sans-serif body. Other families (including uploaded fonts without
 * catalog metadata) are treated as body text and receive a curated heading.
 */
export function suggestFontPairings(
  activeFamily: string,
  fonts: FontDef[] = GOOGLE_FONTS,
): FontPairing[] {
  const family = activeFamily.trim();
  if (!family) return [];

  const available = new Set(fonts.map((font) => font.family));
  const activeDefinition = fonts.find((font) => font.family === family);
  const activeIsHeading = Boolean(
    activeDefinition && ["serif", "display", "handwriting"].includes(activeDefinition.category),
  );
  const preferred = activeIsHeading ? PAIRING_BODIES : PAIRING_HEADINGS;
  const fallbackCategories = activeIsHeading
    ? new Set<FontCategory>(["sans-serif", "monospace"])
    : new Set<FontCategory>(["serif", "display"]);

  const candidates = [
    ...preferred.filter((candidate) => available.has(candidate)),
    ...fonts
      .filter(
        (font) =>
          font.family !== family &&
          fallbackCategories.has(font.category) &&
          !preferred.includes(font.family),
      )
      .map((font) => font.family),
  ].filter((candidate, index, list) => candidate !== family && list.indexOf(candidate) === index);

  return candidates
    .slice(0, 3)
    .map((candidate) =>
      activeIsHeading ? { heading: family, body: candidate } : { heading: candidate, body: family },
    );
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
