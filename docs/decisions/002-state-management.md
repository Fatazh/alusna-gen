# ADR 002: State Ownership and Zustand

- Status: Accepted
- Date: 2026-08-21

## Context

The current Zustand store combines navigation, theme, colors, palettes, uploaded fonts, and saved Brand Kits. Not all values need the same lifecycle or persistence policy.

## Decision

Retain Zustand, but split shared state by domain slices. Persist only durable user data. Keep transient feature UI state local to its feature. Centralize persistence limits, sanitization, schema versioning, and migration.

## Consequences

- No dependency migration to another state library is needed.
- Existing selectors and actions can move slice by slice.
- Stored data shapes become explicit compatibility contracts.
- Brand Kit may consume public state selectors from several slices but will not own those slices.
