import { describe, expect, it } from "vitest";
import { parseSupportConfig } from "./support";

describe("parseSupportConfig", () => {
  it("accepts a configured HTTPS support link", () => {
    expect(
      parseSupportConfig({
        url: "https://trakteer.id/alusna/tip",
        title: "Trakteer",
      }),
    ).toEqual({ url: "https://trakteer.id/alusna/tip", title: "Trakteer" });
  });

  it("accepts HTTP but never other protocols", () => {
    expect(parseSupportConfig({ url: "http://example.com", title: "S" })).not.toBeNull();
    expect(parseSupportConfig({ url: "javascript:alert(1)", title: "S" })).toBeNull();
    expect(parseSupportConfig({ url: "data:text/html,x", title: "S" })).toBeNull();
  });

  it("fails closed without a title or url", () => {
    expect(parseSupportConfig({ url: "https://example.com", title: "" })).toBeNull();
    expect(parseSupportConfig({ url: "", title: "Support" })).toBeNull();
    expect(parseSupportConfig({ url: "not a url", title: "Support" })).toBeNull();
  });

  it("trims whitespace and caps title length", () => {
    const parsed = parseSupportConfig({
      url: "  https://example.com  ",
      title: `  ${"x".repeat(120)}  `,
    });
    expect(parsed?.url).toBe("https://example.com/");
    expect(parsed?.title).toHaveLength(80);
  });
});
