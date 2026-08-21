# ADR 005: ALUSNA Brand and Shared Foundation

- Status: Accepted
- Date: 2026-08-21

## Context

CIKP identity strings, internal events, SEO titles, structured data, export attribution, and loading copy were distributed across application files. Generic UI primitives also lived beside feature-specific color components.

## Decision

Use `shared/config/brand.ts` as the runtime source of truth for ALUSNA identity and internal app events. Keep unavoidable bootstrap HTML text aligned through tests and search checks. Move framework-generic UI primitives and the class-name helper under `shared`, while leaving ColorPicker and Swatch for the Phase 4 color migration.

## Consequences

- Runtime identity changes have one owned configuration module.
- Static `index.html` and `favicon.svg` remain build-entry assets and must be reviewed with brand changes.
- `shared` remains independent of app and feature modules.
- Feature-specific components will move with their owning features instead of being mislabeled as generic UI.
