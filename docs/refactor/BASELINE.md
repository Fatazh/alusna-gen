# Refactor Baseline

Recorded on 2026-08-21 before architectural migration.

## Repository

- Git initialized on branch `main`.
- Pre-refactor snapshot: `10a9f8e chore: capture pre-refactor baseline`.
- Generated output, dependencies, environment files, and TypeScript build artifacts are ignored.

## Application profile

- React 18, TypeScript, Vite, Tailwind CSS, Zustand, and Vitest.
- Client-only application; no backend, account system, or database.
- 47 TypeScript/TSX/CSS/SVG source files and approximately 8,790 source lines, including tests.
- Eleven static SEO tool routes are emitted during production build.
- User data is persisted under the localStorage key `cikp-studio`.

## Baseline validation

| Check                             | Result                                          |
| --------------------------------- | ----------------------------------------------- |
| `npm test`                        | 87 tests passed across 7 files                  |
| `npm run build`                   | Passed with Vite 8.2.0                          |
| `npm audit --omit=dev`            | 0 production vulnerabilities                    |
| Static route output               | 11 nested tool pages plus root and `robots.txt` |
| Git worktree before documentation | Clean after baseline commit                     |

## Missing safety tooling

- No ESLint command.
- No formatter command.
- No browser E2E suite.
- No CI workflow.
- No automated dependency-boundary enforcement.

These are known gaps. They will be introduced before high-risk module migration.

## High-complexity files

| File                                   | Approximate lines | Main concern                                                       |
| -------------------------------------- | ----------------: | ------------------------------------------------------------------ |
| `src/lib/designSystem.ts`              |               755 | Design-system and Brand Kit domains plus multiple serializers      |
| `src/modules/font/FontModule.tsx`      |               509 | UI, font loading, upload, preview, and export concerns             |
| `src/modules/brand/BrandKitModule.tsx` |               479 | Orchestration, local form state, import, save, and export          |
| `src/modules/brand/PaletteTab.tsx`     |               477 | Large presentation component with brand-state behavior             |
| `src/modules/color/MatchingModule.tsx` |               456 | Feature UI and matching presentation                               |
| `src/App.tsx`                          |               420 | App shell, navigation, URL state, SEO DOM updates, and composition |
