# Architecture Overview

## Objective

Make ALUSNA easy to maintain through explicit module ownership, stable public APIs, testable domain logic, and incremental migration without breaking saved user data or indexed URLs.

## Current architecture

```text
main.tsx
  -> App.tsx
       -> lazy feature modules
       -> shared components
       -> seoPages.ts
       -> studio.ts

feature modules
  -> src/lib domain utilities
  -> src/components shared UI
  -> studio.ts shared state

studio.ts
  -> color and font utilities
  -> Zustand localStorage persistence
```

Current strengths:

- Framework-independent color and design-system calculations already exist.
- Feature modules are lazy-loaded.
- Persistence input is sanitized.
- Main domain utilities have unit-test coverage.
- Static SEO pages are produced at build time.

Current pressure points:

- `App.tsx` owns composition, navigation, browser history, metadata, structured data, layout, and keyboard shortcuts.
- `studio.ts` combines navigation, color, palette, font, theme, and Brand Kit state.
- The generic `lib` directory mixes several domains and infrastructure concerns.
- Feature modules import internal files directly instead of exposing stable public APIs.
- Several files exceed 400 lines and combine UI with orchestration or serialization.
- There is no automated boundary check or browser-level regression suite.

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

