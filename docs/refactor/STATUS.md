# Refactor Status

Last updated: 2026-09-07

## Current objective

ALUSNA production launch hardening and the Google Fonts catalog integration are implemented. The
remaining launch work requires the real HTTPS origin, public contact email, and verification against
the selected host.

## Completed

- Git repository initialized on `main`.
- Pre-refactor snapshot committed as `10a9f8e`.
- Baseline unit tests: 87 passed.
- Baseline production build: passed.
- Production dependency audit: 0 vulnerabilities.
- Current modules, shared state, persistence, routes, exports, and large files inventoried.
- Target feature-based architecture documented.
- State ownership, dependency boundaries, and legacy storage migration decisions recorded.
- Phase 0 and Phase 1 validation completed.
- ESLint, Prettier, dependency-cruiser, Playwright, and GitHub Actions CI added.
- Unit suite expanded to 96 passing tests across 8 files.
- Storage migration planning has 9 contract tests and is not activated yet.
- Browser E2E has 13 passing tests across all public routes and critical navigation.
- Full dependency audit reports 0 vulnerabilities.
- Tool-page headings corrected to one semantic `<h1>` per public route.
- Phase 2 validation completed.
- ALUSNA name, slogan, descriptor, description, structured-data ID, and event names centralized.
- Package, visible identity, favicon, SEO titles, structured data, image copy, and Brand Kit token attribution rebranded.
- Versioned `alusna-studio` persistence activated with a sanitized, idempotent migration from `cikp-studio`.
- Legacy storage remains intact as a rollback copy; corrupt target data is never overwritten automatically.
- Store types, constants, sanitizer, migration, and storage adapter now have separate ownership.
- Generic Card, CopyButton, ErrorBoundary, SponsorSlot, Toast, toast context, and class-name helper moved under `shared`.
- Unit and contract suite expanded to 101 passing tests across 9 files.
- Browser E2E expanded to 15 passing tests, including identity, structured data, and real legacy-storage migration.
- Phase 3 validation completed.
- Color domain logic, image palette service, reusable color UI, and all eight color tools moved under `features/color`.
- `features/color/index.ts` now defines the supported color API.
- Thin legacy facades preserve current `App.tsx` lazy imports and narrow store dependencies until their owning migration steps.
- Typography catalog and validation moved to a pure model, while Google Font, upload, and restore browser operations moved to a dedicated service.
- `features/typography/index.ts` now defines the supported typography API; the old font module and utility paths are thin compatibility facades.
- Design-system generation and five export serializers now live in separate pure modules behind `features/design-system/index.ts`.
- The temporary combined design-system/Brand Kit facade was removed after both feature APIs stabilized.
- Brand Kit model/generation, sanitized HTML serialization, import/export interop, and UI moved under `features/brand-kit` last.
- Cross-feature imports now use each feature's root `index.ts`; dependency-cruiser enforces this rule for all four features.
- Unused compatibility facades were removed; only app-shell and store compatibility paths with known consumers remain.
- Unit and contract suite expanded to 102 passing tests across 11 files.
- All 15 browser E2E checks, production build, static gates, and production dependency audit pass after Phase 4.
- Phase 4 validation completed.
- App-level error, toast, theme, and storage-warning effects moved into `app/providers`.
- Header, page intro, loading state, and color history moved into `app/layout`.
- Route catalog, history mutation, legacy `?m=` compatibility, URL state restoration, keyboard navigation, and popstate handling moved into `app/router`.
- Router contract coverage added; unit and contract suite expanded to 105 tests across 12 files.
- Runtime title, canonical, Open Graph, and JSON-LD lifecycle moved into `app/seo` with pure metadata builders.
- SEO contract coverage added; unit and contract suite expanded to 107 tests across 13 files.
- About, Privacy, Terms, and Advertising Policy are crawlable static routes with `WebPage` structured data.
- Direct sponsor configuration moved into `app/monetization`; invalid or incomplete configuration fails closed.
- Commercial placement is labeled `Iklan / Sponsor`, uses `rel="sponsored"`, and links to the advertising disclosure.
- App composition now imports lazy feature loaders through each feature's public `index.ts`; obsolete `modules/*` facades were removed.
- Unit and contract suite expanded to 111 passing tests across 14 files.
- Browser coverage expanded to 20 required scenarios plus one opt-in configured-sponsor scenario.
- Phase 5 validation completed.
- Feature domain APIs and UI lazy loaders now have separate public entries, preventing store-to-UI
  dependency cycles.
