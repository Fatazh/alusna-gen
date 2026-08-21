import { describe, expect, it } from "vitest";
import { buildNavigationUrl, resolveInitialPage } from "./browserNavigation";
import { isToolPage } from "./routes";

describe("resolveInitialPage", () => {
  it("keeps legacy module query links compatible", () => {
    expect(resolveInitialPage("/", "?m=brand").path).toBe("/brand-kit-generator");
  });

  it("resolves a public tool path and falls back safely", () => {
    const contrast = resolveInitialPage("/contrast-checker/", "");
    expect(isToolPage(contrast) && contrast.colorTab).toBe("contrast");
    expect(resolveInitialPage("/unknown", "").path).toBe("/color-palette-generator");
  });
});

describe("buildNavigationUrl", () => {
  it("preserves share parameters and removes the legacy module parameter", () => {
    const url = buildNavigationUrl(
      "https://alusna.test/?m=color&c=%23FF0000&f=Inter",
      "/contrast-checker",
    );

    expect(url.pathname).toBe("/contrast-checker");
    expect(url.searchParams.get("m")).toBeNull();
    expect(url.searchParams.get("c")).toBe("#FF0000");
    expect(url.searchParams.get("f")).toBe("Inter");
  });
});
