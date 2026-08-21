import { describe, expect, it } from "vitest";
import { generateBrandKit } from "../model/brandKit";
import { brandKitToHtml } from "./htmlSerializer";

const indigo = { r: 99, g: 102, b: 241 };

describe("brandKitToHtml", () => {
  it("escapes user-controlled brand text", () => {
    const kit = generateBrandKit(indigo, '<script>alert("x")</script>');
    kit.tagline = '<img src=x onerror="alert(1)">';

    const html = brandKitToHtml(kit);

    expect(html).not.toContain("<script>alert");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    expect(html).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
  });
});
