import { describe, expect, it } from "vitest";
import { HOME_PAGE, SEO_PAGES } from "../router/routes";
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
});
