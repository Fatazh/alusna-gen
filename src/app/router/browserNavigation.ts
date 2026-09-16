import {
  findPageForModule,
  findPublicPage,
  type NotFoundPage,
  type SeoPage,
  type TopModule,
} from "./routes";

const TOP_MODULES: TopModule[] = ["color", "font", "design", "brand"];

export function isTopModule(value: string | null): value is TopModule {
  return value !== null && TOP_MODULES.includes(value as TopModule);
}

export function resolveInitialPage(pathname: string, search: string): SeoPage | NotFoundPage {
  const legacyModule = new URLSearchParams(search).get("m");
  if ((pathname === "/" || pathname === "/en") && isTopModule(legacyModule)) {
    return findPageForModule(legacyModule, "pattern", pathname === "/en" ? "en" : "id");
  }
  return findPublicPage(pathname);
}

/**
 * Shared-state parameters are consumed once on load; they must not leak into
 * URLs of unrelated pages during SPA navigation (previously ?c=/?f= stuck
 * around across module, tab, and content-page switches).
 */
const SHARED_STATE_PARAMS = ["c", "f", "b", "p"] as const;

export function buildNavigationUrl(currentHref: string, path: string): URL {
  const url = new URL(currentHref);
  url.pathname = path;
  url.searchParams.delete("m");
  for (const param of SHARED_STATE_PARAMS) url.searchParams.delete(param);
  return url;
}

export function updateBrowserPath(path: string, replace = false): void {
  const url = buildNavigationUrl(window.location.href, path);
  window.history[replace ? "replaceState" : "pushState"]({}, "", url);
}