- Root `App.tsx` and the final `lib/color.ts` and `lib/font.ts` compatibility adapters were removed.
- Responsive E2E covers representative mobile, tablet, and desktop routes with horizontal-overflow
  assertions.
- Tool-route E2E now verifies one `h1` and the canonical URL; Brand Kit E2E covers its export preview.
- Mobile color-copy controls and footer links meet a 24 CSS pixel minimum target in the audited flow;
  palette add controls remain visible on touch-sized layouts.
- The production entry chunk is 58.16 kB gzip versus 58.89 kB at the pre-refactor baseline.
- Unit and contract coverage remains 111 passing tests across 14 files.
- Browser coverage is 22 required passing scenarios plus one optional sponsor-configured scenario.
- Fifteen nested static public pages are emitted: eleven tools and four trust pages.
- The full local quality gate and production dependency audit pass with 0 vulnerabilities.
- Phase 6 validation completed; the six-phase architectural refactor is verified.
- `/` is a dedicated crawlable homepage with visible entry points to all eleven tools.
- All eleven tool routes include typed, unique usage guidance and three contextual related-tool links.
- Homepage and tool guidance are emitted into built HTML and verified with JavaScript disabled.
- Anonymous page-view measurement is provider-neutral, allowlisted, network-free, and disabled by
  default.
- Sitemap generation covers 16 public URLs when the production origin is configured.
- Unit and contract coverage expanded to 118 passing tests across 17 files.
- Browser coverage expanded to 25 required passing scenarios plus one optional sponsor scenario.
- The production entry chunk remains below baseline at 58.59 kB gzip.
- Phase 7 validation completed; the organic-growth foundation is verified.
- Swiss Modular visual tokens now use a neutral canvas, cobalt-led actions, restrained magenta and
  amber accents, Manrope interface typography, and IBM Plex Mono utility typography.
- The app shell, homepage, shared surfaces, and Color Palette Generator now use flatter grid-based
  layouts aligned with the selected UI-designer reference.
- Visible emoji and text-glyph substitutes in representative feature controls were replaced with
  direct Phosphor icon imports and accessible labels.
- New users start in light mode while persisted users retain their existing theme preference.
- Desktop reference comparison and mobile, tablet, and desktop browser checks passed with no
  document-level horizontal overflow or unnamed buttons in representative routes.
- Visual QA passed with no unresolved P0, P1, or P2 findings; see `design-qa.md`.
- The final local gate passes with 118 unit and contract tests, 25 required browser scenarios,
  one intentionally skipped sponsor scenario, a production build, and 0 production dependency
  vulnerabilities.
- Experiment can now rank two-light recipes or derive one-to-four-channel CMYK coverage for a
  target, then load the formula into the existing mixer.
- The default yellow target resolves to 50% red plus 50% green light with 100% similarity.
- Low-confidence pigment results display an explicit warning that the screen model is not a
  production paint formula.
- Recipe search is framework-independent and its focused coverage includes exact light recipes,
  direct pigments, arbitrary CMYK targets, and partial single-pigment coverage.
- Browser coverage now has 26 required passing scenarios plus one intentionally skipped configured
  sponsor scenario, including the complete yellow-recipe workflow.
