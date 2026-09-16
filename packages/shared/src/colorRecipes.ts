import { mixColors, rgbToCmyk, rgbToHex, type RGB } from "./color";

export type ColorRecipeMode = "additive" | "subtractive";
export type ColorRecipeQuality = "exact" | "very-close" | "close" | "different" | "far";

export const COLOR_RECIPE_QUALITY_LABELS: Record<ColorRecipeQuality, string> = {
  exact: "Tepat",
  "very-close": "Sangat dekat",
  close: "Mendekati",
  different: "Berbeda",
  far: "Berbeda jauh",
};

export type ColorRecipeIngredient = {
  name: string;
  color: RGB;
  ratio: number;
};

export type ColorRecipe = {
  ingredients: ColorRecipeIngredient[];
  result: RGB;
  resultHex: string;
  similarity: number;
  /** Perceptual OKLab distance scaled to a Delta-E-like 0–100 range. */
  distance: number;
  quality: ColorRecipeQuality;
  measurement: "intensity" | "coverage";
};

type RecipeSource = { name: string; color: RGB };

const RGB_SOURCES: readonly RecipeSource[] = [
  { name: "Merah", color: { r: 255, g: 0, b: 0 } },
  { name: "Hijau", color: { r: 0, g: 255, b: 0 } },
  { name: "Biru", color: { r: 0, g: 0, b: 255 } },
];

const CMYK_SOURCES = {
  c: { name: "Cyan", color: { r: 0, g: 255, b: 255 } },
  m: { name: "Magenta", color: { r: 255, g: 0, b: 255 } },
  y: { name: "Kuning", color: { r: 255, g: 255, b: 0 } },
  k: { name: "Hitam", color: { r: 0, g: 0, b: 0 } },
} as const satisfies Record<string, RecipeSource>;

type OKLab = { l: number; a: number; b: number };

function srgbChannelToLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function rgbToOKLab(color: RGB): OKLab {
  const r = srgbChannelToLinear(color.r);
  const g = srgbChannelToLinear(color.g);
  const b = srgbChannelToLinear(color.b);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  return {
    l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

function perceptualColorDistance(first: RGB, second: RGB): number {
  const a = rgbToOKLab(first);
  const b = rgbToOKLab(second);
  return Math.sqrt((a.l - b.l) ** 2 + (a.a - b.a) ** 2 + (a.b - b.b) ** 2) * 100;
}

function scoreRecipe(
  target: RGB,
  result: RGB,
  distance: number,
): Pick<ColorRecipe, "similarity" | "quality"> {
  const exact = target.r === result.r && target.g === result.g && target.b === result.b;
  const calibratedSimilarity = Math.max(0, Math.round(100 - distance * 2));
  const similarity = exact ? 100 : Math.min(99, calibratedSimilarity);
  const quality: ColorRecipeQuality = exact
    ? "exact"
    : similarity >= 95
      ? "very-close"
      : similarity >= 85
        ? "close"
        : similarity >= 70
          ? "different"
          : "far";

  return {
    similarity,
    quality,
  };
}

function clampPercentage(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export function evaluateColorRecipe(
  target: RGB,
  ingredients: ColorRecipeIngredient[],
  measurement: ColorRecipe["measurement"],
): ColorRecipe {
  const safeIngredients = ingredients.map((ingredient) => ({
    ...ingredient,
    ratio: clampPercentage(ingredient.ratio),
  }));
  const result = mixColors(
    safeIngredients.map((ingredient) => ({
      color: ingredient.color,
      weight: ingredient.ratio / 20,
    })),
    measurement === "intensity" ? "additive" : "subtractive",
  );
  const distance = perceptualColorDistance(result, target);

  return {
    ingredients: safeIngredients,
    result,
    resultHex: rgbToHex(result),
    distance: Number(distance.toFixed(2)),
    ...scoreRecipe(target, result, distance),
    measurement,
  };
}

/**
 * Derives independent RGB light intensities or an idealized CMYK ink-coverage recipe.
 */
export function findColorRecipes(target: RGB, mode: ColorRecipeMode, limit = 5): ColorRecipe[] {
  if (mode === "subtractive") {
    const cmyk = rgbToCmyk(target);
    const ingredients: ColorRecipeIngredient[] = (
      Object.keys(CMYK_SOURCES) as Array<keyof typeof CMYK_SOURCES>
    )
      .map((channel) => ({ ...CMYK_SOURCES[channel], ratio: cmyk[channel] }))
      .filter((ingredient) => ingredient.ratio > 0);
    if (ingredients.length === 0) {
      ingredients.push({ name: "Putih dasar", color: { r: 255, g: 255, b: 255 }, ratio: 0 });
    }
    return [evaluateColorRecipe(target, ingredients, "coverage")];
  }

  const channels = [target.r, target.g, target.b];
  const ingredients = RGB_SOURCES.map((source, index) => ({
    ...source,
    ratio: Math.round((channels[index] / 255) * 10_000) / 100,
  })).filter((ingredient) => ingredient.ratio > 0);

  if (ingredients.length === 0) {
    ingredients.push({ name: "Tanpa cahaya", color: { r: 0, g: 0, b: 0 }, ratio: 0 });
  }

  const recipe = evaluateColorRecipe(target, ingredients, "intensity");

  return [recipe].slice(0, Math.max(1, limit));
}
