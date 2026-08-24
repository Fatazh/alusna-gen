import { APP_BRAND } from "../../shared/config/brand.ts";
import { getRelatedTools, getToolGuide } from "../content/toolGuides.ts";
import { ENGLISH_SEO_PAGES, SEO_PAGES, type SeoPage } from "../router/routes.ts";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const link = (path: string, label: string) =>
  `<a href="${escapeHtml(path)}">${escapeHtml(label)}</a>`;

export function createStaticPageContent(page: SeoPage): string {
  const content =
    page.kind === "home"
      ? createHomeContent(page)
      : page.kind === "tool"
        ? createToolContent(page)
        : `<h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.description)}</p>`;

  return `<main id="static-seo-content"><article><p>${escapeHtml(APP_BRAND.name)} — ${escapeHtml(page.locale === "en" ? APP_BRAND.sloganEn : APP_BRAND.slogan)}</p>${content}</article></main>`;
}

function createHomeContent(page: Extract<SeoPage, { kind: "home" }>): string {
  const tools = (page.locale === "en" ? ENGLISH_SEO_PAGES : SEO_PAGES)
    .map(
      (tool) => `<li>${link(tool.path, tool.heading)}<p>${escapeHtml(tool.description)}</p></li>`,
    )
    .join("");

  const allTools = page.locale === "en" ? "All ALUSNA tools" : "Semua alat ALUSNA";
  return `<h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.description)}</p><h2>${allTools}</h2><nav aria-label="${allTools}"><ul>${tools}</ul></nav>`;
}

function createToolContent(page: Extract<SeoPage, { kind: "tool" }>): string {
  const guide = getToolGuide(page);
  const steps = guide.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  const useCases = guide.useCases.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const tips = guide.tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("");
  const related = getRelatedTools(guide, page.locale)
    .map((tool) => `<li>${link(tool.path, tool.heading)}</li>`)
    .join("");

  return page.locale === "en"
    ? `<h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.description)}</p><h2>How to use ${escapeHtml(page.heading)}</h2><p>${escapeHtml(guide.overview)}</p><h3>How to use it</h3><ol>${steps}</ol><h3>Best used for</h3><ul>${useCases}</ul><h3>Important notes</h3><ul>${tips}</ul><h3>Related tools</h3><ul>${related}</ul>`
    : `<h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.description)}</p><h2>Cara menggunakan ${escapeHtml(page.heading)}</h2><p>${escapeHtml(guide.overview)}</p><h3>Langkah penggunaan</h3><ol>${steps}</ol><h3>Cocok digunakan untuk</h3><ul>${useCases}</ul><h3>Catatan penting</h3><ul>${tips}</ul><h3>Alat terkait</h3><ul>${related}</ul>`;
}
