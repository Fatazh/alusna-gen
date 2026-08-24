import { describe, expect, it } from "vitest";
import { evaluateColorRecipe, findColorRecipes } from "./colorRecipes";

describe("findColorRecipes", () => {
  it("finds red and green light as an exact yellow recipe", () => {
    const [recipe] = findColorRecipes({ r: 255, g: 255, b: 0 }, "additive", 1);

    expect(recipe.ingredients.map((ingredient) => ingredient.name)).toEqual(["Merah", "Hijau"]);
    expect(recipe.ingredients.map((ingredient) => ingredient.ratio)).toEqual([100, 100]);
    expect(recipe.resultHex).toBe("#FFFF00");
    expect(recipe.similarity).toBe(100);
    expect(recipe.quality).toBe("exact");
    expect(recipe.measurement).toBe("intensity");
  });

  it("derives independent RGB intensities for an almost pure blue target", () => {
    const [recipe] = findColorRecipes({ r: 0, g: 8, b: 255 }, "additive", 4);

    expect(recipe.ingredients.map(({ name, ratio }) => ({ name, ratio }))).toEqual([
      { name: "Hijau", ratio: 3.14 },
      { name: "Biru", ratio: 100 },
    ]);
    expect(recipe.resultHex).toBe("#0008FF");
    expect(recipe.similarity).toBe(100);
  });

  it("uses all required RGB channels without forcing them to total 100%", () => {
    const [recipe] = findColorRecipes({ r: 12, g: 123, b: 192 }, "additive", 4);

    expect(recipe.ingredients.map(({ name, ratio }) => ({ name, ratio }))).toEqual([
      { name: "Merah", ratio: 4.71 },
      { name: "Hijau", ratio: 48.24 },
      { name: "Biru", ratio: 75.29 },
    ]);
    expect(recipe.resultHex).toBe("#0C7BC0");
    expect(recipe.similarity).toBe(100);
  });

  it("finds magenta and yellow pigment as an exact red recipe", () => {
    const [recipe] = findColorRecipes({ r: 255, g: 0, b: 0 }, "subtractive", 1);

    expect(recipe.ingredients.map((ingredient) => ingredient.name)).toEqual(["Magenta", "Kuning"]);
    expect(recipe.resultHex).toBe("#FF0000");
    expect(recipe.similarity).toBe(100);
    expect(recipe.quality).toBe("exact");
    expect(recipe.measurement).toBe("coverage");
  });

  it("identifies yellow as a direct subtractive pigment", () => {
    const [recipe] = findColorRecipes({ r: 255, g: 255, b: 0 }, "subtractive", 4);

    expect(recipe.ingredients).toEqual([
      { name: "Kuning", color: { r: 255, g: 255, b: 0 }, ratio: 100 },
    ]);
    expect(recipe.resultHex).toBe("#FFFF00");
  });

  it("derives a close CMYK coverage formula for cerulean", () => {
    const [recipe] = findColorRecipes({ r: 12, g: 123, b: 192 }, "subtractive", 4);

    expect(recipe.ingredients.map(({ name, ratio }) => ({ name, ratio }))).toEqual([
      { name: "Cyan", ratio: 94 },
      { name: "Magenta", ratio: 36 },
      { name: "Hitam", ratio: 25 },
    ]);
    expect(recipe.resultHex).toBe("#0B7ABF");
    expect(recipe.similarity).toBe(99);
    expect(recipe.quality).toBe("very-close");
  });

  it("represents black as zero emitted light", () => {
    const [recipe] = findColorRecipes({ r: 0, g: 0, b: 0 }, "additive", 1);

    expect(recipe.ingredients).toEqual([
      { name: "Tanpa cahaya", color: { r: 0, g: 0, b: 0 }, ratio: 0 },
    ]);
    expect(recipe.resultHex).toBe("#000000");
    expect(recipe.similarity).toBe(100);
  });

  it("re-evaluates a manually adjusted formula and clamps invalid percentages", () => {
    const target = { r: 4, g: 11, b: 215 };
    const [base] = findColorRecipes(target, "additive", 1);
    const adjusted = evaluateColorRecipe(
      target,
      base.ingredients.map((ingredient) => ({
        ...ingredient,
        ratio: ingredient.name === "Biru" ? 84 : ingredient.ratio,
      })),
      "intensity",
    );

    expect(adjusted.resultHex).toBe("#040BD6");
    expect(adjusted.similarity).toBe(99);

    const clamped = evaluateColorRecipe(
      target,
      [
        { name: "Merah", color: { r: 255, g: 0, b: 0 }, ratio: -10 },
        { name: "Biru", color: { r: 0, g: 0, b: 255 }, ratio: 140 },
      ],
      "intensity",
    );
    expect(clamped.ingredients.map((ingredient) => ingredient.ratio)).toEqual([0, 100]);
  });

  it("scores a black CMYK result as perceptually far from medium blue", () => {
    const target = { r: 33, g: 21, b: 193 };
    const recipe = evaluateColorRecipe(
      target,
      [
        { name: "Cyan", color: { r: 0, g: 255, b: 255 }, ratio: 100 },
        { name: "Magenta", color: { r: 255, g: 0, b: 255 }, ratio: 100 },
        { name: "Hitam", color: { r: 0, g: 0, b: 0 }, ratio: 100 },
      ],
      "coverage",
    );

    expect(recipe.resultHex).toBe("#000000");
    expect(recipe.distance).toBe(45.59);
    expect(recipe.similarity).toBe(9);
    expect(recipe.quality).toBe("far");
  });

  it("derives the expected CMYK formula when the target changes to medium blue", () => {
    const [recipe] = findColorRecipes({ r: 33, g: 21, b: 193 }, "subtractive", 1);

    expect(recipe.ingredients.map(({ name, ratio }) => ({ name, ratio }))).toEqual([
      { name: "Cyan", ratio: 83 },
      { name: "Magenta", ratio: 89 },
      { name: "Hitam", ratio: 24 },
    ]);
    expect(recipe.resultHex).toBe("#2115C2");
    expect(recipe.similarity).toBe(99);
    expect(recipe.quality).toBe("very-close");
  });
});
