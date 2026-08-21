import { expect, test } from "@playwright/test";
import { SEO_PAGES } from "../src/lib/seoPages";

test.describe("public tool routes", () => {
  for (const route of SEO_PAGES) {
    test(`${route.path} renders its tool heading`, async ({ page }) => {
      await page.goto(`${route.path}/`);

      await expect(page).toHaveTitle(route.title);
      await expect(page.getByRole("heading", { name: route.heading, level: 1 })).toBeVisible();
      await expect(page.locator("#boot-error")).toBeHidden();
    });
  }
});

test("top-level navigation updates the URL and supports browser history", async ({ page }) => {
  await page.goto("/color-palette-generator/");

  await page.getByRole("tab", { name: /Font/ }).click();
  await expect(page).toHaveURL(/\/font-pairing\/?$/);
  await expect(
    page.getByRole("heading", { name: "Font Pairing dan Typography Preview" }),
  ).toBeVisible();

  await page.getByRole("tab", { name: /Design System/ }).click();
  await expect(page).toHaveURL(/\/design-token-generator\/?$/);

  await page.goBack();
  await expect(page).toHaveURL(/\/font-pairing\/?$/);
  await expect(page.getByRole("tab", { name: /Font/ })).toHaveAttribute("aria-selected", "true");
});

test("color tool navigation preserves the selected color in the share URL", async ({ page }) => {
  await page.goto("/color-palette-generator/?c=%23FF0000");

  await page.getByRole("tab", { name: /Contrast/ }).click();
  await expect(page).toHaveURL(/\/contrast-checker\/?\?c=%23FF0000$/);
  await expect(page.getByRole("heading", { name: "WCAG Color Contrast Checker" })).toBeVisible();
});
