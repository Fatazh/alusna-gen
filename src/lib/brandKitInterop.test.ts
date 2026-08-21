import { describe, expect, it } from "vitest";
import { generateBrandKit } from "./designSystem";
import {
  brandKitToTailwindConfig,
  brandKitToW3cTokens,
  parseBrandKitImport,
} from "./brandKitInterop";
import { APP_BRAND } from "../shared/config/brand";

const exportedBrandKit = JSON.stringify({
  brandName: "Acme",
  tagline: "Build better",
  tone: "modern",
  colors: {
    primary: "#112233",
    secondary: "#223344",
    accent: "#334455",
    background: "#FFFFFF",
    text: "#111111",
  },
  typography: { headline: "Inter", body: "Roboto", mono: "Fira Code" },
});

describe("brand kit interoperability", () => {
  it("imports the existing JSON Brand Kit format", () => {
    expect(parseBrandKitImport(exportedBrandKit)).toMatchObject({
      brandName: "Acme",
      tone: "modern",
      primaryColor: { r: 17, g: 34, b: 51 },
      textColor: { r: 17, g: 17, b: 17 },
    });
  });

  it("rejects malformed JSON and invalid color values", () => {
    expect(() => parseBrandKitImport("not-json")).toThrow("File bukan JSON");
    expect(() => parseBrandKitImport(exportedBrandKit.replace("#112233", "not-a-color"))).toThrow(
      "Warna primary",
    );
  });

  it("creates W3C tokens and a Tailwind theme from a brand kit", () => {
    const kit = generateBrandKit({ r: 99, g: 102, b: 241 }, "Acme", "modern");
    const tokens = JSON.parse(brandKitToW3cTokens(kit));
    expect(tokens.color.primary).toEqual({ $type: "color", $value: "#6366F1" });
    expect(tokens.$description).toContain(APP_BRAND.name);
    expect(tokens.font.headline.$type).toBe("fontFamily");
    expect(brandKitToTailwindConfig(kit)).toContain("colors: { brand:");
  });
});
