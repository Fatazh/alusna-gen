// One-off browser-console capture against the running Vite dev server.
// Not part of the e2e suite; run manually with: node scripts/debug-probe.mjs
import { chromium } from "@playwright/test";

const BASE = "http://localhost:5173";
const ROUTES = [
  "/",
  "/en/",
  "/color-palette-generator/",
  "/gradient-generator/",
  "/font-pairing/",
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const errors = [];
const consoleWarnings = [];

page.on("console", (msg) => {
  const line = `[${msg.type()}] ${msg.text()}`;
  if (msg.type() === "error") errors.push({ page: page.url(), line });
  if (msg.type() === "warning") consoleWarnings.push({ page: page.url(), line });
});
page.on("pageerror", (err) => errors.push({ page: page.url(), line: err.message }));

for (const route of ROUTES) {
  try {
    const res = await page.goto(`${BASE}${route}`, { waitUntil: "networkidle", timeout: 30000 });
    if (!res || res.status() >= 400) {
      errors.push({ page: route, line: `HTTP ${res?.status()} for ${route}` });
    }
  } catch (e) {
    errors.push({ page: route, line: `NAVIGATION_ERROR: ${e.message}` });
  }
  // allow microtasks/timers to flush
  await page.waitForTimeout(500);
}

await browser.close();

console.log("\n=== DEBUG PROBE RESULTS ===");
console.log(`Routes checked: ${ROUTES.length}`);
console.log(`Page/console errors: ${errors.length}`);
console.log(`Console warnings: ${consoleWarnings.length}`);

if (errors.length) {
  console.log("\n--- ERRORS ---");
  for (const e of errors) console.log(`[${e.page}] ${e.line}`);
}
if (consoleWarnings.length && process.env.SHOW_WARNINGS) {
  console.log("\n--- WARNINGS ---");
  for (const w of consoleWarnings) console.log(`[${w.page}] ${w.line}`);
} else {
  console.log(`(warnings hidden; set SHOW_WARNINGS=1 to see ${consoleWarnings.length})`);
}

process.exit(errors.length ? 1 : 0);
