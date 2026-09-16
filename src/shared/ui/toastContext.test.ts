import { describe, expect, it } from "vitest";
import { resolveToastPresentation } from "./toastContext";

describe("resolveToastPresentation", () => {
  it("returns emerald classes by default", () => {
    const presentation = resolveToastPresentation({});
    expect(presentation.className).toContain("bg-emerald-500/20");
    expect(presentation.style).toBeUndefined();
  });

  it("maps tones to their semantic color classes", () => {
    expect(resolveToastPresentation({ tone: "warning" }).className).toContain("bg-amber-500/20");
    expect(resolveToastPresentation({ tone: "error" }).className).toContain("bg-rose-500/20");
    expect(resolveToastPresentation({ tone: "success" }).className).toContain("bg-emerald-500/20");
  });

  it("uses explicit design-system colors over tone classes", () => {
    const presentation = resolveToastPresentation({
      tone: "error",
      background: "#0C7BC0",
      foreground: "#FFFFFF",
    });
    expect(presentation.style).toEqual({ backgroundColor: "#0C7BC0", color: "#FFFFFF" });
    expect(presentation.className).toBe("");
  });

  it("falls back to tone classes when the color pair is partial", () => {
    const onlyBackground = resolveToastPresentation({ background: "#0C7BC0" });
    expect(onlyBackground.className).toContain("bg-emerald-500/20");
    expect(onlyBackground.style).toBeUndefined();

    const onlyForeground = resolveToastPresentation({ foreground: "#FFFFFF" });
    expect(onlyForeground.className).toContain("bg-emerald-500/20");
    expect(onlyForeground.style).toBeUndefined();
  });
});
