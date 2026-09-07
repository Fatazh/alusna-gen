import { expect, test } from "@playwright/test";
import {
  ENGLISH_HOME_PAGE,
  ENGLISH_SEO_PAGES,
  HOME_PAGE,
  SEO_PAGES,
  TRUST_PAGES,
} from "../src/app/router/routes";
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
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        new RegExp(`${route.path}/?$`),
      );
      await expect(page.locator("#boot-error")).toBeHidden();
      await expect(page.locator(`[data-evergreen-content="${route.path}"]`)).toBeVisible();
      await expect(
        page.getByRole("heading", { name: `Cara menggunakan ${route.heading}` }),
      ).toBeVisible();
    });
  }
});

test("homepage introduces ALUSNA and links visibly to every tool", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(HOME_PAGE.title);
  await expect(page.getByRole("heading", { name: HOME_PAGE.heading, level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Semua alat ALUSNA" })).toBeVisible();
  await expect(page.locator("h1")).toHaveCount(1);

  for (const route of SEO_PAGES) {
    await expect(page.locator(`a[href="${route.path}"]`).first()).toBeVisible();
  }

  const structuredData = JSON.parse(
    String(await page.locator("#alusna-structured-data").textContent()),
  );
  expect(structuredData["@type"]).toBe("WebSite");
});

test("production HTML uses an external bootstrap and blocks inline scripts", async ({ page }) => {
  await page.goto("/");

  const policy = await page
    .locator('meta[http-equiv="Content-Security-Policy"]')
    .getAttribute("content");
  expect(policy).toContain("script-src 'self';");
  expect(policy).not.toContain("script-src 'self' 'unsafe-inline'");
  await expect(page.locator('script[src="/boot.js"]')).toHaveCount(1);
  await expect(page.locator("#boot-error")).toBeHidden();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => {
    window.dispatchEvent(
      new ErrorEvent("error", {
        error: new EvalError("Responsive simulator CSP probe"),
        message: "Responsive simulator CSP probe",
      }),
    );
  });
  await expect(page.locator("#boot-error")).toBeHidden();

  await page.evaluate(() => {
    window.__showBootError?.("Temporary deployment error", "External preview tooling");
    window.__hideBootLoading?.();
  });
  await expect(page.locator("#boot-error")).toBeHidden();
});

test("homepage starts a tool workflow without a full reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Mulai dari palet warna" }).click();

  await expect(page).toHaveURL(/\/color-palette-generator\/?$/);
  await expect(
    page.getByRole("heading", { name: "Color Palette Generator Gratis", level: 1, exact: true }),
  ).toBeVisible();
});

test("Google Fonts catalog supports search, weights, and italic preview", async ({ page }) => {
  await page.goto("/font-pairing");

  await expect(page.locator("[data-google-font-catalog]")).toContainText("Google Fonts");
  await page.getByRole("searchbox", { name: "Cari Google Fonts" }).fill("Playfair Display");
  const playfair = page.getByRole("button").filter({ hasText: "Playfair Display" }).first();
  await expect(playfair).toBeVisible();
  await playfair.click();

  const weight = page.getByLabel(/Weight:/);
  const availableWeights = await weight.locator("option").allTextContents();
  expect(availableWeights.length).toBeGreaterThan(0);
  const selectedWeight = String(availableWeights.at(-1));
  await weight.selectOption(selectedWeight);
  await page.getByRole("button", { name: "Aktifkan gaya italic" }).click();

  await expect(page.getByText("font-family: 'Playfair Display'", { exact: false })).toBeVisible();
  await expect(page.getByText(`font-weight: ${selectedWeight}`, { exact: false })).toBeVisible();
  await expect(page.getByText("font-style: italic", { exact: false })).toBeVisible();
});

test("font pairing suggestions follow the selected family", async ({ page }) => {
  await page.goto("/font-pairing");
  await page.getByRole("searchbox", { name: "Cari Google Fonts" }).fill("Playfair Display");

  const playfair = page.getByRole("button").filter({ hasText: "Playfair Display" }).first();
  await playfair.click();

  const pairingSection = page
    .getByRole("heading", { name: "Saran Pasangan Font" })
    .locator("xpath=../../..");
  const suggestions = pairingSection.getByRole("button");
  await expect(suggestions).toHaveCount(3);
  for (const suggestion of await suggestions.all()) {
    await expect(suggestion).toContainText("Playfair Display");
  }

  await suggestions.nth(1).click();
  await expect(page.getByText("font-family: 'Playfair Display'", { exact: false })).toBeVisible();
});

