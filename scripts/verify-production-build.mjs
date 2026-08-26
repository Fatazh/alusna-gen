import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");

async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await findHtmlFiles(fullPath)));
    else if (entry.name.endsWith(".html")) files.push(fullPath);
  }
  return files;
}

const failures = [];

try {
  await access(path.join(distDir, "sitemap.xml"));
} catch {
  failures.push("dist/sitemap.xml is missing.");
}

const htmlFiles = await findHtmlFiles(distDir);
if (htmlFiles.length === 0) failures.push("No HTML pages were emitted.");

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const relative = path.relative(distDir, file);
  if (html.includes("script-src 'self' 'unsafe-inline'")) {
    failures.push(`${relative} still permits inline scripts.`);
  }
  if (!html.includes('rel="canonical"')) failures.push(`${relative} has no canonical URL.`);
  for (const language of ["id", "en", "x-default"]) {
    if (!html.includes(`hreflang="${language}"`)) {
      failures.push(`${relative} has no ${language} hreflang.`);
    }
  }
}

const robots = await readFile(path.join(distDir, "robots.txt"), "utf8");
if (!/^Sitemap: https:\/\//m.test(robots)) failures.push("robots.txt has no HTTPS sitemap URL.");

if (failures.length > 0) {
  console.error("Production artifact verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Production artifact verified: ${htmlFiles.length} HTML pages with canonical and hreflang metadata.`,
);