- The final production dependency audit still reports 0 vulnerabilities.
- The reported `#0C7BC0` Cat/Tinta regression is fixed: Cyan 94%, Magenta 36%, and Hitam 25% now
  produce `#0B7ABF` instead of four duplicate `#0000FF` approximations.
- The full suite now has 125 passing tests across 18 files; browser coverage remains 26 required
  passing scenarios plus one intentionally skipped configured sponsor scenario.
- Cahaya RGB now derives independent red, green, and blue channel intensities instead of ranking
  normalized two-source blends.
- Target `#0008FF` resolves to Hijau 3.14% plus Biru 100%, applies those intensities to the mixer, and
  reproduces the exact target result.
- Experiment labels weights as RGB intensity or CMYK coverage when those physical models are
  active, while Average and Weighted retain the generic weight label.
- The full suite now has 129 passing tests across 18 files; browser coverage remains 26 required
  passing scenarios plus one intentionally skipped configured sponsor scenario.
- RGB formulas retain two decimal places and reproduce 8-bit target channels exactly; each RGB or
  CMYK percentage can be adjusted with a synchronized slider and numeric input.
- Formula HEX and similarity update live, Reset restores the generated values, and the adjusted
  formula can be applied to the existing mixer.
- The reported `#040BD7` example is browser-verified: Biru 84% yields `#040BD6` at 99%, while Biru
  84.31% yields the exact `#040BD7` at 100%.
- The full suite now has 130 passing tests across 18 files; browser coverage remains 26 required
  passing scenarios plus one intentionally skipped configured sponsor scenario.
- Formula similarity now uses perceptual OKLab distance instead of raw RGB diagonal normalization;
  the UI shows both a calibrated score and an explicit quality label.
- Target `#2115C1` against black now reports `9% · Berbeda jauh` with perceptual distance 45.59,
  replacing the misleading 55% score.
- The generated CMYK formula for `#2115C1` resets to Cyan 83%, Magenta 89%, and Hitam 24%, producing
  `#2115C2` at `99% · Sangat dekat`.
- The full suite now has 132 passing tests across 18 files; browser coverage remains 26 required
  passing scenarios plus one intentionally skipped configured sponsor scenario.
- Every RGB or CMYK formula ingredient now displays its HEX code with a dedicated accessible copy
  action; the calculated formula result also has its own copy action.
- Experiment Color now opens with Additive selected by default, aligning its initial physical model
  with the default Cahaya RGB recipe finder while preserving Average as an explicit option.
- Exact RGB/CSS primaries now use localized target labels with standards context; `#00FF00` appears
  as `Hijau RGB (CSS: Lime)`, matching the Hijau recipe channel without hiding the CSS keyword.
- All 16 existing Indonesian public URLs remain unchanged and now have English counterparts under
  `/en`, bringing the static public-page total to 32.
- The header language switch maps to the same logical page without automatic redirects; Indonesian
  remains the default locale and existing persisted design state is shared unchanged.
- English routes include localized shell, homepage, trust/legal content, tool metadata, evergreen
  guidance, and primary controls across the color, typography, design-system, and Brand Kit tools.
- Runtime and built HTML set locale-specific language, title, canonical, structured data, reciprocal
  `hreflang` (`id`, `en`, and `x-default`), and bilingual sitemap alternatives.
- Unit and contract coverage expanded to 136 passing tests; browser coverage includes 28 required
  passing scenarios plus one intentionally skipped configured-sponsor scenario.
- ALUSNA was introduced as the `v1.0.0` public release; the bilingual About page and package
  metadata now identify the current `v1.2.0` release.
- The About changelog records the initial toolset, browser-local behavior, bilingual URLs, SEO
  foundation, and pre-advertising trust pages; it is also emitted in static no-JavaScript HTML.
- Node.js 22.x is now the explicit local and CI runtime contract.
- `build:production` fails closed when the HTTPS origin or public contact is missing, invalid, or a
  placeholder, then verifies sitemap, robots, canonical, and bilingual `hreflang` output.
