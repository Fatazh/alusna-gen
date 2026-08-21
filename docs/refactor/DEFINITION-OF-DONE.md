# Definition of Done

## Every refactor task

A task is complete only when:

- its behavior and non-goals are stated;
- the change respects documented module boundaries;
- user data and public URLs remain compatible;
- relevant tests are added or updated;
- targeted tests pass;
- TypeScript production build passes;
- no new unsafe handling of user-controlled input is introduced;
- documentation and `STATUS.md` reflect the result;
- the diff contains no unrelated cleanup;
- the change is committed as one coherent step.

## Feature migration

In addition to the common criteria:

- the feature exposes an intentional public API;
- external consumers do not import its internal folders;
- pure domain logic is separated from React rendering;
- browser APIs are isolated in a service or app boundary;
- old adapters remain only when a known consumer still needs them;
- manual and automated smoke checks confirm unchanged user behavior.

## Persistence change

In addition to the common criteria:

- schema version and source/target keys are explicit;
- valid legacy data migrates;
- corrupt legacy data fails safely;
- migration is idempotent;
- existing target data wins over legacy data;
- rollback does not require deleting the legacy key;
- storage limits and sanitization remain enforced.

## Phase completion

A phase reaches `verified` only after:

- `npm test` passes;
- `npm run build` passes;
- `npm run lint`, `npm run format:check`, and `npm run check:boundaries` pass;
- relevant Playwright E2E checks pass;
- `npm audit --omit=dev` has no production vulnerability, or an accepted risk is documented;
- phase-specific browser or output checks pass;
- roadmap and status are updated;
- the worktree is committed and clean.
