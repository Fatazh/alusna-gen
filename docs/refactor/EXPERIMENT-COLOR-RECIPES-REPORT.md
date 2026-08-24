# Experiment Color Recipes Report

Date: 2026-08-24

## Objective

Add a browser-local feature to the Experiment tool that identifies two-color recipes for a target
color, including the common question of which light colors produce yellow.

## Files changed

- Pure recipe search and tests: `src/features/color/model/colorRecipes.ts` and
  `src/features/color/model/colorRecipes.test.ts`.
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
- Search an explicit catalog of common source colors and ratios from 10% to 90%, retaining only the
  best ratio for each pair.
- Exclude a source that is already effectively the target to avoid trivial recommendations such as
  “yellow from yellow.”
- Display numerical similarity and a low-confidence pigment warning instead of presenting a screen
  approximation as a production paint formula.
- Keep target and recipe state local to the component; no persisted schema or migration is needed.

## Validation performed

- Four focused model tests passed, including exact yellow light from 50% red and 50% green and exact
  red pigment simulation from magenta and yellow.
- Browser checks passed at desktop and 390 x 844 mobile sizes with no document overflow or unnamed
  buttons.
- Applying a recipe correctly loads two experiment slots, their ratios, and the matching mix mode.
- `npm run check` passed with 122 tests across 18 files, no dependency-boundary violations, and a
  production build.
- `npm run test:e2e` passed 26 required scenarios; one sponsor-configured scenario remained
  intentionally skipped.
- `npm audit --omit=dev` reported 0 vulnerabilities.

## Remaining risks

- Similarity uses RGB distance, which is deterministic and fast but not as perceptually accurate as
  a Delta E calculation in a Lab-like color space.
- The subtractive model assumes idealized channels. Real paint, ink, printing substrate, opacity,
  and pigment chemistry can produce different results.
- Search currently covers two-color recipes from a curated source catalog, not arbitrary three-color
  recipes or manufacturer-specific pigments.
- The lazy Experiment chunk increased to 6.47 kB gzip; the main entry remains effectively unchanged
  at 66.18 kB gzip.

## Next planned task

Gather usage feedback before considering perceptual Delta E scoring, three-color recipes, or custom
pigment libraries. Production launch configuration remains the broader project priority.