- Bootstrap error handling moved to a same-origin script, allowing production `script-src` to drop
  `'unsafe-inline'` while retaining the looser development policy required by React Fast Refresh.
- Static-host and Nginx security-header templates add frame, MIME-sniffing, referrer, permission,
  opener, transport, and response-level CSP protections.
- Browser coverage now has 29 required passing scenarios plus one optional sponsor scenario,
  including enforcement of the external bootstrap and strict production script policy.
- Bootstrap error monitoring now stops after React starts successfully, so CSP violations from
  responsive-preview tooling or browser extensions cannot replace a running app with the fatal
  startup overlay; production CSP remains strict and does not allow `unsafe-eval`.
- Bootstrap recovery now clears transient pre-render errors after a successful mount, ignores
  blocked external-resource failures such as Vercel Toolbar injection, and uses an intentional
  theme-aware loading screen instead of a red/black error-like flash.
- Mobile and tablet headers now use a two-row layout with four equally distributed module tabs,
  visible locale and theme controls, and no nested horizontal navigation scroll; desktop retains
  the compact single-row header at the `xl` breakpoint.
- Typography now uses a validated local Google Fonts metadata snapshot with search, category and
  style filters, supported-weight selection, italic availability, and incremental catalog display.
- Google Fonts CSS is loaded only for an active or intentionally previewed family, cached by its
  complete family/weight/style URL, and falls back to the local font stack when the network fails.
- The Developer API key stays outside the browser bundle; the explicit `fonts:sync` maintenance
  command validates catalog data, caps output, writes atomically, and preserves the existing
  snapshot on failure.
- The Node.js 22 quality gate passes with 145 unit and contract tests across 19 files; browser
  coverage now has 30 required passing scenarios plus one optional sponsor scenario.
- The production entry is 68.04 kB gzip and the lazy Typography module is 10.10 kB gzip with the
  current 300-family API-synchronized snapshot.
- Design System now generates light, dark, and high-contrast themes from layered primitive,
  semantic, and component tokens with adjustable spacing, radius, typography, and shadows.
- Its preview and contrast checks cover representative buttons, cards, inputs, alerts, and text
  pairings before export.
- Design System exports CSS variables, Tailwind v4 theme variables, DTCG 2025.10 JSON, SCSS, and
  React Native tokens; every format can be copied or downloaded as a browser-local file.
- Color history is now a unique most-recently-used list: choosing an older swatch moves it to the
  front instead of creating another copy.
- Node.js 22 validation passes with 161 unit and contract tests across 22 files; browser
  coverage now has 34 required passing scenarios plus one optional sponsor scenario.
  Repository-wide formatting is blocked by the existing `scripts/debug-probe.mjs` warning;
  changed files pass formatting checks.
- The production entry is 68.09 kB gzip and the lazy Design System module is 9.37 kB gzip.
- The design-reference audit fixed duplicate colors in the Accessibility Simulator, localized the
  remaining Contrast Checker labels on English routes, and added explicit hover/active foreground
  tokens and WCAG checks for Design System actions.
- Google Fonts variable families now expose selectable standard weights within their advertised
  axis range; Tailwind v4 exports typography variables and React Native exports pixel-correct
  letter spacing.
- Audit evidence and current measurements are recorded in `audit-design-reference/2026-09-06`.
- Visual redesign Fase 0 baseline, Fase 1 shared foundation, and Fase 2 app shell are implemented;
  details and constraints are recorded in `docs/redesign/README.md`.
- Shared visual tokens now use a neutral paper/ink canvas, restrained cobalt action accent, editorial
  surfaces, reduced-motion protection, and skeleton loading states.
- Desktop and mobile/tablet navigation now use clear active states; color tools collapse into a
  responsive grid instead of requiring horizontal scrolling.
- Visual redesign Fase 3–5 are implemented: the homepage is now a design-reference hub with
  context-based entry points, the Color workspace uses shared semantic action states and a clear
  active-palette inspector, and Typography exposes active family, weight availability, and preview
  mode before the catalog.
