import { expect, test } from "@playwright/test";
import { SEO_PAGES, TRUST_PAGES } from "../src/app/router/routes";
import {
  ALUSNA_STUDIO_STORAGE_KEY,
  LEGACY_STUDIO_STORAGE_KEY,
} from "../src/store/migrations/studioStorage";

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

test.describe("trust and legal routes", () => {
  for (const route of TRUST_PAGES) {
    test(`${route.path} renders crawlable policy content`, async ({ page }) => {
      await page.goto(`${route.path}/`);

      await expect(page).toHaveTitle(route.title);
      await expect(page.getByRole("heading", { name: route.heading, level: 1 })).toBeVisible();
      const structuredData = JSON.parse(
        String(await page.locator("#alusna-structured-data").textContent()),
      );
      expect(structuredData["@type"]).toBe("WebPage");
    });
  }
});

test("footer navigates between a tool and privacy information", async ({ page }) => {
  await page.goto("/contrast-checker/");
  await page.getByRole("link", { name: "Privasi", exact: true }).click();
  await expect(page).toHaveURL(/\/privasi\/?$/);
  await expect(page.getByRole("heading", { name: "Kebijakan Privasi", level: 1 })).toBeVisible();

  await page.getByRole("tab", { name: /Warna/ }).click();
  await expect(page).toHaveURL(/\/contrast-checker\/?$/);
});

test("configured sponsor placement is explicit and links to disclosure", async ({ page }) => {
  test.skip(
    !process.env.VITE_SPONSOR_URL || !process.env.VITE_SPONSOR_TITLE,
    "Sponsor configuration is optional.",
  );

  await page.goto("/color-palette-generator/");
  const placement = page.locator('[data-ad-placement="tool-top"]');
  await expect(placement).toBeVisible();
  await expect(placement.getByText("Iklan / Sponsor", { exact: true })).toBeVisible();
  await expect(placement.getByRole("link", { name: "Kunjungi sponsor" })).toHaveAttribute(
    "rel",
    /sponsored/,
  );
  await expect(
    placement.getByRole("link", { name: "Cara ALUSNA menangani iklan dan afiliasi" }),
  ).toHaveAttribute("href", "/kebijakan-iklan");
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

test("ALUSNA identity and structured data are present", async ({ page }) => {
  await page.goto("/color-palette-generator/");

  await expect(page.getByText("ALUSNA", { exact: true })).toBeVisible();
  await expect(page.getByText("Bagusnya dimulai di sini.", { exact: true })).toBeVisible();
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", "/favicon.svg");

  const structuredData = JSON.parse(
    String(await page.locator("#alusna-structured-data").textContent()),
  );
  expect(structuredData.brand).toEqual({ "@type": "Brand", name: "ALUSNA" });
  expect(structuredData.isAccessibleForFree).toBe(true);
});

test("color tool navigation preserves the selected color in the share URL", async ({ page }) => {
  await page.goto("/color-palette-generator/?c=%23FF0000");

  await page.getByRole("tab", { name: /Contrast/ }).click();
  await expect(page).toHaveURL(/\/contrast-checker\/?\?c=%23FF0000$/);
  await expect(page.getByRole("heading", { name: "WCAG Color Contrast Checker" })).toBeVisible();
});

test("legacy CIKP storage migrates to ALUSNA without deleting the rollback copy", async ({
  page,
}) => {
  const legacyValue = JSON.stringify({ state: { theme: "light" }, version: 0 });
  await page.addInitScript(({ legacyKey, value }) => localStorage.setItem(legacyKey, value), {
    legacyKey: LEGACY_STUDIO_STORAGE_KEY,
    value: legacyValue,
  });

  await page.goto("/color-palette-generator/");
  await expect(page.locator("html")).not.toHaveClass(/dark/);

  const stored = await page.evaluate(
    ({ targetKey, legacyKey }) => ({
      target: localStorage.getItem(targetKey),
      legacy: localStorage.getItem(legacyKey),
    }),
    { targetKey: ALUSNA_STUDIO_STORAGE_KEY, legacyKey: LEGACY_STUDIO_STORAGE_KEY },
  );

  expect(JSON.parse(String(stored.target))).toEqual({ state: { theme: "light" }, version: 1 });
  expect(stored.legacy).toBe(legacyValue);
});
