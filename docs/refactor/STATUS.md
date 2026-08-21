# Refactor Status

Last updated: 2026-08-22

## Current objective

Phase 6 is verified. The architectural refactor track is complete with public feature entries,
expanded hardening coverage, baseline bundle comparison, adapter removal, and maintenance guidance.

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

## In progress

- No refactor implementation task remains.

## Known risks

- E2E covers route rendering, primary navigation, representative responsive layouts, canonical URLs,
  and the Brand Kit export preview, but not every editor combination, download, or clipboard failure.
- The ALUSNA domain and final production origin are not configured yet.
- The legacy `cikp-studio` key is intentionally retained; removal requires a later explicit compatibility decision.
- `studio.ts` remains a shared persisted Zustand store; introduce slices only when a product change
  needs independently owned state lifecycles.
- The production contact email is not active until `VITE_CONTACT_EMAIL` is configured.
- No third-party ad network or revenue account is active; adding one requires CSP, privacy, consent, and provider-specific review.

## Next task

Prepare production launch: configure the final origin and contact channel, verify nested URLs and
indexing on the real host, then select an advertising provider and review its CSP, consent, privacy,
and regional requirements before activation.