- Feature-specific color actions no longer use indigo-only presentation tokens; selected controls and
  action buttons follow the shared cobalt theme in light and dark mode.
- Visual redesign Fase 6–8 are implemented: Design System now presents the primitive-to-component
  workflow with responsive contrast/export panels, Brand Kit tabs collapse into a touch-safe grid,
  and the final polish removes remaining feature-level indigo presentation tokens.
- Visual redesign Fase 9–10 are implemented: Design System drafts now persist safely for the current
  browser session, Brand Kit actions are bilingual, and the Node.js 22 production release gate has
  been rerun with launch configuration still fail-closed.
- Brand Kit's redundant saved-palette panel was removed while the shared saved-color state and Color
  workspace behavior remain unchanged.
- Typography pairing suggestions now derive from the selected family: heading-style fonts are paired
  with readable body fonts and body-style fonts with curated headings. Selecting a suggestion only
  updates the pairing preview and never replaces the active catalog or uploaded font.
- Design System now accepts a custom base color through the shared picker and HEX input, can sync
  from the active Color workspace value, and persists the sanitized choice for the current session.
- Vercel deployment is now pinned to the production SEO build, which fails closed when the public
  origin or contact email is still a placeholder instead of publishing incomplete metadata.
- A permanent Vercel redirect now maps the common typo `/robot.txt` to the standard `/robots.txt`.
- Component Kit MVP is now a separate Design System UI module with token-driven actions, forms,
  feedback states, and copyable CSS handoff snippets.
- Component Kit now includes an Overlays category with accessible Tabs, Dialog, and Toast examples;
  the interaction workflow is covered by browser tests.
- Component Kit handoff now supports CSS, Tailwind, and React snippets with deterministic token
  values and one-click copy behavior.

## Spacing and radius preview correction — 2026-09-07

- Objective: make both system scale controls visibly affect the existing Component Kit previews and
  keep copied CSS, Tailwind, and React output consistent with those previews.
- Files changed: `model/componentKitRadius.ts`, `model/componentKitSpacing.ts`, `ui/ComponentKit.tsx`,
  `ui/DesignSystemModule.tsx`, and `services/componentKitSnippets.ts` plus its test under
  `src/features/design-system/`; `e2e/studio.spec.ts`; `src/app/trust/releaseNotes.ts`; this status
  file, `docs/refactor/ROADMAP.md`, and the configurable-port `playwright.config.ts`.
- Decisions: share one component-radius role map between preview and handoff. Buttons use `md`,
  fields and badges `sm`, panels and alerts `lg`, and dialogs `xl`. Base radius zero produces
  square corners. Pill/switch shapes retain `full`, and native checkboxes retain browser styling.
  Button `sm/md/lg` controls change height/padding independently, with an explicit size label.
  A small inline radius sample gives immediate feedback beside the slider without adding another
  component gallery or competing shape setting.
- Spacing uses the generated scale for preview padding, section/control gaps, field and button
  padding, tab spacing, dialog spacing, and matching handoff output. A small two-block spacing
  sample gives immediate feedback beside its slider.
- Validation: Node.js 22 lint, dependency boundaries, 162 unit/contract tests across 22 files,
  production build, 34 browser scenarios, and `git diff --check` passed; one optional sponsor
  scenario was skipped. Online `npm audit --omit=dev` reports zero vulnerabilities. Radius checks
  cover Indonesian/mobile and English/desktop at 0, 8, and 24 px, including size changes, snippet
  formats, session restoration, and no horizontal overflow. Square/rounded preview screenshots
  were visually reviewed. Changed files pass Prettier; repository-wide `format:check` still reports
  a pre-existing warning in the unchanged `scripts/debug-probe.mjs`.
- Remaining risks: radius controls the generated kit, not the ALUSNA editor chrome. Existing native
  control and pill shapes intentionally do not become square. Real handoff feedback is still needed.
