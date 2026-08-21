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

Status: **in-progress**

- [x] Extract app providers and layout.
- [x] Extract browser routing/history.
- [x] Extract SEO lifecycle and retain all public paths.
- [ ] Add required trust/legal pages before third-party ad scripts.
- [ ] Validate transparent advertising placement.

## Phase 6: Final hardening

Status: **planned**

- [ ] Run unit, E2E, build, audit, accessibility, responsive, and SEO checks.
- [ ] Compare bundle and behavior against baseline.
- [ ] Remove temporary adapters only after their consumers are migrated.
- [ ] Finalize maintenance documentation.
