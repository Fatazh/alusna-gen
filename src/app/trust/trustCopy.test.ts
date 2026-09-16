import { describe, expect, it } from "vitest";
import { createStaticPageContent } from "../seo/staticPageContent";
import { ENGLISH_TRUST_PAGES, TRUST_PAGES, findSeoPage } from "../router/routes";
import { TRUST_COPY, TRUST_PAGE_UPDATED } from "./trustCopy";

describe("trust copy", () => {
  it("defines sections for every trust page in both locales", () => {
    const pageIds = ["about", "privacy", "terms", "advertising"] as const;
    const locales = ["id", "en"] as const;

    for (const locale of locales) {
      for (const id of pageIds) {
        const sections = TRUST_COPY[locale][id];
        expect(sections.length, `${locale}/${id}`).toBeGreaterThan(0);
        for (const section of sections) {
          expect(section.title.trim().length, `${locale}/${id}`).toBeGreaterThan(0);
          expect(
            Boolean(section.body) || Boolean(section.bullets?.length),
            `${locale}/${id}/${section.title}`,
          ).toBe(true);
        }
      }
    }
  });

  it("renders section titles from shared copy in static trust HTML", () => {
    for (const page of [...TRUST_PAGES, ...ENGLISH_TRUST_PAGES]) {
      const html = createStaticPageContent(page);
      const firstTitle = TRUST_COPY[page.locale][page.id][0].title;
      expect(html).toContain(`<h2>${firstTitle}</h2>`);
      expect(html).toContain(TRUST_PAGE_UPDATED[page.locale]);
    }
  });

  it("keeps the changelog section on static About pages", () => {
    const indonesian = createStaticPageContent(findSeoPage("/tentang"));
    const english = createStaticPageContent(findSeoPage("/en/about"));

    expect(indonesian).toContain("Catatan perubahan");
    expect(english).toContain("Changelog");
  });

  it("states local storage facts accurately", () => {
    for (const page of [...TRUST_PAGES, ...ENGLISH_TRUST_PAGES]) {
      if (page.id !== "privacy") continue;
      const html = createStaticPageContent(page);
      expect(html).toContain("IndexedDB");
      expect(html).toContain("alusna-studio");
    }
  });
});
