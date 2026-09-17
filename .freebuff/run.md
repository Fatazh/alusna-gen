# Run Doc — ALUSNA (Vite app) for Preview

## Reproduce artifacts

- Node 22 (see `.nvmrc`; `engines` requires `>=22 <23`).
- Install dependencies: `npm install` (npm; lockfile is `package-lock.json`).
- Env files are NOT required for dev mode. Only templates exist: `.env.example`, `.env.production.example`. If a fresh worktree needs them, copy from the main checkout and adapt values — never commit secrets.
- `npm install` also links the npm workspace package `@alusna/shared` (in `packages/shared/`) via `node_modules/@alusna`.

## Run the server

- Command: `npm run dev` (vite, `vite.config.ts` pins `server.port = 5173`).
- URL: `http://localhost:5173/`
- Default port 5173; if taken, free ports 5174+ are auto-suggested by Vite — prefer picking a free port explicitly instead.
- Explicit free port (used when 5173 is occupied, e.g. by another thread's server): `npm run dev -- --port 5174` (via Start-Process, add `'--','--port','5174'` to the ArgumentList).
- Detached start (Windows PowerShell, stdout/stderr to different files):
  `powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev' -RedirectStandardOutput '<log>' -RedirectStandardError '<log>.err' -WindowStyle Hidden -PassThru).Id"`
- Verify: `Get-Process -Id <pid>` alive, then `curl http://localhost:5173/` answers HTTP 200.
