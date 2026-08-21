import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { PUBLIC_PAGES } from "./src/app/router/routes.ts";
import { APP_BRAND } from "./src/shared/config/brand.ts";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function staticSeoPages(siteUrl: string): Plugin {
  const origin = siteUrl.replace(/\/+$/, "");
  return {
    name: `${APP_BRAND.name.toLowerCase()}-static-seo-pages`,
    enforce: "post",
    generateBundle(_options, bundle) {
      const index = bundle["index.html"];
      if (!index || index.type !== "asset") return;
      const source = String(index.source);

      for (const page of PUBLIC_PAGES) {
        const canonical = origin ? `${origin}${page.path}` : "";
        const socialMeta = [
          `<meta property="og:type" content="website">`,
          `<meta property="og:site_name" content="${escapeHtml(APP_BRAND.name)}">`,
          `<meta property="og:title" content="${escapeHtml(page.title)}">`,
          `<meta property="og:description" content="${escapeHtml(page.description)}">`,
          canonical ? `<meta property="og:url" content="${escapeHtml(canonical)}">` : "",
          `<meta name="twitter:card" content="summary">`,
          canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}">` : "",
        ]
          .filter(Boolean)
          .join("\n        ");
        const html = source
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
          .replace(
            /<meta name="description"[^>]*>/,
            `<meta name="description" content="${escapeHtml(page.description)}">`,
          )
          .replace("<!-- SEO_PAGE_META -->", socialMeta);
        this.emitFile({
          type: "asset",
          fileName: `${page.path.slice(1)}/index.html`,
          source: html,
        });
      }

      const sitemapLine = origin ? `\nSitemap: ${origin}/sitemap.xml` : "";
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /${sitemapLine}\n`,
      });
      if (origin) {
        const urls = PUBLIC_PAGES.map(
          (page) => `  <url><loc>${escapeHtml(`${origin}${page.path}`)}</loc></url>`,
        ).join("\n");
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "VITE_");
  return {
    plugins: [react(), staticSeoPages(env.VITE_SITE_URL ?? "")],
    server: { port: 5173 },
  };
});
