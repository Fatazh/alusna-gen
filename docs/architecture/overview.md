# Architecture Overview

## Objective

Make ALUSNA easy to maintain through explicit module ownership, stable public APIs, testable domain logic, and incremental migration without breaking saved user data or indexed URLs.

## Current architecture

```text
main.tsx
  -> app/StudioApp.tsx
       -> feature loaders.ts entries
            -> feature UI
       -> feature domain.ts entries
       -> shared UI/config
       -> app home/content/router/SEO/trust/analytics/monetization
       -> studio.ts

feature UI
  -> owning feature model/services
  -> other feature public index.ts APIs
  -> shared UI
  -> studio.ts shared state

studio.ts
  -> feature domain.ts entries
  -> Zustand localStorage persistence
```

Current strengths:

- Color, typography, design-system, and Brand Kit have explicit feature ownership and public APIs.
- Framework-independent domain calculations and serializers are separated from React UI.
- Feature modules are lazy-loaded.
- UI lazy loaders and framework-independent domain APIs have separate entry points.
- Persistence input is sanitized.
- Domain utilities, serializers, and migration contracts have unit-test coverage.
- Static SEO pages are produced at build time.
- Homepage and tool guidance are included in built HTML as a crawlable no-JavaScript fallback.
- Analytics is an opt-in, provider-neutral app boundary with no default network transmission.
- Dependency-cruiser enforces cross-feature public API access.

Current pressure points:

- `StudioApp.tsx` remains the intentional composition root, while routing, SEO, providers, layout,
  trust, and monetization lifecycles have separate owners.
- `studio.ts` still combines color, palette, font, theme, and Brand Kit durable state; domain slices
  should be introduced only when a feature change needs an independent lifecycle.
- Several large React tools remain candidates for UI-only decomposition, but no longer own domain serialization.

## Target architecture

```text
src/
  app/
    analytics/
    content/
    config/
    home/
    layout/
    providers/
    router/
    seo/
  features/
    color/
      model/
      services/
      ui/
      domain.ts
      index.ts
      loaders.ts
    typography/
      model/
      services/
      ui/
      domain.ts
      index.ts
      loaders.ts
    design-system/
      model/
      services/
      ui/
      index.ts
      loaders.ts
    brand-kit/
      model/
      services/
      ui/
      index.ts
      loaders.ts
  shared/
    config/
    lib/
    types/
    ui/
  store/
    migrations/
    persistence/
    studio.ts
  main.tsx
```

This is a feature-based modular architecture, not a multi-layer enterprise rewrite. Extra layers are added only when they isolate a real responsibility.

## Dependency rules

1. `shared` is independent of product features.
2. Features may import `shared`.
3. `app` composes features through `domain.ts`, `index.ts`, or `loaders.ts` public entries.
4. Features do not import another feature's private folders.
5. Store modules may use feature-owned serializable types and pure functions through `domain.ts`,
   but never feature UI or loaders.
6. Browser APIs are isolated behind app, persistence, or service modules.
7. Pure calculations and serializers do not depend on React or Zustand.
8. External analytics and advertising providers must stay outside tool domain logic and require a
   separate privacy, CSP, consent, and regional review.

## Completed migration order

1. Shared configuration and UI primitives.
2. Color domain and tools.
3. Typography domain and tools.
4. Design-system generation and serializers.
5. Brand Kit as the integration feature.
6. App shell, routing, SEO, hardening, and compatibility-adapter removal.

Brand Kit moves last because it consumes color, typography, design-system, storage, import, and export behavior.

Maintenance procedures are documented in [maintenance.md](maintenance.md). Public-entry details are
recorded in [ADR 007](../decisions/007-feature-public-entry-points.md). The organic-growth and
measurement boundary is recorded in [ADR 008](../decisions/008-organic-growth-foundation.md).
