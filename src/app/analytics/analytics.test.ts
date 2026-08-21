import { describe, expect, it } from "vitest";
import { findSeoPage } from "../router/routes";
import { createPageViewEvent, isAnalyticsEnabled } from "./analytics";

describe("privacy-first analytics boundary", () => {
  it("fails closed unless explicitly enabled", () => {
    expect(isAnalyticsEnabled(undefined)).toBe(false);
    expect(isAnalyticsEnabled("false")).toBe(false);
    expect(isAnalyticsEnabled("1")).toBe(false);
    expect(isAnalyticsEnabled(" TRUE ")).toBe(true);
  });

  it("creates an allowlisted page event without query strings or user values", () => {
    expect(createPageViewEvent(findSeoPage("/contrast-checker"))).toEqual({
      name: "page_view",
      pageKind: "tool",
      pagePath: "/contrast-checker",
    });
  });
});
