# ADR 003: Storage and Rebrand Migration

- Status: Accepted
- Date: 2026-08-21

## Context

Rebranding from CIKP to ALUSNA would normally rename event identifiers and the `cikp-studio` localStorage key. Renaming the key directly would make existing user data appear lost.

## Decision

Introduce a versioned `alusna-studio` persistence key and a tested one-way copy migration from sanitized `cikp-studio` data. Retain the legacy key for rollback during the migration window. Internal event names may move to `alusna:*` only after listeners and tests are changed atomically.

## Consequences

- Rebranding cannot be implemented as blind search-and-replace.
- Migration code must precede switching the persistence key.
- Legacy cleanup is a later, explicit product decision.
