# Refactor Status

Last updated: 2026-08-21

## Current objective

Phase 3 is verified. Await authorization to begin Phase 4 incremental feature migration.

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

## In progress

- No implementation task. The next authorized work begins Phase 4.

## Known risks

- `App.tsx` currently couples routing, SEO, and layout; moving all three at once would create a broad regression surface.
- Brand Kit depends on multiple domains and must migrate after color, typography, and design-system APIs stabilize.
- E2E covers route rendering and primary navigation, but not every editing and export workflow.
- Module boundaries are enforced for the target folders; most legacy code has not moved into those folders yet.
- The ALUSNA domain and final production origin are not configured yet.
- The legacy `?m=` route compatibility effect has one documented lint exception until routing extraction.
- The legacy `cikp-studio` key is intentionally retained; removal requires a later explicit compatibility decision.

## Next task

Phase 4 should migrate the color feature first, expose a public `features/color/index.ts` API, and retain adapters until all legacy consumers move.
