import { describe, expect, it } from "vitest";
import { parseSponsorConfig } from "./advertising";

describe("parseSponsorConfig", () => {
  it("accepts a labeled HTTPS sponsor", () => {
    expect(
      parseSponsorConfig({
        url: "https://example.com/offer",
        title: "Mitra desain",
        text: "Penawaran sponsor yang dijelaskan secara jujur.",
      }),
    ).toEqual({
      url: "https://example.com/offer",
      title: "Mitra desain",
      text: "Penawaran sponsor yang dijelaskan secara jujur.",
    });
  });

  it("fails closed for missing labels and unsafe protocols", () => {
    expect(parseSponsorConfig({ url: "https://example.com", title: "" })).toBeNull();
    expect(parseSponsorConfig({ url: "javascript:alert(1)", title: "Sponsor" })).toBeNull();
  });
});
