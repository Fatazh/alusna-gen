import { rename, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  normalizeGoogleFont,
  renderGoogleFontsCatalog,
  resolveCatalogLimit,
} from "./google-font-catalog.mjs";

const apiKey = process.env.GOOGLE_FONTS_API_KEY?.trim();
const limit = resolveCatalogLimit(process.env.GOOGLE_FONTS_LIMIT);
const target = path.resolve("src/features/typography/data/googleFonts.generated.ts");
const temporaryTarget = `${target}.tmp`;

if (!apiKey) {
  console.error(
    "GOOGLE_FONTS_API_KEY is required. Keep it in the shell or CI secret; never prefix it with VITE_.",
  );
  process.exit(1);
}

const endpoint = new URL("https://www.googleapis.com/webfonts/v1/webfonts");
endpoint.searchParams.set("key", apiKey);
endpoint.searchParams.set("sort", "popularity");
endpoint.searchParams.append("capability", "WOFF2");
endpoint.searchParams.append("capability", "VF");

let response;
try {
  response = await fetch(endpoint, { signal: AbortSignal.timeout(20_000) });
} catch (error) {
  console.error(
    `Google Fonts catalog request failed: ${error instanceof Error ? error.message : "network error"}`,
  );
  process.exit(1);
}

if (!response.ok) {
  console.error(`Google Fonts catalog request failed with HTTP ${response.status}.`);
  process.exit(1);
}

const payload = await response.json();
if (!payload || !Array.isArray(payload.items)) {
  console.error("Google Fonts API returned an invalid catalog payload.");
  process.exit(1);
}

const fonts = payload.items.map(normalizeGoogleFont).filter(Boolean).slice(0, limit);
if (fonts.length < 30) {
  console.error(`Only ${fonts.length} valid fonts were returned; keeping the existing snapshot.`);
  process.exit(1);
}

const source = renderGoogleFontsCatalog(fonts);

await writeFile(temporaryTarget, source, "utf8");
await rename(temporaryTarget, target);
console.log(`Google Fonts catalog synchronized: ${fonts.length} validated families.`);
