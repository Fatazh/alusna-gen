import { rgbToHex } from "../../color";
import { type BrandKit, TONE_PROFILES } from "../model/brandKit";

/** Escape user-controlled strings before interpolating into exported HTML. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function brandKitToHtml(kit: BrandKit): string {
  const p = kit.primaryColor;
  const s = kit.secondaryColor;
  const a = kit.accentColor;
  const bg = kit.backgroundColor;
  const text = kit.textColor;
  const profile = TONE_PROFILES[kit.tone] ?? TONE_PROFILES.modern;
  const fontQuery = [kit.headlineFont, kit.bodyFont, kit.monoFont]
    .filter((f, i, arr) => f && arr.indexOf(f) === i)
    .map((f) => `family=${escapeHtml(f).replace(/ /g, "+")}:wght@400;700`)
    .join("&");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(kit.brandName)} — Brand Guidelines</title>
  <link href="https://fonts.googleapis.com/css2?${fontQuery}&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: ${rgbToHex(p)};
      --secondary: ${rgbToHex(s)};
      --accent: ${rgbToHex(a)};
      --bg: ${rgbToHex(bg)};
      --text: ${rgbToHex(text)};
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: '${kit.bodyFont}', sans-serif; background: #fafafa; color: #1a1a1a; line-height: 1.6; }
    .hero { background: var(--primary); color: white; padding: ${profile.style.spacing * 3}px 40px; text-align: center; }
    .hero h1 { font-family: '${kit.headlineFont}', sans-serif; font-size: ${profile.style.headingSize / 16}rem; font-weight: ${profile.style.headingWeight}; letter-spacing: ${profile.style.letterSpacing}; text-transform: ${profile.style.headingTransform}; margin-bottom: 16px; }
    .hero p { font-size: 1.25rem; opacity: 0.85; }
    .container { max-width: 960px; margin: 0 auto; padding: 60px 24px; }
    .section { margin-bottom: 60px; }
    .section h2 { font-size: 1.75rem; font-weight: 700; margin-bottom: 24px; border-bottom: 3px solid var(--primary); padding-bottom: 8px; display: inline-block; }
    .color-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
    .color-card { border-radius: ${profile.style.radius}px; overflow: hidden; box-shadow: ${profile.style.shadow}; }
    .color-swatch { height: 100px; }
    .color-info { padding: 12px 16px; background: white; }
    .color-info .name { font-weight: 600; font-size: 0.875rem; }
    .color-info .hex { font-family: '${kit.monoFont}', monospace; font-size: 0.75rem; color: #666; }
    .type-sample { margin-bottom: 20px; padding: 20px; background: white; border-radius: ${profile.style.radius}px; border: 1px solid #e5e5e5; }
    .type-sample .label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #999; margin-bottom: 8px; }
    .guideline-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
    .guideline-item:last-child { border-bottom: none; }
    .guideline-item .label { font-weight: 500; }
    .guideline-item .value { color: #666; font-family: '${kit.monoFont}', monospace; font-size: 0.875rem; }
    .spacing-demo { display: flex; align-items: flex-end; gap: 8px; flex-wrap: wrap; }
    .space-block { background: var(--primary); border-radius: 4px; opacity: 0.7; }
  </style>
</head>
<body>
  <div class="hero">
    <h1>${escapeHtml(kit.brandName)}</h1>
    <p>${escapeHtml(kit.tagline) || "Brand Guidelines"}</p>
  </div>
  <div class="container">
    <div class="section">
      <h2>Color Palette</h2>
      <div class="color-grid">
        ${kit.guidelines[0].items
          .map(
            (item) => `
        <div class="color-card">
          <div class="color-swatch" style="background: ${item.hex}"></div>
          <div class="color-info">
            <div class="name">${item.label}</div>
            <div class="hex">${item.value}</div>
          </div>
        </div>`,
          )
          .join("")}
      </div>
    </div>
    <div class="section">
      <h2>Typography</h2>
      <div class="type-sample">
        <div class="label">Heading 1</div>
        <div style="font-size: 2rem; font-weight: 700;">The quick brown fox</div>
      </div>
      <div class="type-sample">
        <div class="label">Heading 2</div>
        <div style="font-size: 1.5rem; font-weight: 600;">The quick brown fox</div>
      </div>
      <div class="type-sample">
        <div class="label">Body</div>
        <div style="font-size: 1rem;">The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.</div>
      </div>
      <div class="type-sample">
        <div class="label">Caption</div>
        <div style="font-size: 0.75rem; color: #666;">The quick brown fox jumps over the lazy dog.</div>
      </div>
    </div>
    <div class="section">
      <h2>Brand Guidelines</h2>
      ${kit.guidelines
        .slice(2)
        .map(
          (g) => `
      <h3 style="margin: 24px 0 12px; font-size: 1.125rem;">${g.section}</h3>
      ${g.items
        .map(
          (item) => `
      <div class="guideline-item">
        <span class="label">${item.label}</span>
        <span class="value">${item.value}</span>
      </div>`,
        )
        .join("")}`,
        )
        .join("")}
    </div>
  </div>
</body>
</html>`;
}
