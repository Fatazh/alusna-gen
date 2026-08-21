import { describe, expect, it } from "vitest";
import { SEO_PAGES, findPageForModule, findSeoPage } from "./routes";

describe("SEO page routing", () => {
  it("uses a unique, crawlable path for every tool", () => {
    const paths = SEO_PAGES.map((page) => page.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.every((path) => path.startsWith("/") && !path.includes("?"))).toBe(true);
  });

  it("maps paths and modules to the same page", () => {
    const contrast = findSeoPage("/contrast-checker/");
    expect(contrast.colorTab).toBe("contrast");
    expect(findPageForModule("color", "contrast").path).toBe("/contrast-checker");
    expect(findPageForModule("brand").path).toBe("/brand-kit-generator");
  });

  it("uses the ALUSNA brand consistently in every tool title", () => {
    expect(SEO_PAGES.every((page) => page.title.endsWith("| ALUSNA"))).toBe(true);
    expect(SEO_PAGES.some((page) => /CIKP/i.test(page.title))).toBe(false);
  });
});
