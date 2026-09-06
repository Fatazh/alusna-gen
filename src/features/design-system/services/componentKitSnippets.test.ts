import { describe, expect, it } from "vitest";
import { getDesignSystemColor, generateDesignSystem } from "../model/designSystem";
import {
  buildComponentKitSnippet,
  type ComponentKitButtonVariant,
  type ComponentKitControlSize,
} from "./componentKitSnippets";

const system = generateDesignSystem({ r: 12, g: 123, b: 192 }, { name: "brand" });
const color = (token: string) => getDesignSystemColor(system, token).hex;

describe("component kit snippets", () => {
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
