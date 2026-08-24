import { describe, expect, it } from "vitest";
import {
  HOME_PAGE,
  PUBLIC_PAGES,
  SEO_PAGES,
  findPageForModule,
  findSeoPage,
  isHomePage,
  isToolPage,
} from "./routes";

describe("SEO page routing", () => {
  it("uses a unique, crawlable path for every tool", () => {
    const paths = SEO_PAGES.map((page) => page.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.every((path) => path.startsWith("/") && !path.includes("?"))).toBe(true);
  });

  it("maps paths and modules to the same page", () => {
    const contrast = findSeoPage("/contrast-checker/");
    expect(isToolPage(contrast) && contrast.colorTab).toBe("contrast");
    expect(findPageForModule("color", "contrast").path).toBe("/contrast-checker");
    expect(findPageForModule("brand").path).toBe("/brand-kit-generator");
  });

  it("uses the ALUSNA brand consistently in every tool title", () => {
    expect(SEO_PAGES.every((page) => page.title.endsWith("| ALUSNA"))).toBe(true);
    expect(SEO_PAGES.some((page) => /CIKP/i.test(page.title))).toBe(false);
  });

  it("includes unique crawlable trust pages", () => {
    const paths = PUBLIC_PAGES.map((page) => page.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(findSeoPage("/privasi").kind).toBe("trust");
  });

  it("uses a dedicated homepage as the root and unknown-path fallback", () => {
    expect(HOME_PAGE.path).toBe("/");
    expect(isHomePage(findSeoPage("/"))).toBe(true);
    expect(findSeoPage("/unknown").path).toBe("/");
  });

  it("keeps Indonesian URLs and maps every page to an indexable English alternative", () => {
    expect(findSeoPage("/color-mixer").locale).toBe("id");
    expect(findSeoPage("/en/color-mixer").locale).toBe("en");
    expect(findSeoPage("/en/privacy").path).toBe("/en/privacy");
    expect(findSeoPage("/en/unknown").path).toBe("/en");
    expect(findPageForModule("brand", "pattern", "en").path).toBe("/en/brand-kit-generator");
  });
});
