# ALUSNA Refactor Roadmap

Status values: `planned`, `in-progress`, `blocked`, `completed`, `verified`.

## Phase 0: Baseline and safety

Status: **verified**

- [x] Initialize Git on `main`.
- [x] Capture the pre-refactor application in commit `10a9f8e`.
- [x] Record source size, routes, persistence key, large files, and missing tooling.
- [x] Verify unit tests and production build.
- [x] Record final dependency audit result for Phase 0-1.

## Phase 1: Architecture blueprint

Status: **verified**

- [x] Define target folders and dependency direction.
- [x] Map feature ownership and public API rules.
- [x] Document current and target data flow.
- [x] Decide state-management strategy.
- [x] Decide legacy storage migration strategy.
- [x] Define completion criteria and progress reporting.
- [x] Validate documentation consistency.
- [x] Commit the blueprint.

## Phase 2: Safety net

Status: **verified**

- [x] Add ESLint and formatting with one isolated baseline formatting pass.
- [x] Add a browser E2E runner and critical navigation smoke tests.
- [x] Add storage migration contract tests before changing the key.
- [x] Add automated module-boundary checks.
- [x] Add CI for test, build, lint, formatting, boundaries, E2E, and dependency audit.

## Phase 3: Shared foundation and ALUSNA identity

Status: **verified**

- [x] Add centralized ALUSNA brand configuration.
- [x] Implement tested CIKP-to-ALUSNA storage migration.
- [x] Update visible identity, slogan, favicon, metadata, structured data, and exports.
- [x] Move generic UI primitives and helpers into `shared`.

## Phase 4: Incremental feature migration

Status: **verified**

- [x] Migrate color feature and public API.
- [x] Migrate typography feature and public API.
- [x] Split design-system generation from serializers and migrate it.
- [x] Migrate Brand Kit last as an integration feature.

## Phase 5: App shell, routing, SEO, and monetization

Status: **verified**

- [x] Extract app providers and layout.
- [x] Extract browser routing/history.
- [x] Extract SEO lifecycle and retain all public paths.
- [x] Add required trust/legal pages before third-party ad scripts.
- [x] Validate transparent advertising placement.

## Phase 6: Final hardening

Status: **verified**

- [x] Run unit, E2E, build, audit, accessibility, responsive, and SEO checks.
- [x] Compare bundle and behavior against baseline.
- [x] Remove temporary adapters only after their consumers are migrated.
- [x] Finalize maintenance documentation.

## Phase 7: Launch and organic growth foundation

Status: **verified**

- [x] Add a dedicated homepage with visible links to every public tool.
- [x] Add unique evergreen guidance and contextual related-tool links.
- [x] Add a privacy-first analytics boundary with no default network transmission.
- [x] Expand route, SEO, content, responsive, and browser coverage.
- [x] Document remaining external launch work for domain, hosting, Search Console, and ads.

## Phase 11: Component Kit foundation

Status: **verified**

- [x] Extract the component playground from the monolithic Design System screen.
- [x] Add token-driven Button, Badge, Input, Select, Checkbox, Switch, and Alert examples.
- [x] Cover variant, size, disabled, focus, feedback, and interaction states in the preview.
- [x] Show the active token map and a copyable CSS handoff snippet beside the live preview.
- [x] Extend component color aliases and add unit/E2E coverage for the kit workflow.

Next expansion after this foundation: validate the kit with real designer workflows before adding
framework-specific exports. Keep cloud projects, authentication, and a public package out of scope
until there is evidence of demand.

## Phase 12: Component Kit interaction patterns

Status: **verified**

- [x] Add an Overlays category with accessible Tabs, Dialog, and Toast examples.
- [x] Keep interaction state local to the playground and reuse the shared toast provider.
- [x] Expose token mapping and copyable CSS snippets for overlay patterns.
- [x] Cover opening, closing, tab selection, and toast feedback in browser tests.

Next expansion: validate the kit with real designer workflows before adding a downloadable
component package or framework-specific code export.

## Phase 13: Framework handoff snippets

Status: **verified**

- [x] Add CSS, Tailwind, and React handoff formats to the Component Kit inspector.
- [x] Keep generated snippets deterministic, token-driven, and safe for sanitized system names.
- [x] Preserve one-click copy behavior across all handoff formats.
- [x] Cover format switching and generated output in the Design System E2E workflow.

Next expansion: observe real handoff usage before introducing downloadable packages or additional
framework adapters.

## Phase 14: Workflow validation gate

Status: **in progress**

- [x] Address initial radius feedback: connect the base-radius slider to existing Component Kit
      previews and CSS/Tailwind/React handoff; distinguish button size from corner rounding.
- [ ] Collect feedback from at least three real designer–developer handoff workflows.
- [ ] Measure which snippet formats are copied and where output needs context or escaping.
- [ ] Decide whether a downloadable package is justified by repeated usage.
