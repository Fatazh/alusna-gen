# ADR 009: Swiss Modular Visual System

Status: Accepted  
Date: 2026-08-22

## Context

ALUSNA serves UI designers, but its previous indigo-and-glass presentation did not clearly express
the product's focus on color, typography, and reusable brand systems. A selected visual reference
established a Swiss modular workshop direction: neutral canvas, flat separators, large working
swatches, restrained primary colors, and compact utility navigation.

The implementation must preserve every public URL, existing browser data, crawlable page heading,
and tool behavior.

## Decision

- Use light gray and white surfaces, black editorial typography, cobalt primary actions, and
  magenta and amber as restrained supporting accents.
- Use Manrope for interface and display text and IBM Plex Mono for values, labels, and generated
  code.
- Use Phosphor icons instead of emoji or text-glyph substitutes in product controls.
- Make light mode the default only for new users. Respect persisted theme preferences unchanged.
- Keep the unique SEO heading and description above each tool workspace even where the visual
  reference places the tool title inside the workspace.
- Apply the direction through shared tokens and app-shell components first, then update the
  homepage and palette workspace as representative high-traffic surfaces.

## Consequences

- The shell and primary workflow now present a coherent design-tool identity without changing
  routes, serialization, exports, or persisted schema.
- Direct per-icon imports keep the icon dependency tree-shakeable, but the production entry chunk
  increases from 58.59 kB gzip to 66.16 kB gzip.
- Manrope and IBM Plex Mono currently load from Google Fonts. Offline use falls back to system
  fonts; self-hosting remains a possible privacy and resilience improvement.
- Deeper feature editors retain their existing information architecture while inheriting the new
  shared palette, typography, surfaces, and icon language.
