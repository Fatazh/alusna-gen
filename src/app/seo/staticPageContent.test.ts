import { describe, expect, it } from "vitest";
import { ENGLISH_HOME_PAGE, ENGLISH_SEO_PAGES, HOME_PAGE, SEO_PAGES } from "../router/routes";
import { createStaticPageContent } from "./staticPageContent";

describe("static page content", () => {
  it("exposes every tool as a crawlable homepage link", () => {
    const html = createStaticPageContent(HOME_PAGE);

    expect(html).toContain(`<h1>${HOME_PAGE.heading}</h1>`);
    for (const page of SEO_PAGES) expect(html).toContain(`href="${page.path}"`);
  });

  it("includes unique guidance and contextual links on a tool page", () => {
    const page = SEO_PAGES[0];
    const html = createStaticPageContent(page);

    expect(html).toContain(`Cara menggunakan ${page.heading}`);
    expect(html).toContain("Langkah penggunaan");
    expect(html).toContain('href="/contrast-checker"');
  });

  it("emits English homepage and guidance links under /en", () => {
    const home = createStaticPageContent(ENGLISH_HOME_PAGE);
    const tool = createStaticPageContent(ENGLISH_SEO_PAGES[0]);
    expect(home).toContain("All ALUSNA tools");
    expect(home).toContain('href="/en/color-mixer"');
    expect(tool).toContain("How to use");
    expect(tool).toContain('href="/en/contrast-checker"');
  });
});
