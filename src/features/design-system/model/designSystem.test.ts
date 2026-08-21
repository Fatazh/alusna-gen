import { describe, expect, it } from "vitest";
import { generateDesignSystem, sanitizeTokenName } from "./designSystem";
import { toCssVariables, toJsonTokens } from "../services/serializers";

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
    expect(sanitizeTokenName("brand;}</style><script>")).toBe("brandstylescript");
  });
});
