# ADR 007: Feature Public Entry Points

- Status: Accepted
- Date: 2026-08-22

## Context

The final compatibility facades under `src/lib` kept the store away from feature UI, but obscured
ownership. Re-exporting domain logic and lazy UI loaders from the same barrel can also create a
store-to-UI cycle or change production chunking when the store imports that barrel.

## Decision

Use three explicit public entry roles where needed:

- `index.ts` is the supported cross-feature API;
- `domain.ts` exposes framework-independent types and pure functions to `app` and `store`;
- `loaders.ts` exposes lazy UI module loaders only to the app composition layer.

Dependency-cruiser enforces that the store cannot reach feature UI or private implementation paths.
The app may use only these public entries, and features still consume another feature through its
root `index.ts`.

## Consequences

- `src/lib/color.ts`, `src/lib/font.ts`, and the root `src/App.tsx` compatibility entry can be removed.
- The store depends on a named domain contract instead of an ambiguous legacy facade.
- Lazy UI remains outside the store dependency graph.
- A new public sub-entry requires an architectural decision and boundary-rule update; arbitrary
  deep imports remain forbidden.
