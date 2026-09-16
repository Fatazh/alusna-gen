import { describe, expect, it } from "vitest";
import { buildNavigationUrl, resolveInitialPage } from "./browserNavigation";
import { isNotFoundPage, isToolPage } from "./routes";

describe("resolveInitialPage", () => {
  it("keeps legacy module query links compatible", () => {
    expect(resolveInitialPage("/", "?m=brand").path).toBe("/brand-kit-generator");
  });

  it("resolves a public tool path and falls back to the homepage safely", () => {
    const contrast = resolveInitialPage("/contrast-checker/", "");
    expect(isToolPage(contrast) && contrast.colorTab).toBe("contrast");
  });

  it("returns a dedicated NotFoundPage for unknown paths instead of the homepage", () => {
    const missing = resolveInitialPage("/this-page-does-not-exist", "");
    expect(isNotFoundPage(missing)).toBe(true);
    if (isNotFoundPage(missing)) {
      expect(missing.locale).toBe("id");
      expect(missing.title).toContain("Tidak Ditemukan");
    }
    const english = resolveInitialPage("/en/nope", "");
    expect(isNotFoundPage(english)).toBe(true);
    if (isNotFoundPage(english)) expect(english.locale).toBe("en");
  });
});

describe("buildNavigationUrl", () => {
  it("drops consumed share parameters and the legacy module parameter", () => {
    const url = buildNavigationUrl(
      "https://alusna.test/?m=color&c=%23FF0000&f=Inter",
      "/contrast-checker",
    );

    expect(url.pathname).toBe("/contrast-checker");
    expect(url.searchParams.get("m")).toBeNull();
    expect(url.searchParams.get("c")).toBeNull();
    expect(url.searchParams.get("f")).toBeNull();
  });

  it("strips stale share parameters on every context switch", () => {
    const url = buildNavigationUrl(
      "https://alusna.test/brand-kit-generator?c=FF0000&b=abc123",
      "/",
    );
    expect(url.searchParams.get("c")).toBeNull();
    expect(url.searchParams.get("b")).toBeNull();
  });
});
