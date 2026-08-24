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
  measurement: "ratio" | "coverage";
};

type RecipeSource = { name: string; color: RGB };

const ADDITIVE_SOURCES: readonly RecipeSource[] = [
  { name: "Merah", color: { r: 255, g: 0, b: 0 } },
  { name: "Hijau", color: { r: 0, g: 255, b: 0 } },
  { name: "Biru", color: { r: 0, g: 0, b: 255 } },
  { name: "Cyan", color: { r: 0, g: 255, b: 255 } },
  { name: "Magenta", color: { r: 255, g: 0, b: 255 } },
  { name: "Putih", color: { r: 255, g: 255, b: 255 } },
  { name: "Oranye", color: { r: 255, g: 128, b: 0 } },
  { name: "Ungu", color: { r: 128, g: 0, b: 255 } },
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
 * Finds two-light additive recipes or derives an idealized CMYK ink-coverage recipe.
 * Additive results retain only the best ratio per pair so adjacent ratios do not crowd the list.
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

  const sources = ADDITIVE_SOURCES.filter((source) => colorDistance(source.color, target) > 12);
  const recipes: ColorRecipe[] = [];

  for (let firstIndex = 0; firstIndex < sources.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < sources.length; secondIndex += 1) {
      const first = sources[firstIndex];
      const second = sources[secondIndex];
      let best: ColorRecipe | null = null;

      for (let firstRatio = 10; firstRatio <= 90; firstRatio += 5) {
        const secondRatio = 100 - firstRatio;
        const result = mixColors(
          [
            { color: first.color, weight: firstRatio },
            { color: second.color, weight: secondRatio },
          ],
          mode,
        );
        const distance = colorDistance(result, target);
        const score = scoreRecipe(distance);
        const candidate: ColorRecipe = {
          ingredients: [
            { ...first, ratio: firstRatio },
            { ...second, ratio: secondRatio },
          ],
          result,
          resultHex: rgbToHex(result),
          distance: Number(distance.toFixed(2)),
          ...score,
          measurement: "ratio",
        };

        if (!best || candidate.distance < best.distance) best = candidate;
      }

      if (best) recipes.push(best);
    }
  }

  return recipes
    .sort((a, b) => a.distance - b.distance || b.similarity - a.similarity)
    .slice(0, Math.max(1, limit));
}
