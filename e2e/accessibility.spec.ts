import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Automated accessibility gate (axe-core, WCAG 2.1 AA + best practice) for the
 * main public pages. Violations fail CI; new pages are picked up from routes.
 *
 * Exclusion policy (deliberate, keep this list short and reviewed):
 * - `[data-user-palette-preview]` — content the product RENDERS ON TOP of a
 *   user-chosen color (shade rows, mockups, simulation output). The tool's
 *   whole purpose is to show text on arbitrary colors, so its contrast is the
 *   subject under test, not a defect of the site chrome. The surrounding
 *   labels and controls stay fully in scope.
 * - Animations: audit runs after the entrance transition settles so axe does
 *   not sample mid-fade (transient false positives).
 */

const routesSource = readFileSync(
  resolve(import.meta.dirname, "../src/app/router/routes.ts"),
  "utf8",
);
const toolPaths = [...routesSource.matchAll(/path: "(\/[a-z0-9-]+)"/g)].map((m) => m[1]);

const MAIN_PAGES = ["/", ...toolPaths, "/tentang", "/privasi"];

const pages = [
  ...MAIN_PAGES.map((path) => ({ path, name: `id ${path}` })),
  ...MAIN_PAGES.map((path) => ({ path: `/en${path === "/" ? "" : path}`, name: `en ${path}` })),
];

// Every shipped theme must pass (antislop R-34): light and dark both audited.
// The theme toggle's accessible label is locale-dependent.
const THEMES = [
  { toggle: null, name: "light" },
  { toggle: /Gunakan tema gelap|Use dark theme/, name: "dark" },
] as const;

for (const page of pages) {
  for (const theme of THEMES) {
    test(`axe: no WCAG A/AA violations on ${page.name} (${theme.name})`, async ({
      page: playwrightPage,
    }) => {
      await playwrightPage.goto(page.path);
      await expect(playwrightPage.getByRole("heading", { level: 1 })).toBeVisible();
      if (theme.toggle) {
        await playwrightPage.getByRole("button", { name: theme.toggle }).click();
      }
      await playwrightPage.waitForTimeout(400);

      const results = await new AxeBuilder({ page: playwrightPage })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
        .exclude("[data-user-palette-preview]")
        .analyze();

      const violations = results.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        help: violation.help,
        nodes: violation.nodes.slice(0, 5).map((node) => node.target.join(" ")),
      }));

      // The failure message lists every violation with its selectors so the fix
      // is actionable directly from CI output.
      expect(violations).toEqual([]);
    });
  }
}
