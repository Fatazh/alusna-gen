import { describe, expect, it } from "vitest";
import { sanitizeShadeName } from "./shades";

describe("sanitizeShadeName", () => {
  it("keeps generated CSS and Tailwind identifiers safe", () => {
    expect(sanitizeShadeName("brand;}</style><script>")).toBe("brandstylescript");
    expect(sanitizeShadeName("a".repeat(40))).toHaveLength(32);
  });
});
