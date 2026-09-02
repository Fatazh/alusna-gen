import { describe, expect, it } from "vitest";
import { generateDesignSystem } from "../model/designSystem";
import { createDesignSystemExportFile } from "./download";

describe("design-system export files", () => {
  it("creates a deterministic browser-local filename and payload", () => {
    const system = generateDesignSystem(
      { r: 99, g: 102, b: 241 },
      { name: "product", mode: "dark" },
    );
    const file = createDesignSystemExportFile(system, "json");

    expect(file.filename).toBe("product-dark.tokens.json");
    expect(file.mime).toBe("application/json");
    expect(JSON.parse(file.content).product.$description).toContain("dark");
  });
});
