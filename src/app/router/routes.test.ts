import { describe, expect, it } from "vitest";
import {
  ENGLISH_NOT_FOUND_PAGE,
  HOME_PAGE,
  NOT_FOUND_PAGE,
  PUBLIC_PAGES,
  SEO_PAGES,
  findPageForModule,
  findPublicPage,
  findSeoPage,
  isHomePage,
  isNotFoundPage,
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

  it("uses a dedicated homepage as the root", () => {
    expect(HOME_PAGE.path).toBe("/");
    expect(isHomePage(findSeoPage("/"))).toBe(true);
  });

  it("routes unknown paths to a dedicated noindex NotFoundPage, not the homepage", () => {
    const missing = findPublicPage("/unknown");
    expect(isNotFoundPage(missing)).toBe(true);
    if (isNotFoundPage(missing)) {
      expect(missing.locale).toBe("id");
      expect(missing.key).toBe("not-found");
      expect(missing.path).toBe("/");
    }
    const english = findPublicPage("/en/unknown");
    expect(isNotFoundPage(english)).toBe(true);
    if (isNotFoundPage(english)) expect(english.locale).toBe("en");
    expect(NOT_FOUND_PAGE.title).toContain("Tidak Ditemukan");
    expect(ENGLISH_NOT_FOUND_PAGE.title).toContain("Not Found");
    // Real pages are untouched.
    expect(isNotFoundPage(findPublicPage("/contrast-checker"))).toBe(false);
  });

  it("keeps Indonesian URLs and maps every page to an indexable English alternative", () => {
    expect(findSeoPage("/color-mixer").locale).toBe("id");
    expect(findSeoPage("/en/color-mixer").locale).toBe("en");
    expect(findSeoPage("/en/privacy").path).toBe("/en/privacy");
    expect(findPageForModule("brand", "pattern", "en").path).toBe("/en/brand-kit-generator");
  });
});
