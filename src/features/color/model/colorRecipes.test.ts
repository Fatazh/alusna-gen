import { describe, expect, it } from "vitest";
import { findColorRecipes } from "./colorRecipes";

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
      { name: "Hijau", ratio: 3 },
      { name: "Biru", ratio: 100 },
    ]);
    expect(recipe.resultHex).toBe("#0008FF");
    expect(recipe.similarity).toBe(100);
  });

  it("uses all required RGB channels without forcing them to total 100%", () => {
    const [recipe] = findColorRecipes({ r: 12, g: 123, b: 192 }, "additive", 4);

    expect(recipe.ingredients.map(({ name, ratio }) => ({ name, ratio }))).toEqual([
      { name: "Merah", ratio: 5 },
      { name: "Hijau", ratio: 48 },
      { name: "Biru", ratio: 75 },
    ]);
    expect(recipe.resultHex).toBe("#0D7ABF");
    expect(recipe.similarity).toBe(99);
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
    expect(recipe.quality).toBe("close");
  });

  it("represents black as zero emitted light", () => {
    const [recipe] = findColorRecipes({ r: 0, g: 0, b: 0 }, "additive", 1);

    expect(recipe.ingredients).toEqual([
      { name: "Tanpa cahaya", color: { r: 0, g: 0, b: 0 }, ratio: 0 },
    ]);
    expect(recipe.resultHex).toBe("#000000");
    expect(recipe.similarity).toBe(100);
  });
});
