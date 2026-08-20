# ADR 001: Feature-Based Modular Architecture

- Status: Accepted
- Date: 2026-08-21

## Context

The current application is a small client-only React product with four product areas. Generic folders have allowed domain logic, UI, and infrastructure responsibilities to accumulate in large files.

## Decision

Adopt feature-based modules with `app`, `features`, `shared`, and `store` as top-level boundaries. Each feature exposes a public API. Migration will be incremental and behavior-preserving.

## Why

- Product changes are normally organized around a tool or user capability.
- Feature ownership makes related tests, UI, services, and models easier to locate.
- The approach avoids the boilerplate of strict enterprise Clean Architecture.
- Existing pure utilities can be moved without being rewritten.

## Consequences

- Temporary adapters and old/new folder coexistence are allowed during migration.
- Cross-feature imports must be reviewed.
- A future boundary-checking tool should enforce the documented dependency direction.

