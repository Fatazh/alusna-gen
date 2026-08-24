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
- Evergreen instructions: `src/app/content/toolGuides.ts`.
- Browser flow coverage: `e2e/studio.spec.ts`.

The existing local change in `src/app/content/ToolGuideView.tsx` was preserved and excluded from
this task.

## Decisions made

- Separate light mixing (`additive`) from pigment simulation (`subtractive`) because they answer
  different physical questions.
- Derive Cahaya RGB formulas directly from the target's red, green, and blue channel values. Each
  channel is an independent 0% to 100% intensity and the formula is not normalized to a 100% total.
- Model additive mixing as emitted-light intensity. A mixer weight from 0 to 5 maps to 0% to 100%,
  matching the existing control range and the recipe application flow.
- Derive Cat/Tinta recipes from CMYK channel coverage. This supports one to four ingredients and
  correctly identifies colors such as yellow as a direct pigment.
- Model subtractive mixing as independent pigment coverage over a white substrate. A mixer weight
  from 0 to 5 maps to 0% to 100% coverage.
- Reserve 100% similarity for an identical result; rounded but non-identical results are capped at
  99%.
- Display a material warning instead of presenting the idealized screen result as a production
  paint formula.
- Keep target and recipe state local to the component; no persisted schema or migration is needed.

## Validation performed

- Eleven focused recipe and mixing tests passed, including exact yellow light from 100% red and
  100% green, `#0008FF` from 3% green plus 100% blue, partial single-light intensity, exact red from
  magenta and yellow, single-pigment coverage, and the reported Cerulean regression.
- Browser checks passed at desktop and 390 x 844 mobile sizes with no document overflow or unnamed
  buttons.
- Applying a recipe correctly loads one to four experiment slots, their intensity or coverage, and
  the matching mix mode.
- Target `#0008FF` now displays and applies Hijau 3% plus Biru 100%, yielding the exact requested
  HEX instead of an unrelated low-confidence two-source result.
- Target `#0C7BC0` now produces Cyan 94%, Magenta 36%, and Hitam 25%, yielding `#0B7ABF` rather than
  collapsing to `#0000FF`.
- `npm run check` passed with 129 tests across 18 files, no dependency-boundary violations, and a
  production build.
- `npm run test:e2e` passed 26 required scenarios; one sponsor-configured scenario remained
  intentionally skipped.
- `npm audit --omit=dev` reported 0 vulnerabilities.

## Remaining risks

- Similarity uses RGB distance, which is deterministic and fast but not as perceptually accurate as
  a Delta E calculation in a Lab-like color space.
- The subtractive model assumes idealized CMYK channel coverage. Real paint, ink, printing
  substrate, opacity, and pigment chemistry can produce different results.
- Rounded whole-percent RGB intensities can differ from the target by one or two channel values for
  arbitrary colors; the result and similarity make that approximation explicit.
- Cat/Tinta supports up to four CMYK channels but not manufacturer-specific pigments.
- The lazy Experiment chunk is 6.54 kB gzip; the main entry remains effectively unchanged at 66.24
  kB gzip.

## Next planned task

Gather usage feedback before considering perceptual Delta E scoring, finer-than-one-percent RGB
intensity display, or custom pigment libraries. Production launch configuration remains the
broader project priority.