test("language switch preserves the tool and updates bilingual SEO metadata", async ({ page }) => {
  await page.goto("/color-mixer");
  await page.getByRole("button", { name: "Use English" }).click();

  await expect(page).toHaveURL(/\/en\/color-mixer$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "Online Color Mixer", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Find a Color Recipe" })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/en\/color-mixer$/);
  await expect(page.locator('link[rel="alternate"][hreflang="id"]')).toHaveAttribute(
    "href",
    /\/color-mixer$/,
  );
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    "href",
    /\/en\/color-mixer$/,
  );

  await page.getByRole("button", { name: "Gunakan Bahasa Indonesia" }).click();
  await expect(page).toHaveURL(/\/color-mixer$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
});

test("built pages expose useful content without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto("/");
  await expect(page.getByRole("heading", { name: HOME_PAGE.heading, level: 1 })).toBeVisible();
  for (const route of SEO_PAGES) {
    await expect(page.getByRole("link", { name: route.heading, exact: true })).toBeVisible();
  }

  await page.goto(`${SEO_PAGES[0].path}/`);
  await expect(
    page.getByRole("heading", { name: `Cara menggunakan ${SEO_PAGES[0].heading}` }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Alat terkait" })).toBeVisible();

  await page.goto("/en/");
  await expect(
    page.getByRole("heading", { name: ENGLISH_HOME_PAGE.heading, level: 1 }),
  ).toBeVisible();
  for (const route of ENGLISH_SEO_PAGES) {
    await expect(page.getByRole("link", { name: route.heading, exact: true })).toBeVisible();
  }

  await page.goto(`${ENGLISH_SEO_PAGES[0].path}/`);
  await expect(
    page.getByRole("heading", { name: `How to use ${ENGLISH_SEO_PAGES[0].heading}` }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Related tools" })).toBeVisible();

  await context.close();
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

test("About exposes the v1.2.0 changelog in both languages", async ({ page }) => {
  await page.goto("/tentang/");
  await expect(page.getByText("v1.2.0", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Catatan perubahan" })).toBeVisible();
  await expect(page.getByText(/Rilis workspace desain v1.2/)).toBeVisible();

  await page.getByRole("button", { name: "Use English" }).click();
  await expect(page).toHaveURL(/\/en\/about$/);
  await expect(page.getByText("v1.2.0", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Changelog" })).toBeVisible();
  await expect(page.getByText(/Design workspace release v1.2/)).toBeVisible();
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
    page.getByRole("heading", {
      name: "Font Pairing dan Typography Preview",
      level: 1,
      exact: true,
    }),
  ).toBeVisible();

  await page.getByRole("tab", { name: /Design System/ }).click();
  await expect(page).toHaveURL(/\/design-token-generator\/?$/);

  await page.goBack();
  await expect(page).toHaveURL(/\/font-pairing\/?$/);
  await expect(page.getByRole("tab", { name: /Font/ })).toHaveAttribute("aria-selected", "true");
});

test("ALUSNA identity and structured data are present", async ({ page }) => {
  await page.goto("/color-palette-generator/");

  const homeLink = page.getByRole("link", { name: "Beranda ALUSNA" });
  const logo = homeLink.locator("img");
  await expect(homeLink).toBeVisible();
  await expect(logo).toHaveAttribute("src", "/logo.png");
  await page.getByRole("button", { name: "Gunakan tema gelap" }).click();
  await expect(logo).toHaveAttribute("src", "/logo.svg");
  await expect(logo).not.toHaveAttribute("style", /background/);
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
  await expect(
    page.getByRole("heading", {
      name: "WCAG Color Contrast Checker",
      level: 1,
      exact: true,
    }),
  ).toBeVisible();
});

test("representative tools do not overflow at mobile, tablet, or desktop widths", async ({
  page,
}) => {
  const cases = [
    { width: 390, height: 844, path: "/" },
    { width: 390, height: 844, path: "/color-palette-generator/" },
    { width: 390, height: 844, path: "/design-token-generator/" },
    { width: 1024, height: 768, path: "/brand-kit-generator/" },
    { width: 1024, height: 768, path: "/design-token-generator/" },
    { width: 1440, height: 900, path: "/design-token-generator/" },
  ];

  for (const current of cases) {
    await page.setViewportSize({ width: current.width, height: current.height });
    await page.goto(current.path);
    await expect(page.locator("h1")).toHaveCount(1);

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);

    const studioNavigation = page.getByRole("tablist", { name: "Modul studio" });
    const navigationDimensions = await studioNavigation.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(navigationDimensions.scrollWidth).toBeLessThanOrEqual(navigationDimensions.clientWidth);
    await expect(page.getByRole("button", { name: /Gunakan tema (gelap|terang)/ })).toBeVisible();
    for (const tabName of ["Warna", "Font", "Design", "Brand"]) {
      await expect(page.getByRole("tab", { name: new RegExp(tabName) })).toBeVisible();
    }

    if (current.path === "/color-palette-generator/") {
      const savedColorTarget = page.getByRole("button", {
        name: "Pilih warna tersimpan Indigo",
      });
      const privacyTarget = page.getByRole("link", { name: "Privasi", exact: true });
      expect((await savedColorTarget.boundingBox())?.height).toBeGreaterThanOrEqual(24);
      expect((await privacyTarget.boundingBox())?.height).toBeGreaterThanOrEqual(24);
    }
  }
});

test("Brand Kit exposes usable export previews", async ({ page }) => {
  await page.goto("/brand-kit-generator/");
  await page.getByRole("button", { name: "Export" }).click();

  await expect(page.getByRole("heading", { name: "Export Options" })).toBeVisible();
  await expect(page.getByRole("button", { name: /HTML Guidelines/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /W3C Design Tokens/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /Tailwind Config/ })).toBeEnabled();
  await expect(page.getByRole("heading", { name: "Preview" })).toBeVisible();
  await expect(page.getByText('"brandName": "My Brand"', { exact: false })).toBeVisible();
});

test("Design System builds modes, validates contrast, and exports current token formats", async ({
  page,
}) => {
  await page.goto("/design-token-generator/");

  await expect(page.getByRole("heading", { name: "Generator Token & Tema" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Component Kit" })).toBeVisible();
  await expect(page.locator("[data-design-system-preview]")).toBeVisible();
  await expect(page.getByText("Semua pasangan utama lulus WCAG AA")).toBeVisible();

  await page.getByRole("button", { name: "Form", exact: true }).click();
  await expect(page.getByLabel("Nama proyek")).toBeVisible();
  await page.getByRole("button", { name: "Feedback", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByRole("button", { name: "Overlay", exact: true }).click();
  await expect(page.getByRole("tab", { name: "Ringkasan" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.getByRole("tab", { name: "Token" }).click();
  await expect(page.getByRole("tab", { name: "Token" })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Buka dialog" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Batal" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Tampilkan toast" }).click();
  await expect(page.getByText("Toast berhasil ditampilkan")).toBeVisible();
  await page.getByRole("button", { name: "Aksi", exact: true }).click();
  const handoff = page.locator("[data-component-kit-handoff]");
  await expect(handoff).toContainText(".brand-button");
  await page.getByRole("button", { name: "Tailwind", exact: true }).click();
  await expect(handoff).toContainText("className");
  await page.getByRole("button", { name: "React", exact: true }).click();
  await expect(handoff).toContainText("export function");

  const baseColor = page.getByLabel("Kode HEX");
  await baseColor.fill("#0C7BC0");
  await baseColor.blur();
  await expect(baseColor).toHaveValue("#0C7BC0");
  const exportPreview = page.locator("[data-design-system-export-preview]");
  await expect(exportPreview).toContainText("#0C7BC0");

  const lightBackground = await page
    .locator("[data-design-system-preview]")
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  const darkMode = page.getByRole("button", { name: "Gelap", exact: true });
  await darkMode.click();
  await expect(darkMode).toHaveAttribute("aria-pressed", "true");
  const darkBackground = await page
    .locator("[data-design-system-preview]")
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(darkBackground).not.toBe(lightBackground);

  await page.getByRole("button", { name: "Tailwind v4 @theme" }).click();
  await expect(exportPreview).toContainText("@theme {");

  await page.getByRole("button", { name: "DTCG 2025.10 JSON" }).click();
  await expect(exportPreview).toContainText("schemas/2025.10/format.json");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Unduh", exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("brand-dark.tokens.json");
});

for (const locale of ["id", "en"] as const) {
  test(`Design System radius updates existing previews and handoff (${locale})`, async ({
    page,
  }, testInfo) => {
    const en = locale === "en";
    const copy = (id: string, english: string) => (en ? english : id);
    const rem = (pixels: number) => (pixels === 0 ? "0" : `${pixels / 16}rem`);
    await page.setViewportSize({ width: en ? 1440 : 390, height: 900 });
    await page.goto(`${en ? "/en" : ""}/design-token-generator/`);
    const spacingSlider = page.locator("#spacing-base");
    const radiusSlider = page.locator("#radius-base");
    const preview = page.locator("[data-design-system-preview]");
    const handoff = page.locator("[data-component-kit-handoff]");
    const action = preview.getByRole("button", {
      name: copy("Aksi utama", "Primary action"),
      exact: true,
    });

    for (const base of [2, 8, 4]) {
      await spacingSlider.press(base === 2 ? "Home" : base === 8 ? "End" : "Home");
      if (base === 4) {
        await spacingSlider.press("ArrowRight");
        await spacingSlider.press("ArrowRight");
      }
      await expect(spacingSlider).toHaveValue(String(base));
      await expect(page.locator("[data-spacing-control-preview]")).toHaveCSS("gap", `${base}px`);
      await expect(preview).toHaveCSS("padding", `${base * 4}px`);
      await expect(action).toHaveCSS("padding", `${base * 2}px ${base * 3}px`);
    }

    for (const base of [0, 24, 8]) {
      await radiusSlider.press(base === 24 ? "End" : "Home");
      if (base === 8) {
        for (let step = 0; step < 8; step++) await radiusSlider.press("ArrowRight");
      }
      await expect(radiusSlider).toHaveValue(String(base));
      await expect(page.locator("[data-radius-control-preview]")).toHaveCSS(
        "border-radius",
        `${base}px`,
      );
      await expect(preview).toHaveCSS("border-radius", `${base}px`);
      await expect(action).toHaveCSS("border-radius", `${base * 0.75}px`);
      // Size and variant selections must retain the global corner setting.
      await preview.getByRole("button", { name: "lg", exact: true }).click();
      await preview.getByRole("button", { name: "secondary", exact: true }).click();
      await expect(action).toHaveCSS("border-radius", `${base * 0.75}px`);
      await expect(action).toHaveCSS("height", "48px");
      for (const format of ["CSS", "Tailwind", "React"]) {
        await page.getByRole("button", { name: format, exact: true }).click();
        await expect(handoff).toContainText(rem(base * 0.75));
      }
      if (base !== 8) {
        await preview.screenshot({ path: testInfo.outputPath(`radius-${base}.png`) });
      }
      await page.getByRole("button", { name: copy("Form", "Forms"), exact: true }).click();
      await expect(preview.getByRole("textbox")).toHaveCSS("border-radius", `${base * 0.5}px`);
      await expect(preview.getByRole("combobox")).toHaveCSS("border-radius", `${base * 0.5}px`);
      await expect(handoff).toContainText(`borderRadius: "${rem(base * 0.5)}"`);
      await page.getByRole("button", { name: "Feedback", exact: true }).click();
      await expect(preview.getByRole("status")).toHaveCSS("border-radius", `${base}px`);
      await page.getByRole("button", { name: copy("Overlay", "Overlays"), exact: true }).click();
      await expect(preview.getByRole("tabpanel")).toHaveCSS("border-radius", `${base}px`);
      await page
        .getByRole("button", { name: copy("Buka dialog", "Open dialog"), exact: true })
        .click();
      await expect(page.getByRole("dialog")).toHaveCSS("border-radius", `${base * 1.5}px`);
      await page.getByRole("button", { name: copy("Batal", "Cancel"), exact: true }).click();
      await expect(handoff).toContainText(`borderRadius: "${rem(base * 1.5)}"`);
      await page.getByRole("button", { name: copy("Aksi", "Actions"), exact: true }).click();
    }
    await page.reload();
    await expect(radiusSlider).toHaveValue("8");
    await expect(action).toHaveCSS("border-radius", "6px");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      en ? 1440 : 390,
    );
  });
}

test("Experiment applies RGB intensities and derives a CMYK target", async ({ page }) => {
  await page.goto("/color-mixer/");

  await expect(page.getByRole("heading", { name: "Cari Resep Warna" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Additive" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("button", { name: "Average" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await expect(page.getByText("Merah 100% · Hijau 100%", { exact: true })).toBeVisible();
  await expect(page.getByText("100% · Tepat", { exact: true }).first()).toBeVisible();

  await page.getByRole("button", { name: "Hijau", exact: true }).click();
  await expect(page.getByText("Hijau RGB (CSS: Lime)", { exact: true })).toBeVisible();
  await expect(page.getByText("Hijau 100%", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Kuning", exact: true }).click();

  await page.getByRole("button", { name: "Gunakan formula: Merah dan Hijau" }).click();
  await expect(page.getByRole("button", { name: "Additive" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByText("#FFFF00", { exact: true }).last()).toBeVisible();

  await page.getByRole("textbox", { name: "Warna target", exact: true }).fill("#0008FF");
  await expect(page.getByText("Hijau 3.14% · Biru 100%", { exact: true })).toBeVisible();
  await expect(page.getByText("#0008FF", { exact: true }).first()).toBeVisible();

  await page.getByRole("button", { name: "Gunakan formula: Hijau dan Biru" }).click();
  await expect(page.getByText("#0008FF", { exact: true }).last()).toBeVisible();

  await page.getByRole("textbox", { name: "Warna target", exact: true }).fill("#040BD7");
  await expect(
    page.getByText("Merah 1.57% · Hijau 4.31% · Biru 84.31%", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("100% · Tepat", { exact: true }).first()).toBeVisible();

  const blueIntensity = page.getByRole("spinbutton", { name: "Intensitas Biru (%)" });
  await blueIntensity.fill("84");
  await expect(page.getByText("#040BD6", { exact: true })).toBeVisible();
  await expect(page.getByText("99% · Sangat dekat", { exact: true })).toBeVisible();

  await blueIntensity.fill("84.31");
  await expect(page.getByText("#040BD7", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("100% · Tepat", { exact: true }).first()).toBeVisible();

  await page.getByRole("textbox", { name: "Warna target", exact: true }).fill("#2115C1");
  await page.getByRole("button", { name: "Cat / tinta" }).click();
  await expect(page.getByText("Cyan 83% · Magenta 89% · Hitam 24%", { exact: true })).toBeVisible();
  await expect(page.getByText("#00FFFF", { exact: true })).toBeVisible();
  await expect(page.getByText("#FF00FF", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Salin HEX Cyan #00FFFF" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Salin HEX hasil #2115C2" })).toBeVisible();

  await page.getByRole("spinbutton", { name: "Cakupan Cyan (%)" }).fill("100");
  await page.getByRole("spinbutton", { name: "Cakupan Magenta (%)" }).fill("100");
  await page.getByRole("spinbutton", { name: "Cakupan Hitam (%)" }).fill("100");
  await expect(page.getByText("#000000", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("9% · Berbeda jauh", { exact: true })).toBeVisible();

  await page.getByRole("textbox", { name: "Warna target", exact: true }).fill("#0C7BC0");
  await expect(page.getByText("Cyan 94% · Magenta 36% · Hitam 25%", { exact: true })).toBeVisible();
  await expect(page.getByText("#0B7ABF", { exact: true })).toBeVisible();
  await expect(page.getByText(/Formula ini memakai cakupan CMYK/)).toBeVisible();
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
