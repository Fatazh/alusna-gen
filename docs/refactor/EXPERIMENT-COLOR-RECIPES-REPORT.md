# Experiment Color Recipes Report

Date: 2026-08-24

## Objective

Add a browser-local feature to the Experiment tool that identifies recipes for a target color,
including two-source light recipes and idealized CMYK ink-coverage formulas.

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
- Search an explicit catalog of common light sources and ratios from 10% to 90%, retaining only the
  best ratio for each additive pair.
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

- Seven focused recipe and subtractive-coverage tests passed, including exact yellow light from 50%
  red and 50% green, exact red from magenta and yellow, single-pigment coverage, and the reported
  Cerulean regression.
- Browser checks passed at desktop and 390 x 844 mobile sizes with no document overflow or unnamed
  buttons.
- Applying a recipe correctly loads one to four experiment slots, their coverage, and the matching
  mix mode.
- Target `#0C7BC0` now produces Cyan 94%, Magenta 36%, and Hitam 25%, yielding `#0B7ABF` rather than
  collapsing to `#0000FF`.
- `npm run check` passed with 125 tests across 18 files, no dependency-boundary violations, and a
  production build.
- `npm run test:e2e` passed 26 required scenarios; one sponsor-configured scenario remained
  intentionally skipped.
- `npm audit --omit=dev` reported 0 vulnerabilities.

## Remaining risks

- Similarity uses RGB distance, which is deterministic and fast but not as perceptually accurate as
  a Delta E calculation in a Lab-like color space.
- The subtractive model assumes idealized CMYK channel coverage. Real paint, ink, printing
  substrate, opacity, and pigment chemistry can produce different results.
- Additive search still covers two-source recipes from a curated light catalog; Cat/Tinta supports
  up to four CMYK channels but not manufacturer-specific pigments.
- The lazy Experiment chunk is 6.64 kB gzip; the main entry remains effectively unchanged at 66.23
  kB gzip.

## Next planned task

Gather usage feedback before considering perceptual Delta E scoring, multi-source additive recipes,
or custom pigment libraries. Production launch configuration remains the broader project priority.
