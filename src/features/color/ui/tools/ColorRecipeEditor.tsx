import { useMemo, useState } from "react";
import { ArrowCounterClockwise } from "@phosphor-icons/react/ArrowCounterClockwise";
import { CopyButton } from "../../../../shared/ui/CopyButton";
import { rgbToHex, type RGB } from "../../model/color";
import {
  COLOR_RECIPE_QUALITY_LABELS,
  evaluateColorRecipe,
  type ColorRecipe,
  type ColorRecipeIngredient,
} from "../../model/colorRecipes";

type ColorRecipeEditorProps = {
  target: RGB;
  recipe: ColorRecipe;
  onApply: (recipe: ColorRecipe) => void;
};

function formatPercentage(value: number): string {
  return Number(value.toFixed(2)).toString();
}

export function ColorRecipeEditor({ target, recipe, onApply }: ColorRecipeEditorProps) {
  const [ingredients, setIngredients] = useState<ColorRecipeIngredient[]>(recipe.ingredients);
  const adjustedRecipe = useMemo(
    () => evaluateColorRecipe(target, ingredients, recipe.measurement),
    [ingredients, recipe.measurement, target],
  );
  const controlName = recipe.measurement === "intensity" ? "Intensitas" : "Cakupan";
  const isDirty = ingredients.some(
    (ingredient, index) => ingredient.ratio !== recipe.ingredients[index]?.ratio,
  );

  const updatePercentage = (index: number, value: number) => {
    const percentage = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
    setIngredients((current) =>
      current.map((ingredient, ingredientIndex) =>
        ingredientIndex === index ? { ...ingredient, ratio: percentage } : ingredient,
      ),
    );
  };

  return (
    <article
      className="rounded-lg border p-4"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--chip-bg)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
            {recipe.measurement === "coverage" ? "Formula CMYK" : "Formula RGB"}
          </p>
          <p className="mt-1 font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
            {adjustedRecipe.ingredients
              .map((ingredient) => `${ingredient.name} ${formatPercentage(ingredient.ratio)}%`)
              .join(" · ")}
          </p>
        </div>
        <span
          aria-live="polite"
          className="rounded-full px-2 py-1 text-[10px] font-semibold"
          style={{ backgroundColor: "var(--chip-active-bg)", color: "var(--accent)" }}
        >
          {adjustedRecipe.similarity}% · {COLOR_RECIPE_QUALITY_LABELS[adjustedRecipe.quality]}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {adjustedRecipe.ingredients.map((ingredient, index) => (
          <div key={ingredient.name}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                <label
                  htmlFor={`recipe-${recipe.measurement}-${ingredient.name}`}
                  className="inline-flex items-center gap-2 text-[11px] font-semibold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span
                    className="h-3 w-3 rounded-full border"
                    style={{
                      backgroundColor: rgbToHex(ingredient.color),
                      borderColor: "var(--border)",
                    }}
                    aria-hidden="true"
                  />
                  {ingredient.name}
                </label>
                <code className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                  {rgbToHex(ingredient.color)}
                </code>
                <CopyButton
                  value={rgbToHex(ingredient.color)}
                  label="Salin"
                  ariaLabel={`Salin HEX ${ingredient.name} ${rgbToHex(ingredient.color)}`}
                  className="px-1.5 py-1 text-[10px]"
                />
              </div>
              <div className="flex items-center gap-1">
                <input
                  id={`recipe-${recipe.measurement}-${ingredient.name}`}
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={ingredient.ratio}
                  onChange={(event) => updatePercentage(index, Number(event.target.value))}
                  className="w-20 rounded-md border px-2 py-1 text-right font-mono text-[11px] outline-none"
                  style={{
                    borderColor: "var(--input-border)",
                    backgroundColor: "var(--input-bg)",
                    color: "var(--input-text)",
                  }}
                  aria-label={`${controlName} ${ingredient.name} (%)`}
                />
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  %
                </span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={0.01}
              value={ingredient.ratio}
              onChange={(event) => updatePercentage(index, Number(event.target.value))}
              className="mt-2 w-full"
              style={{ accentColor: rgbToHex(ingredient.color) }}
              aria-label={`Atur ${controlName.toLowerCase()} ${ingredient.name}`}
            />
          </div>
        ))}
      </div>

      <div
        className="mt-4 flex items-center justify-between gap-3 rounded-md border p-3"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card-bg)" }}
      >
        <div className="min-w-0">
          <p
            className="text-[10px] uppercase tracking-[0.12em]"
            style={{ color: "var(--text-muted)" }}
          >
            Hasil formula
          </p>
          <p className="mt-1 font-mono text-xs" style={{ color: "var(--text-primary)" }}>
            {adjustedRecipe.resultHex}
          </p>
          <p className="mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
            Jarak perceptual {adjustedRecipe.distance.toFixed(2)}
          </p>
          <CopyButton
            value={adjustedRecipe.resultHex}
            label="Salin hasil"
            ariaLabel={`Salin HEX hasil ${adjustedRecipe.resultHex}`}
            className="mt-1 -ml-1.5 px-1.5 py-1 text-[10px]"
          />
        </div>
        <div
          className="h-10 w-20 rounded-md border"
          style={{
            backgroundColor: adjustedRecipe.resultHex,
            borderColor: "var(--border)",
          }}
          title={`Hasil ${adjustedRecipe.resultHex}`}
        />
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => setIngredients(recipe.ingredients)}
          disabled={!isDirty}
          className="rounded-md border px-2.5 py-1.5 text-[11px] font-semibold disabled:cursor-not-allowed disabled:opacity-40"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
        >
          <ArrowCounterClockwise size={13} className="mr-1 inline" aria-hidden="true" />
          Reset
        </button>
        <button
          type="button"
          onClick={() => onApply(adjustedRecipe)}
          className="rounded-md px-2.5 py-1.5 text-[11px] font-bold"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-contrast)" }}
          aria-label={`Gunakan formula: ${adjustedRecipe.ingredients.map((ingredient) => ingredient.name).join(" dan ")}`}
        >
          Gunakan formula
        </button>
      </div>
    </article>
  );
}
