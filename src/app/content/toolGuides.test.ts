import { describe, expect, it } from "vitest";
import { SEO_PAGES } from "../router/routes";
import { getRelatedTools, getToolGuide, TOOL_GUIDES } from "./toolGuides";

describe("tool guides", () => {
  it("provides unique useful guidance for every public tool", () => {
    expect(Object.keys(TOOL_GUIDES)).toHaveLength(SEO_PAGES.length);
    expect(new Set(SEO_PAGES.map((page) => getToolGuide(page).overview)).size).toBe(
      SEO_PAGES.length,
    );

    for (const page of SEO_PAGES) {
      const guide = getToolGuide(page);
      expect(guide.steps).toHaveLength(3);
      expect(guide.useCases.length).toBeGreaterThanOrEqual(3);
      expect(guide.tips.length).toBeGreaterThanOrEqual(2);
      expect(getRelatedTools(guide)).toHaveLength(guide.relatedPaths.length);
      expect(guide.relatedPaths).not.toContain(page.path);
    }
  });
});
