# ADR 012: Build-Time Google Fonts Catalog

- Status: Accepted
- Date: 2026-08-26

## Context

Typography previously used a hand-maintained list of 30 Google Fonts. Calling the Google Fonts
Developer API from React would expose its key, consume quota from untrusted clients, add a runtime
network dependency, and conflict with ALUSNA's low-maintenance browser-local direction.

## Decision

- Keep a validated generated catalog inside the Typography feature.
- Synchronize metadata explicitly with a Node script and an unprefixed
  `GOOGLE_FONTS_API_KEY` shell or CI secret.
- Retain the committed snapshot when the key, network, response structure, or minimum valid-family
  threshold fails.
- Default synchronization to the 300 most popular families and cap it at 1,000.
- Load only the selected or intentionally previewed family through the keyless Google Fonts CSS API.
- Cache requests by complete CSS URL so different weights and italic styles are not accidentally
  treated as the same resource.

## Consequences

- Users can search and filter a large catalog without receiving an API key.
- The application remains usable when Google Fonts metadata services are unavailable.
- Font rendering still sends a request to Google when a Google family is selected; the Privacy page
  and README continue to disclose this behavior.
- Updating the catalog is a deliberate generated-data commit, not an uncontrolled runtime mutation.
