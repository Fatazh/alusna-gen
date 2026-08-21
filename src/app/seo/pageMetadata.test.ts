import { describe, expect, it } from "vitest";
import { findSeoPage } from "../router/routes";
import { buildCanonicalUrl, createStructuredData } from "./pageMetadata";

describe("page metadata", () => {
  const page = findSeoPage("/contrast-checker");

  it("uses the configured production origin without trailing slashes", () => {
    expect(buildCanonicalUrl(page.path, "http://localhost:5173", "https://alusna.id///")).toBe(
      "https://alusna.id/contrast-checker",
    );
  });

  it("describes free browser tools with stable ALUSNA structured data", () => {
    const data = createStructuredData(page, "https://alusna.id/contrast-checker");

    expect(data["@type"]).toBe("WebApplication");
    expect(data.brand).toEqual({ "@type": "Brand", name: "ALUSNA" });
    expect(data.isAccessibleForFree).toBe(true);
  });
});
