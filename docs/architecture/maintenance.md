# ALUSNA Maintenance Guide

## Where changes belong

| Change                                          | Owner                                        |
| ----------------------------------------------- | -------------------------------------------- |
| Tool calculations, validation, or serializers   | `src/features/<feature>/model` or `services` |
| Tool presentation and local form state          | `src/features/<feature>/ui`                  |
| Route catalog and browser history               | `src/app/router`                             |
| Runtime metadata and structured data            | `src/app/seo`                                |
| Homepage and evergreen guidance                 | `src/app/home` and `src/app/content`         |
| Anonymous measurement boundary                  | `src/app/analytics`                          |
| Header, footer, loading, and app-wide providers | `src/app/layout` and `providers`             |
| Durable cross-tool state and migration          | `src/store`                                  |
| Generic UI or helpers with no product ownership | `src/shared`                                 |

Do not put storage migration, serialization, generated HTML, or SEO DOM manipulation inside React
components.

## Adding or changing a tool

1. Keep domain logic framework-independent and add unit tests beside it.
2. Export cross-feature behavior from the owning `index.ts`.
3. Add a `loaders.ts` export only when the app must lazy-load new UI.
4. Add or update the route in `src/app/router/routes.ts` without renaming an existing public URL.
5. Update the static-page generator and sitemap inputs when a public route changes.
6. Add an E2E assertion for the heading, canonical URL, navigation, and primary workflow.

## Persisted data

- Treat `alusna-studio` version 1 and the retained `cikp-studio` rollback copy as compatibility
  contracts.
- Sanitize every imported or restored value before it reaches Zustand.
- Add a tested migration before changing a key, version, field name, limit, or data URL policy.
- Do not remove the legacy key without a separate product decision and rollback-window review.

## SEO and advertising

- Configure the production origin with `VITE_SITE_URL` before deployment.
- Keep every indexed route directly reachable and verify the host serves nested route files.
- Keep sponsor placement optional and visibly labeled. Do not add a third-party advertising script
  until its CSP, consent, privacy, and regional requirements are reviewed.
- Configure a real `VITE_CONTACT_EMAIL` before public launch.
- Keep `VITE_ANALYTICS_ENABLED` unset unless an approved consumer is intentionally connected. An
  external consumer requires a privacy, CSP, consent, and regional review before activation.
- When guidance changes, keep its static HTML contract and no-JavaScript E2E coverage passing.

## Validation

Run targeted tests while editing. Before merging or releasing, run:

```sh
npm run check
npm run test:e2e
npm audit --omit=dev
```

Release artifacts must use Node 22 and the stricter production gate:

```sh
npm run build:production
```

The command requires an HTTPS `VITE_SITE_URL` and a real `VITE_CONTACT_EMAIL`, then verifies every
emitted HTML page has canonical and reciprocal language metadata. Apply `public/_headers` on hosts
that support the headers-file convention, or adapt `deploy/nginx-security.conf.example` for Nginx.
Always verify the resulting response headers on the live HTTPS origin.

The optional configured-sponsor E2E should also run when sponsor environment variables change.

## Low-maintenance operating cadence

- Monthly: review failed CI, broken external sponsor links, Search Console coverage, and dependency
  advisories.
- Quarterly: run the full validation gate, verify all public routes on the production host, and
  review privacy/advertising text against the active provider setup.
- Before any release: confirm the production origin, contact channel, sitemap, robots file, nested
  route fallback behavior, and analytics/advertising consent configuration.

Evergreen SEO can reduce content-update frequency, but it does not make the product maintenance-free.
Browser changes, dependency advisories, search indexing, and advertising-policy changes still require
periodic review.
