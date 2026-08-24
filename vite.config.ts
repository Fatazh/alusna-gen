import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { findAlternatePage, PUBLIC_PAGES } from "./src/app/router/routes.ts";
import { createStaticPageContent } from "./src/app/seo/staticPageContent.ts";
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

      const renderPage = (page: (typeof PUBLIC_PAGES)[number]) => {
        const canonical = origin ? `${origin}${page.path}` : "";
        const alternate = findAlternatePage(page);
        const alternateUrl = origin ? `${origin}${alternate.path}` : "";
        const idUrl = page.locale === "id" ? canonical : alternateUrl;
        const enUrl = page.locale === "en" ? canonical : alternateUrl;
        const socialMeta = [
          `<meta property="og:type" content="website">`,
          `<meta property="og:site_name" content="${escapeHtml(APP_BRAND.name)}">`,
          `<meta property="og:title" content="${escapeHtml(page.title)}">`,
          `<meta property="og:description" content="${escapeHtml(page.description)}">`,
          canonical ? `<meta property="og:url" content="${escapeHtml(canonical)}">` : "",
          `<meta name="twitter:card" content="summary">`,
          canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}">` : "",
          idUrl ? `<link rel="alternate" hreflang="id" href="${escapeHtml(idUrl)}">` : "",
          enUrl ? `<link rel="alternate" hreflang="en" href="${escapeHtml(enUrl)}">` : "",
          idUrl ? `<link rel="alternate" hreflang="x-default" href="${escapeHtml(idUrl)}">` : "",
        ]
          .filter(Boolean)
          .join("\n        ");
        return source
          .replace(/<html lang="[^"]+">/, `<html lang="${page.locale}">`)
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
          .replace(
            /<meta name="description"[^>]*>/,
            `<meta name="description" content="${escapeHtml(page.description)}">`,
          )
          .replace('<div id="root"></div>', `<div id="root">${createStaticPageContent(page)}</div>`)
          .replace("<!-- SEO_PAGE_META -->", socialMeta);
      };

      const homepage = PUBLIC_PAGES.find((page) => page.path === "/");
      if (homepage) index.source = renderPage(homepage);

      for (const page of PUBLIC_PAGES.filter((candidate) => candidate.path !== "/")) {
        this.emitFile({
          type: "asset",
          fileName: `${page.path.slice(1)}/index.html`,
          source: renderPage(page),
        });
      }

      const sitemapLine = origin ? `\nSitemap: ${origin}/sitemap.xml` : "";
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /${sitemapLine}\n`,
      });
      if (origin) {
        const urls = PUBLIC_PAGES.map((page) => {
          const alternate = findAlternatePage(page);
          const idPage = page.locale === "id" ? page : alternate;
          const enPage = page.locale === "en" ? page : alternate;
          return `  <url><loc>${escapeHtml(`${origin}${page.path}`)}</loc><xhtml:link rel="alternate" hreflang="id" href="${escapeHtml(`${origin}${idPage.path}`)}"/><xhtml:link rel="alternate" hreflang="en" href="${escapeHtml(`${origin}${enPage.path}`)}"/><xhtml:link rel="alternate" hreflang="x-default" href="${escapeHtml(`${origin}${idPage.path}`)}"/></url>`;
        }).join("\n");
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
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
