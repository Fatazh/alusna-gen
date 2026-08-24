import { mixColors, rgbToHex, type RGB } from "./color";

export type ColorRecipeMode = "additive" | "subtractive";

export type ColorRecipeIngredient = {
  name: string;
  color: RGB;
  ratio: number;
};

export type ColorRecipe = {
  ingredients: [ColorRecipeIngredient, ColorRecipeIngredient];
  result: RGB;
  resultHex: string;
  similarity: number;
  distance: number;
  quality: "exact" | "close" | "approximation";
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

const SUBTRACTIVE_SOURCES: readonly RecipeSource[] = [
  { name: "Cyan", color: { r: 0, g: 255, b: 255 } },
  { name: "Magenta", color: { r: 255, g: 0, b: 255 } },
  { name: "Kuning", color: { r: 255, g: 255, b: 0 } },
  { name: "Hitam", color: { r: 0, g: 0, b: 0 } },
  { name: "Putih", color: { r: 255, g: 255, b: 255 } },
  { name: "Merah", color: { r: 255, g: 0, b: 0 } },
  { name: "Hijau", color: { r: 0, g: 255, b: 0 } },
  { name: "Biru", color: { r: 0, g: 0, b: 255 } },
];

const MAX_RGB_DISTANCE = Math.sqrt(3 * 255 ** 2);

function colorDistance(a: RGB, b: RGB): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

function scoreRecipe(distance: number): Pick<ColorRecipe, "similarity" | "quality"> {
  const similarity = Math.max(0, Math.round((1 - distance / MAX_RGB_DISTANCE) * 100));
  return {
    similarity,
    quality: similarity >= 99 ? "exact" : similarity >= 90 ? "close" : "approximation",
  };
}

/**
 * Finds two-color recipes from a small, explicit set of light or pigment primaries.
 * One best ratio is retained per pair so adjacent ratios do not crowd the result list.
 */
export function findColorRecipes(target: RGB, mode: ColorRecipeMode, limit = 5): ColorRecipe[] {
  const sources = (mode === "additive" ? ADDITIVE_SOURCES : SUBTRACTIVE_SOURCES).filter(
    (source) => colorDistance(source.color, target) > 12,
  );
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
