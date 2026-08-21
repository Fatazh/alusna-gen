# ADR 004: Automated Quality Gates

- Status: Accepted
- Date: 2026-08-21

## Context

Unit tests and TypeScript builds protected domain logic, but there was no consistent formatting, linting, browser regression coverage, dependency-boundary enforcement, or CI.

## Decision

Use:

- ESLint for TypeScript, React Hooks, and React Refresh rules;
- Prettier for deterministic formatting;
- dependency-cruiser for circular dependency and target-layer rules;
- Vitest for unit and contract tests;
- Playwright Chromium for public route and navigation E2E tests;
- GitHub Actions on Node 22 for the complete validation pipeline.

Unit and browser tests have separate file scopes: Vitest excludes `e2e/**`, while Playwright owns that directory.

## Consequences

- A one-time formatting diff is accepted before architectural movement.
- New code must pass `npm run check` and relevant Playwright tests.
- The target-folder rules become effective incrementally as code moves into `app`, `features`, and `shared`.
- Browser installation is a local/CI setup step and is not committed to the repository.
