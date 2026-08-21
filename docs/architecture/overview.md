# Architecture Overview

## Objective

Make ALUSNA easy to maintain through explicit module ownership, stable public APIs, testable domain logic, and incremental migration without breaking saved user data or indexed URLs.

## Current architecture

```text
main.tsx
  -> App.tsx compatibility entry
       -> app/StudioApp.tsx
       -> feature public lazy loaders
            -> feature UI
       -> shared UI/config
       -> app router/SEO/trust/monetization
       -> studio.ts

feature UI
  -> owning feature model/services
  -> other feature public index.ts APIs
  -> shared UI
  -> studio.ts shared state

studio.ts
  -> narrow color/font compatibility facades
  -> Zustand localStorage persistence
```

Current strengths:

- Color, typography, design-system, and Brand Kit have explicit feature ownership and public APIs.
- Framework-independent domain calculations and serializers are separated from React UI.
- Feature modules are lazy-loaded.
- Persistence input is sanitized.
- Domain utilities, serializers, and migration contracts have unit-test coverage.
- Static SEO pages are produced at build time.
- Dependency-cruiser enforces cross-feature public API access.

Current pressure points:

- `App.tsx` owns composition, navigation, browser history, metadata, structured data, layout, and keyboard shortcuts.
- `studio.ts` combines navigation, color, palette, font, theme, and Brand Kit state.
- Store persistence still uses narrow color/font compatibility facades until state boundaries are refined.
- Several large React tools remain candidates for UI-only decomposition, but no longer own domain serialization.

## Target architecture

```text
src/
  app/
    config/
    layout/
    providers/
    router/
    seo/
  features/
    color/
      model/
      services/
      ui/
      index.ts
    typography/
      model/
      services/
      ui/
      index.ts
    design-system/
      model/
      services/
      ui/
      index.ts
    brand-kit/
      model/
      services/
      ui/
      index.ts
  shared/
    config/
    lib/
    types/
    ui/
  store/
    migrations/
    persistence/
    slices/
    studio.store.ts
  main.tsx
```

This is a feature-based modular architecture, not a multi-layer enterprise rewrite. Extra layers are added only when they isolate a real responsibility.

## Dependency rules

1. `shared` is independent of product features.
2. Features may import `shared`.
3. `app` composes features and may import their public APIs.
4. Features do not import another feature's private folders.
5. Store slices may use shared types and feature-owned serializable domain types, but never feature UI.
6. Browser APIs are isolated behind app, persistence, or service modules.
7. Pure calculations and serializers do not depend on React or Zustand.

## Incremental migration order

1. Shared configuration and UI primitives.
2. Color domain and tools.
3. Typography domain and tools.
4. Design-system generation and serializers.
5. Brand Kit as the integration feature.
6. App shell, routing, and SEO cleanup after stable feature APIs exist.

Brand Kit moves last because it consumes color, typography, design-system, storage, import, and export behavior.