- Next planned task: continue Phase 14 with real designer–developer handoff workflows before adding
  packages or more framework adapters.

## In progress

- Phase 14 real-world workflow validation; initial radius feedback addressed, broader usage pending.

## Known risks

- E2E covers route rendering, primary navigation, representative responsive layouts, canonical URLs,
  and the Brand Kit export preview, but not every editor combination, download, or clipboard failure.
- The ALUSNA domain and final production origin are not configured yet.
- Search Console ownership verification and sitemap submission remain external launch steps; code
  cannot make a site appear in search results before a real domain is deployed and submitted.
- The legacy `cikp-studio` key is intentionally retained; removal requires a later explicit compatibility decision.
- `studio.ts` remains a shared persisted Zustand store; introduce slices only when a product change
  needs independently owned state lifecycles.
- The production contact email is not active until `VITE_CONTACT_EMAIL` is configured.
- No third-party ad network or revenue account is active; adding one requires CSP, privacy, consent, and provider-specific review.
- Search ranking, ad approval, and revenue are external outcomes and are not guaranteed by technical SEO.
- Evergreen guidance still requires review when tool behavior or relevant web standards change.
- The production entry chunk is 66.16 kB gzip, 7.57 kB above the Phase 7 value after adding the
  shared icon runtime and redesigned shell.
- Manrope and IBM Plex Mono load from Google Fonts; self-hosting remains an option for stricter CSP,
  privacy, and offline resilience.
- Formula percentage is a calibrated UX score derived from perceptual OKLab distance, not a
  standardized scientific similarity percentage; the underlying distance is shown in the UI.
- Cat/Tinta recipes are idealized simulations; real pigments, opacity, substrate, and material
  chemistry can produce different results.
- Adjustable formulas are idealized screen simulations; Cat/Tinta still does not model
  manufacturer-specific pigment behavior.
- Every new or changed user-facing message now requires both Indonesian and English copy; the
  translation catalog has no external localization platform or professional editorial review.
- Inline React presentation styles still require `style-src 'unsafe-inline'`; removing it needs a
  separate styling refactor and is not required to block executable script injection.
- Security-header templates are platform-dependent and remain unverified until the real HTTPS host
  is available.
- The committed Google Fonts snapshot contains 300 API-synchronized families; future refreshes
  still require a maintainer-controlled Developer API key and an explicit `npm run fonts:sync`.
- Font rendering still depends on Google-hosted CSS and font files when a Google family is selected;
  network failure falls back safely, but self-hosting is required for full offline and privacy
  independence.
- The 300-family snapshot increases the lazy Typography chunk to 10.10 kB gzip; review pagination
  and catalog size before raising the synchronization limit further.
- The richer Design System increases its lazy chunk from 5.09 kB to 14.31 kB gzip. It remains
  route-split, but future additions should avoid pulling editor-only dependencies into the entry.
- DTCG output follows the 2025.10 schema structure, but compatibility has not yet been verified
  against every third-party design-token importer.
- The online production dependency audit was successfully rerun on 2026-09-07 and reports zero
  vulnerabilities; this supersedes the cached-only result from 2026-09-04.
- Design System drafts are currently persisted for the browser session only; long-term persistence
  would require a separate product decision and storage migration review.
- Some legacy tool copy still needs a final English editorial pass; shared UI and the audited
  Contrast Checker are localized.
- Shade level 500 is a generated lightness step rather than an exact copy of the input color; keep
  this behavior documented or add an explicit base-anchor option.
- The visual redesign is complete through Fase 10; remaining product risk is final editorial review,
  real hosting configuration, and optional long-term draft persistence beyond a browser session.

## Next task

Configure the real production origin and contact channel, copy `.env.production.example` to
`.env.production`, run `npm run build:production`, and verify nested URLs, response headers, and
indexing on the real host before selecting an advertising provider.
