import { describe, expect, it } from "vitest";
import { getDesignSystemColor, generateDesignSystem } from "../model/designSystem";
import {
  buildComponentKitSnippet,
  type ComponentKitTab,
  type ComponentKitButtonVariant,
  type ComponentKitControlSize,
} from "./componentKitSnippets";

const system = generateDesignSystem({ r: 12, g: 123, b: 192 }, { name: "brand" });
const color = (token: string) => getDesignSystemColor(system, token).hex;

describe("component kit snippets", () => {
  it("exports the same radius roles at square, default, and rounded settings in every format", () => {
    for (const base of [0, 8, 24]) {
      const current = generateDesignSystem({ r: 12, g: 123, b: 192 }, { radiusBase: base });
      const tokenColor = (token: string) => getDesignSystemColor(current, token).hex;
      const cases: Array<[ComponentKitTab, number]> = [
        ["actions", base * 0.75],
        ["forms", base * 0.5],
        ["feedback", base],
        ["overlays", base * 1.5],
      ];
      for (const [tab, pixels] of cases) {
        const radius = pixels === 0 ? "0" : `${pixels / 16}rem`;
        const build = (format: "css" | "tailwind" | "react") =>
          buildComponentKitSnippet(current, tab, "primary", "md", tokenColor, format);
        expect(build("css")).toContain(`border-radius: ${radius};`);
        expect(build("tailwind")).toContain(`rounded-[${radius}]`);
        expect(build("react")).toContain(`borderRadius: "${radius}"`);
      }
    }
  });

  it("keeps CSS, Tailwind, and React output aligned to active tokens", () => {
    const css = buildComponentKitSnippet(system, "actions", "primary", "md", color, "css");
    const tailwind = buildComponentKitSnippet(
      system,
      "actions",
      "primary" as ComponentKitButtonVariant,
      "md" as ComponentKitControlSize,
      color,
      "tailwind",
    );
    const react = buildComponentKitSnippet(system, "actions", "primary", "md", color, "react");

    expect(css).toContain("background: #0C7BC0;");
    expect(tailwind).toContain("className");
    expect(tailwind).toContain("#0C7BC0");
    expect(react).toContain("export function brandButton()");
    expect(react).toContain("#0C7BC0");
  });

  it("produces a valid React identifier for a numeric system name", () => {
    const numeric = generateDesignSystem({ r: 12, g: 123, b: 192 }, { name: "123 brand" });
    const tokenColor = (token: string) => getDesignSystemColor(numeric, token).hex;
    const snippet = buildComponentKitSnippet(
      numeric,
      "actions",
      "ghost",
      "sm",
      tokenColor,
      "react",
    );
    const css = buildComponentKitSnippet(numeric, "actions", "ghost", "sm", tokenColor, "css");

    expect(snippet).toContain("export function Brand123brandButton()");
    expect(css).toContain(".brand-123brand-button");
  });
});
