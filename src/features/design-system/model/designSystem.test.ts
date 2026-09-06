import { describe, expect, it } from "vitest";
import { generateDesignSystem, sanitizeFontFamily, sanitizeTokenName } from "./designSystem";
import {
  toCssVariables,
  toJsonTokens,
  toReactNativeTheme,
  toScssVariables,
  toTailwindConfig,
} from "../services/serializers";

const indigo = { r: 99, g: 102, b: 241 };

describe("design system exports", () => {
  it("generates deterministic layered CSS and DTCG 2025.10 output", () => {
    const system = generateDesignSystem(indigo, "brand");
    const css = toCssVariables(system);
    const json = JSON.parse(toJsonTokens(system));

    expect(css).toContain("--brand-color-primary: #6366F1;");
    expect(css).toContain("--brand-space-4: 1rem;");
    expect(json.$schema).toBe("https://www.designtokens.org/schemas/2025.10/format.json");
    expect(json.brand.semantic.color.primary.$value).toEqual({
      colorSpace: "srgb",
      components: [0.388235, 0.4, 0.945098],
      alpha: 1,
    });
    expect(json.brand.component.color.button.background.$value).toBe(
      "{brand.semantic.color.primary}",
    );
    expect(json.brand.shadow.sm.$value).toHaveLength(2);
    expect(json.brand.typography.h1.$value.fontFamily).toBe("Inter");
  });

  it("generates Tailwind v4 theme variables and SCSS", () => {
    const system = generateDesignSystem(indigo, { name: "product", fontFamily: "Manrope" });

    expect(toTailwindConfig(system)).toContain("@theme {");
    expect(toTailwindConfig(system)).toContain("--color-product-primary: #6366F1;");
    expect(toTailwindConfig(system)).toContain("--text-product-h1: 2rem;");
    expect(toTailwindConfig(system)).toContain("--leading-product-h1: 1.2;");
    expect(toTailwindConfig(system)).not.toContain("tailwind.config.js");
    expect(toScssVariables(system)).toContain("$product-color-primary: #6366F1;");
    expect(toScssVariables(system)).toContain(
      "$product-button-background: $product-color-primary;",
    );
    expect(toReactNativeTheme(system)).toContain('"letterSpacing": -0.64');
  });

  it("supports theme modes and adjustable foundation scales", () => {
    const light = generateDesignSystem(indigo, "brand");
    const dark = generateDesignSystem(indigo, {
      name: "brand",
      mode: "dark",
      spacingBase: 6,
      radiusBase: 12,
    });
    const contrast = generateDesignSystem(indigo, { mode: "high-contrast" });

    expect(dark.colors.find((color) => color.token === "background")?.hex).not.toBe(
      light.colors.find((color) => color.token === "background")?.hex,
    );
    expect(dark.spacing.find((space) => space.name === "4")?.px).toBe(24);
    expect(dark.radius.find((radius) => radius.name === "lg")?.px).toBe(12);
    expect(contrast.colors.find((color) => color.token === "background")?.hex).toBe("#000000");
    expect(contrast.contrastChecks.every((check) => check.aaNormal)).toBe(true);
  });

  it("sanitizes token identifiers", () => {
    expect(sanitizeTokenName("brand;}</style><script>")).toBe("brandstylescript");
    expect(sanitizeFontFamily('Unsafe"; }\nFont')).toBe('Unsafe"  Font');
  });
});
