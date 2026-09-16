import { APP_BRAND } from "../../shared/config/brand";
import { type MetadataPage } from "../router/routes";
import { findAlternatePage } from "../router/routes";
import { LOCALE_META } from "../../shared/i18n";

export function buildCanonicalUrl(
  path: string,
  browserOrigin: string,
  configuredOrigin?: string,
): string {
  const origin = configuredOrigin?.replace(/\/+$/, "") || browserOrigin.replace(/\/+$/, "");
  return `${origin}${path}`;
}

export function createStructuredData(page: MetadataPage, canonicalUrl: string) {
  const inLanguage = LOCALE_META[page.locale].schemaLanguage;
  if (page.kind === "home") {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: APP_BRAND.name,
      alternateName: page.locale === "en" ? APP_BRAND.sloganEn : APP_BRAND.slogan,
      description: page.description,
      url: canonicalUrl,
      inLanguage,
    };
  }

  if (page.kind === "not-found") {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${page.heading} — ${APP_BRAND.name}`,
      description: page.description,
      url: canonicalUrl,
      inLanguage,
      isPartOf: { "@type": "WebSite", name: APP_BRAND.name },
    };
  }

  if (page.kind === "trust") {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${page.heading} — ${APP_BRAND.name}`,
      description: page.description,
      url: canonicalUrl,
      inLanguage,
      isPartOf: { "@type": "WebSite", name: APP_BRAND.name },
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${page.heading} — ${APP_BRAND.name}`,
    alternateName: page.locale === "en" ? APP_BRAND.sloganEn : APP_BRAND.slogan,
    description: page.description,
    url: canonicalUrl,
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    inLanguage,
    isAccessibleForFree: true,
    brand: { "@type": "Brand", name: APP_BRAND.name },
    offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
  };
}

export function applyPageMetadata(page: MetadataPage): void {
  const isNotFound: boolean = page.kind === "not-found";
  // NotFoundPage carries the homepage path on purpose: it renders at unknown
  // URLs, and its canonical must stay the site root (never itself).
  const canonicalPath = isNotFound ? (page.locale === "en" ? "/en" : "/") : page.path;
  const canonicalUrl = buildCanonicalUrl(
    canonicalPath,
    window.location.origin,
    import.meta.env.VITE_SITE_URL,
  );
  document.title = page.title;
  document.documentElement.lang = LOCALE_META[page.locale].htmlLang;

  upsertMeta('meta[name="robots"]', {
    name: "robots",
    content: isNotFound ? "noindex, follow" : "index, follow",
  });
  upsertMeta('meta[name="description"]', { name: "description", content: page.description });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: page.title });
  upsertMeta('meta[property="og:site_name"]', {
    property: "og:site_name",
    content: APP_BRAND.name,
  });
  upsertMeta('meta[property="og:description"]', {
    property: "og:description",
    content: page.description,
  });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;

  const alternate = findAlternatePage(page);
  const alternateUrl = buildCanonicalUrl(
    alternate.path,
    window.location.origin,
    import.meta.env.VITE_SITE_URL,
  );
  upsertAlternate("id", page.locale === "id" ? canonicalUrl : alternateUrl);
  upsertAlternate("en", page.locale === "en" ? canonicalUrl : alternateUrl);
  upsertAlternate("x-default", page.locale === "id" ? canonicalUrl : alternateUrl);

  let structuredData = document.head.querySelector<HTMLScriptElement>(
    `#${APP_BRAND.structuredDataId}`,
  );
  if (!structuredData) {
    structuredData = document.createElement("script");
    structuredData.id = APP_BRAND.structuredDataId;
    structuredData.type = "application/ld+json";
    document.head.appendChild(structuredData);
  }
  structuredData.textContent = JSON.stringify(createStructuredData(page, canonicalUrl));
}

function upsertAlternate(language: string, href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>(
    `link[rel="alternate"][hreflang="${language}"]`,
  );
  if (!link) {
    link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = language;
    document.head.appendChild(link);
  }
  link.href = href;
}

function upsertMeta(selector: string, attributes: Record<string, string>): void {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
}
