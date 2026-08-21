# ADR 008: Organic Growth and Privacy-First Measurement

- Status: Accepted
- Date: 2026-08-22

## Context

ALUSNA's near-term business strategy depends on evergreen search traffic and transparent advertising,
while paid features remain deferred. A tool-only root route, JavaScript-only guidance, hidden internal
links, or premature tracking scripts would weaken discoverability, trust, and maintainability.

## Decision

- Use `/` as a dedicated ALUSNA homepage and preserve all existing public tool URLs.
- Link visibly from the homepage to every tool and add contextual related-tool links to each guide.
- Maintain one unique practical guide per tool from a typed, tested content catalog.
- Emit useful homepage and tool content into the built HTML so primary content and links remain
  available without JavaScript.
- Keep analytics provider-neutral and disabled unless `VITE_ANALYTICS_ENABLED=true` is explicitly
  configured.
- Allow only an anonymous `page_view` event containing the known page kind and canonical route path.
- Dispatch that event locally without cookies, identifiers, user-entered values, or network requests.
- Require a separate decision and privacy/CSP/consent review before connecting an external analytics
  or advertising provider.

## Consequences

- Search engines and no-JavaScript clients receive useful route-specific content directly from HTML.
- Content ownership stays centralized and testable, but stale guidance remains an editorial risk.
- The repository has a stable measurement boundary without claiming active analytics or revenue.
- Production growth still depends on a real domain, correct hosting behavior, indexing, content
  quality, and external account configuration.
