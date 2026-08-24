export type Locale = "id" | "en";

export const DEFAULT_LOCALE: Locale = "id";

export const LOCALE_META: Record<Locale, { htmlLang: string; schemaLanguage: string }> = {
  id: { htmlLang: "id", schemaLanguage: "id-ID" },
  en: { htmlLang: "en", schemaLanguage: "en-US" },
};

export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : DEFAULT_LOCALE;
}

export function pick<T>(locale: Locale, id: T, en: T): T {
  return locale === "en" ? en : id;
}
