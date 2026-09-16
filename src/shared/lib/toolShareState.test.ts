import { describe, expect, it } from "vitest";
import { hexToRgb } from "@alusna/shared/color";
import { buildToolShareState, decodeToolShareState, encodeToolShareState } from "./toolShareState";

const red = hexToRgb("#FF0000") as NonNullable<ReturnType<typeof hexToRgb>>;

describe("toolShareState round-trip", () => {
  it("round-trips color and font", () => {
    const shared = buildToolShareState({ selectedColor: red, activeFontFamily: "Inter" });
    const params = encodeToolShareState(shared);
    const decoded = decodeToolShareState(params);
    expect(decoded?.c).toEqual(red);
    expect(decoded?.f).toBe("Inter");
  });

  it("round-trips palette colors", () => {
    const colors = [red, hexToRgb("#00FF00")!, hexToRgb("#0000FF")!];
    const shared = buildToolShareState({ paletteColors: colors });
    const decoded = decodeToolShareState(encodeToolShareState(shared));
    expect(decoded?.p).toEqual(colors);
  });

  it("rejects unknown t parameter (tokens are not shareable)", () => {
    expect(decodeToolShareState(new URLSearchParams("t=eyJhIjoxfQ=="))).toBeNull();
  });

  it("round-trips brand kit config without logo or font binaries", () => {
    const brandKit = {
      brandName: "Studio Uji",
      tagline: "Tagline dengan spasi dan tanda baca!",
      primaryColor: red,
      secondaryColor: hexToRgb("#00FF00")!,
      accentColor: hexToRgb("#0000FF")!,
      backgroundColor: hexToRgb("#FFFFFF")!,
      textColor: hexToRgb("#111111")!,
      headlineFont: "Poppins",
      bodyFont: "Inter",
      monoFont: "JetBrains Mono",
      tone: "modern",
    };
    const shared = buildToolShareState({ brandKit });
    const decoded = decodeToolShareState(encodeToolShareState(shared));
    expect(decoded?.b).toEqual(brandKit);
  });

  it("treats font validation symmetrically at encode and decode (dots are now allowed)", () => {
    const dotted = "PlayfairDisplay.v2";
    const encoded = encodeToolShareState(buildToolShareState({ activeFontFamily: dotted }));
    expect(encoded.get("f")).toBe(dotted);
    expect(decodeToolShareState(encoded)?.f).toBe(dotted);
    // Unsafe names are still rejected on BOTH sides.
    const unsafe = "Font; drop";
    expect(
      encodeToolShareState(buildToolShareState({ activeFontFamily: unsafe })).get("f"),
    ).toBeNull();
    expect(decodeToolShareState(new URLSearchParams("f=Font%3B%20drop"))?.f).toBeUndefined();
  });

  it("caps palette length", () => {
    const many = Array.from({ length: 60 }, (_, i) => hexToRgb(`#${(i * 9973) % 0xffffff}`)!);
    const shared = buildToolShareState({ paletteColors: many });
    expect(shared.p?.length).toBeLessThanOrEqual(32);
  });
});

describe("toolShareState fail-closed decoding", () => {
  it("drops individual invalid parameters but keeps valid ones (partial degradation)", () => {
    // Invalid color: dropped, no crash, empty result → null
    expect(decodeToolShareState(new URLSearchParams("c=not-a-color"))).toBeNull();
    // Invalid font alongside a valid color: color survives
    const mixed = decodeToolShareState(new URLSearchParams("c=FF0000&f=%3Cscript%3E"));
    expect(mixed?.c).toEqual(red);
    expect(mixed?.f).toBeUndefined();
    // Invalid palette entry: valid colors survive
    const palette = decodeToolShareState(new URLSearchParams("p=FF0000,zzzz,00FF00"));
    expect(palette?.p).toEqual([red, hexToRgb("#00FF00")!]);
  });

  it("still rejects the legacy token parameter outright", () => {
    expect(decodeToolShareState(new URLSearchParams("t=!!!not-base64!!!"))).toBeNull();
    expect(decodeToolShareState(new URLSearchParams("c=FF0000&t=x"))).toBeNull();
  });

  it("rejects malformed brand payloads", () => {
    const bad = btoa(unescape(encodeURIComponent("only~three~parts")));
    expect(decodeToolShareState(new URLSearchParams(`b=${bad}`))).toBeNull();
  });

  it("returns null for an empty payload", () => {
    expect(decodeToolShareState(new URLSearchParams(""))).toBeNull();
  });
});
