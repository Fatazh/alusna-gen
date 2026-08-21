import { findPageForModule, findSeoPage, type SeoPage, type TopModule } from "./routes";

const TOP_MODULES: TopModule[] = ["color", "font", "design", "brand"];

export function isTopModule(value: string | null): value is TopModule {
  return value !== null && TOP_MODULES.includes(value as TopModule);
}

export function resolveInitialPage(pathname: string, search: string): SeoPage {
  const legacyModule = new URLSearchParams(search).get("m");
  if (pathname === "/" && isTopModule(legacyModule)) return findPageForModule(legacyModule);
  return findSeoPage(pathname);
}

export function buildNavigationUrl(currentHref: string, path: string): URL {
  const url = new URL(currentHref);
  url.pathname = path;
  url.searchParams.delete("m");
  return url;
}

export function updateBrowserPath(path: string, replace = false): void {
  const url = buildNavigationUrl(window.location.href, path);
  window.history[replace ? "replaceState" : "pushState"]({}, "", url);
}
