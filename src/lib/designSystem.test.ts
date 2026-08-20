import { describe, expect, it } from "vitest";
import {
  brandKitToHtml,
  generateBrandKit,
  generateDesignSystem,
  sanitizeTokenName,
  toCssVariables,
  toJsonTokens,
} from "./designSystem";

const indigo = { r: 99, g: 102, b: 241 };

describe("design system exports", () => {
  it("generates deterministic CSS and JSON token output", () => {
    const system = generateDesignSystem(indigo, "brand");
    const css = toCssVariables(system);
    const json = JSON.parse(toJsonTokens(system));

    expect(css).toContain("--brand-primary: #6366F1;");
    expect(css).toContain("--brand-space-4: 1rem;");
    expect(json.brand.color.primary.$value).toBe("#6366F1");
  });

  it("sanitizes token identifiers", () => {
    expect(sanitizeTokenName('brand;}</style><script>')).toBe(
      "brandstylescript",
    );
  });
});

describe("brandKitToHtml", () => {
  it("escapes user-controlled brand text", () => {
    const kit = generateBrandKit(indigo, '<script>alert("x")</script>');
    kit.tagline = '<img src=x onerror="alert(1)">';

    const html = brandKitToHtml(kit);

    expect(html).not.toContain("<script>alert");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    expect(html).toContain(
      "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;",
    );
  });
});
