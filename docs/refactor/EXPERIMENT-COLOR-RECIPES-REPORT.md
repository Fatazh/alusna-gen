# Experiment Color Recipes Report

Date: 2026-08-24

## Objective

Add a browser-local feature to the Experiment tool that identifies recipes for a target color,
including independent RGB light intensities and idealized CMYK ink-coverage formulas.

## Files changed

- Pure recipe search and tests: `src/features/color/model/colorRecipes.ts` and
  `src/features/color/model/colorRecipes.test.ts`.
- Shared mixing behavior and tests: `src/features/color/model/color.ts` and
  `src/features/color/model/color.test.ts`.
- Feature public APIs: `src/features/color/index.ts` and `src/features/color/domain.ts`.
- Recipe target, model selection, ranked results, and apply-to-experiment UI:
  `src/features/color/ui/tools/ExperimentModule.tsx`.
- Reusable live percentage editor: `src/features/color/ui/tools/ColorRecipeEditor.tsx`.
- Evergreen instructions: `src/app/content/toolGuides.ts`.
- Browser flow coverage: `e2e/studio.spec.ts`.

The existing local change in `src/app/content/ToolGuideView.tsx` was preserved and excluded from
this task.

## Decisions made

- Separate light mixing (`additive`) from pigment simulation (`subtractive`) because they answer
  different physical questions.
- Derive Cahaya RGB formulas directly from the target's red, green, and blue channel values. Each
  channel is an independent 0% to 100% intensity and the formula is not normalized to a 100% total.
- Preserve RGB intensity to two decimal places, which is sufficient to reconstruct every 8-bit RGB
  channel exactly after rounding.
- Let users adjust each RGB intensity or CMYK coverage with synchronized sliders and numeric inputs;
  recalculate the HEX result and similarity immediately, with a reset to the generated formula.
- Model additive mixing as emitted-light intensity. A mixer weight from 0 to 5 maps to 0% to 100%,
  matching the existing control range and the recipe application flow.
- Derive Cat/Tinta recipes from CMYK channel coverage. This supports one to four ingredients and
  correctly identifies colors such as yellow as a direct pigment.
- Model subtractive mixing as independent pigment coverage over a white substrate. A mixer weight
  from 0 to 5 maps to 0% to 100% coverage.
- Score formula results in perceptual OKLab space rather than normalizing raw RGB distance against
  the black-to-white diagonal. Reserve 100% for identical RGB output and cap non-identical results
  at 99%.
- Pair the calibrated score with explicit labels: Tepat, Sangat dekat, Mendekati, Berbeda, and
  Berbeda jauh. The percentage remains a product-facing score, while the OKLab distance is shown
  separately for transparency.
- Display a material warning instead of presenting the idealized screen result as a production
  paint formula.
- Keep target and recipe state local to the component; no persisted schema or migration is needed.

## Validation performed

- Fourteen focused recipe and mixing tests passed, including exact yellow light from 100% red and
  100% green, `#0008FF` from 3.14% green plus 100% blue, manual formula re-evaluation and input
  clamping, partial single-light intensity, exact red from magenta and yellow, single-pigment
  coverage, and the reported Cerulean regression.
- The reported Medium Blue case is covered directly: target `#2115C1` with Cyan, Magenta, and Hitam
  all at 100% produces black, distance 45.59, and `9% · Berbeda jauh` instead of the misleading 55%.
- Changing the same target regenerates Cyan 83%, Magenta 89%, and Hitam 24%, yielding `#2115C2` at
  `99% · Sangat dekat`.
- Browser checks passed at desktop and 390 x 844 mobile sizes with no document overflow or unnamed
  buttons.
- Applying a recipe correctly loads one to four experiment slots, their intensity or coverage, and
  the matching mix mode.
- Target `#0008FF` now displays and applies Hijau 3.14% plus Biru 100%, yielding the exact requested
  HEX instead of an unrelated low-confidence two-source result.
- For target `#040BD7`, changing Biru from 84.31% to 84% produces `#040BD6` at 99%; restoring
  84.31% returns `#040BD7` at 100%. This flow passed both interactive browser and E2E checks.
- Target `#0C7BC0` now produces Cyan 94%, Magenta 36%, and Hitam 25%, yielding `#0B7ABF` rather than
  collapsing to `#0000FF`.
- `npm run check` passed with 132 tests across 18 files, no dependency-boundary violations, and a
  production build.
- `npm run test:e2e` passed 26 required scenarios; one sponsor-configured scenario remained
  intentionally skipped.
- `npm audit --omit=dev` reported 0 vulnerabilities.

## Remaining risks

- The displayed percentage is a calibrated UX score derived from OKLab distance, not a standardized
  scientific percentage. The underlying distance is displayed alongside the formula result.
- The subtractive model assumes idealized CMYK channel coverage. Real paint, ink, printing
  substrate, opacity, and pigment chemistry can produce different results.
- The adjustable percentages represent an idealized screen-light or CMYK coverage model; manual
  changes can reduce similarity and are not a physical pigment recipe.
- Cat/Tinta supports up to four CMYK channels but not manufacturer-specific pigments.
- The lazy Experiment chunk is 7.26 kB gzip; the main entry remains effectively unchanged at 66.25
  kB gzip.

## Next planned task

Gather usage feedback before considering CIEDE2000 comparison or custom pigment libraries.
Production launch configuration remains the broader project priority.
