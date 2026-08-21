# Data Flow

## Current runtime flow

```text
URL path/query
  -> App.tsx resolves SEO page and active module
  -> lazy-loaded feature UI
  -> useStudio selectors/actions
  -> Zustand persist middleware
  -> versioned persistence adapter
       -> localStorage: alusna-studio
       -> one-time sanitized copy from cikp-studio when target is absent
```

Color selection is shared with typography and downstream generators. Brand Kit composes color choices, font choices, tone configuration, optional logo data, saved state, and multiple exports.

## Target runtime flow

```text
router
  -> app route configuration
  -> feature public entry
  -> feature UI/hook
  -> feature service or pure model
  -> store slice when cross-feature persistence is required
  -> versioned persistence adapter
```

## Browser boundaries

- Route/history manipulation belongs to `app/router`.
- Document title, canonical, Open Graph, and structured data belong to `app/seo`.
- localStorage access belongs to `store/persistence`.
- File parsing and downloads belong to feature services.
- Canvas/image pixel processing belongs to the color feature and remains local.
- Google Fonts network loading belongs to the typography service.

## Persistence migration contract

The active key is `alusna-studio` at schema version 1. The legacy `cikp-studio` key is read only when the target is absent and is retained as a rollback copy.

Migration requirements:

1. Read valid target data first.
2. If target data is absent, read and sanitize legacy CIKP data.
3. Write migrated data to the ALUSNA key only after validation succeeds.
4. Keep the legacy key during at least the first migration release so rollback remains possible.
5. Migration must be idempotent.
6. Corrupt or oversized data must fail safely without breaking application startup.
7. Unit tests cover valid, missing, corrupt, oversized, and already-migrated states; browser E2E verifies the live Zustand integration.

## Public URL contract

The existing eleven tool paths remain stable during architectural migration. A brand/domain change may update canonical origins, but feature paths should not change without a redirect plan.
