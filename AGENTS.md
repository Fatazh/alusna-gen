# ALUSNA Engineering Rules

## Product direction

ALUSNA is a browser-based toolkit for color, typography, design tokens, and brand kits. The brand slogan is **"Bagusnya dimulai di sini."** The near-term business strategy is evergreen SEO and transparent advertising; paid features are intentionally deferred.

## Required reading before changes

Read these files before starting architectural work:

1. `docs/refactor/STATUS.md`
2. `docs/refactor/ROADMAP.md`
3. `docs/architecture/overview.md`
4. The relevant record under `docs/decisions/`

Update `STATUS.md` whenever a refactor task changes state or creates a new risk.

## Working rules

- Use small, reversible changes. Do not perform a big-bang rewrite.
- Preserve current behavior unless the task explicitly changes product behavior.
- Do not remove or rename a public URL without a redirect and SEO review.
- Do not rename or discard persisted browser data without a tested migration.
- Keep user-controlled values sanitized in imports, storage, generated code, and generated HTML.
- Keep image extraction and user uploads browser-local unless a future requirement explicitly introduces a server.
- Do not mix unrelated cleanup into a feature migration.
- One commit should represent one coherent architectural step.

## Target dependency direction

```text
app -> features -> shared
app -----------> shared
store ---------> shared
```

- `shared` must not import from `features` or `app`.
- A feature must not import another feature's internal files.
- Cross-feature access must use that feature's public `index.ts` API or an app-level composition layer.
- Domain logic should be framework-independent and covered by unit tests.
- React components should not contain serialization, storage migration, or SEO DOM manipulation.
- Zustand is for genuinely shared or persisted state. Component-local state stays local.

## Validation commands

Run targeted tests while editing, then run all required checks before completing a phase:

```sh
npm run lint
npm run format:check
npm run check:boundaries
npm test
npm run build
npm run test:e2e
npm audit --omit=dev
```

Use `npm run check` for the local static, unit, boundary, and build gate. Run E2E separately because it starts a production preview and requires the Playwright Chromium binary.

## Completion report

Every completed task must record:

- objective;
- files changed;
- decisions made;
- validation performed;
- remaining risks;
- next planned task.
