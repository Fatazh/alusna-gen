# ADR 010: Bilingual Routing and SEO

- Status: Accepted
- Date: 2026-08-24

## Context

ALUSNA needs English product copy for a global designer and developer audience without discarding
the existing Indonesian URLs and their local search relevance. A client-only language preference on
one URL would not provide stable, independently indexable pages for both languages.

## Decision

- Keep Indonesian as the default locale on every existing public URL.
- Publish English equivalents under `/en`, preserving the same tool slugs.
- Use localized English trust paths under `/en/about`, `/en/privacy`, `/en/terms`, and
  `/en/advertising-policy`.
- Switch language explicitly from the header and map to the same logical page; do not redirect based
  on browser language or persisted preference.
- Give each localized page a self-referencing canonical URL and reciprocal `hreflang` links for
  `id`, `en`, and `x-default`.
- Emit both locales as static HTML and include reciprocal language alternatives in the sitemap.
- Share feature components and persisted product state across locales; localization must not
  duplicate feature implementations or alter storage schemas.

## Consequences

- Existing Indonesian URLs and bookmarks remain valid.
- Search engines can index and associate both language variants without treating the switcher as a
  hidden client-only variant.
- Public-page count increases from 16 to 32 and every new public page requires localized metadata,
  crawlable guidance, and regression coverage.
- New user-facing copy must be added in both languages; untranslated fallback strings remain an
  editorial risk that should be checked during feature review.
