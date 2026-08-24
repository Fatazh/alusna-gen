import { mixColors, rgbToCmyk, rgbToHex, type RGB } from "./color";

export type ColorRecipeMode = "additive" | "subtractive";

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
  distance: number;
  quality: "exact" | "close" | "approximation";
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

const MAX_RGB_DISTANCE = Math.sqrt(3 * 255 ** 2);

function colorDistance(a: RGB, b: RGB): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

function scoreRecipe(distance: number): Pick<ColorRecipe, "similarity" | "quality"> {
  const roundedSimilarity = Math.max(0, Math.round((1 - distance / MAX_RGB_DISTANCE) * 100));
  const exact = distance < 0.5;
  const similarity = exact ? 100 : Math.min(99, roundedSimilarity);
  return {
    similarity,
    quality: exact ? "exact" : similarity >= 90 ? "close" : "approximation",
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
    const result = mixColors(
      ingredients.map((ingredient) => ({
        color: ingredient.color,
        weight: ingredient.ratio / 20,
      })),
      "subtractive",
    );
    const distance = colorDistance(result, target);

    return [
      {
        ingredients,
        result,
        resultHex: rgbToHex(result),
        distance: Number(distance.toFixed(2)),
        ...scoreRecipe(distance),
        measurement: "coverage",
      },
    ];
  }

  const channels = [target.r, target.g, target.b];
  const ingredients = RGB_SOURCES.map((source, index) => ({
    ...source,
    ratio: Math.round((channels[index] / 255) * 100),
  })).filter((ingredient) => ingredient.ratio > 0);

  if (ingredients.length === 0) {
    ingredients.push({ name: "Tanpa cahaya", color: { r: 0, g: 0, b: 0 }, ratio: 0 });
  }

  const result = mixColors(
    ingredients.map((ingredient) => ({
      color: ingredient.color,
      weight: ingredient.ratio / 20,
    })),
    "additive",
  );
  const distance = colorDistance(result, target);

  const recipe: ColorRecipe = {
    ingredients,
    result,
    resultHex: rgbToHex(result),
    distance: Number(distance.toFixed(2)),
    ...scoreRecipe(distance),
    measurement: "intensity",
  };

  return [recipe].slice(0, Math.max(1, limit));
}
