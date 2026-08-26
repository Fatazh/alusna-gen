# ADR 011: Production Launch Hardening

- Status: Accepted
- Date: 2026-08-26

## Context

The ordinary Vite build intentionally works without a public domain so local tests can run, but that
also allowed a deployable-looking artifact to omit sitemap, canonical, and bilingual `hreflang`
metadata. The repository documented Node 20 even though the architecture gate requires Node 22.
The HTML bootstrap also required executable inline script permission.

## Decision

- Standardize development and CI on Node 22.x.
- Keep `npm run build` for local validation and add `npm run build:production` as the release gate.
- Fail the release gate when the production origin is not HTTPS, placeholders remain, or the public
  contact email is missing or invalid.
- Verify sitemap, robots, canonical, and reciprocal language metadata after the production build.
- Move bootstrap error handling to a same-origin script and remove `'unsafe-inline'` from production
  `script-src`.
- Provide deployable header rules for hosts that support `_headers` and an Nginx reference, while
  requiring verification against the real host.

## Consequences

- A developer can still build and test without knowing the final domain.
- A production artifact cannot pass the release command without explicit launch configuration.
- Inline React styles still require `style-src 'unsafe-inline'`; removing that permission is a
  separate presentation refactor.
- Server header files are platform-dependent and must be confirmed after deployment.
