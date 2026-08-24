import { describe, expect, it } from "vitest";
import { findColorRecipes } from "./colorRecipes";

describe("findColorRecipes", () => {
  it("finds red and green light as an exact yellow recipe", () => {
    const [recipe] = findColorRecipes({ r: 255, g: 255, b: 0 }, "additive", 1);

    expect(recipe.ingredients.map((ingredient) => ingredient.name)).toEqual(["Merah", "Hijau"]);
    expect(recipe.ingredients.map((ingredient) => ingredient.ratio)).toEqual([50, 50]);
    expect(recipe.resultHex).toBe("#FFFF00");
    expect(recipe.similarity).toBe(100);
    expect(recipe.quality).toBe("exact");
  });

  it("finds magenta and yellow pigment as an exact red recipe", () => {
    const [recipe] = findColorRecipes({ r: 255, g: 0, b: 0 }, "subtractive", 1);

    expect(recipe.ingredients.map((ingredient) => ingredient.name)).toEqual(["Magenta", "Kuning"]);
    expect(recipe.resultHex).toBe("#FF0000");
    expect(recipe.similarity).toBe(100);
  });

  it("does not return the target itself as an ingredient", () => {
    const recipes = findColorRecipes({ r: 255, g: 255, b: 0 }, "subtractive", 4);

    expect(
      recipes.flatMap((recipe) => recipe.ingredients).map((ingredient) => ingredient.name),
    ).not.toContain("Kuning");
  });

  it("returns one ranked recipe per pair and respects the requested limit", () => {
    const recipes = findColorRecipes({ r: 120, g: 80, b: 200 }, "additive", 3);

    expect(recipes).toHaveLength(3);
    expect(recipes[0].distance).toBeLessThanOrEqual(recipes[1].distance);
    expect(recipes[1].distance).toBeLessThanOrEqual(recipes[2].distance);
    expect(
      new Set(recipes.map((recipe) => recipe.ingredients.map(({ name }) => name).join("+"))).size,
    ).toBe(3);
  });
});
