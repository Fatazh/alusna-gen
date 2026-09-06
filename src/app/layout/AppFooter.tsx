import { APP_BRAND } from "../../shared/config/brand";
import { type Locale } from "../../shared/i18n";
import { ENGLISH_TRUST_PAGES, TRUST_PAGES } from "../router/routes";

const FOOTER_LABELS = {
  id: {
    home: "Beranda",
    about: "Tentang",
    privacy: "Privasi",
    terms: "Ketentuan",
    advertising: "Kebijakan iklan",
  },
  en: {
    home: "Home",
    about: "About",
    privacy: "Privacy",
    terms: "Terms",
    advertising: "Advertising policy",
  },
} as const;

export function AppFooter({
  locale,
  onNavigate,
}: {
  locale: Locale;
  onNavigate: (path: string) => void;
}) {
  const pages = locale === "en" ? ENGLISH_TRUST_PAGES : TRUST_PAGES;
  const labels = FOOTER_LABELS[locale];
  const homePath = locale === "en" ? "/en" : "/";

  return (
    <footer
      className="border-t"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-soft)" }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-8 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p style={{ color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} {APP_BRAND.name} ·{" "}
          {locale === "en" ? APP_BRAND.sloganEn : APP_BRAND.slogan}
        </p>
        <nav
          aria-label={locale === "en" ? "Information and policies" : "Informasi dan kebijakan"}
          className="flex flex-wrap gap-x-4 gap-y-2"
        >
          <a
            href={homePath}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(homePath);
            }}
            className="inline-flex min-h-6 items-center transition hover:underline"
            style={{ color: "var(--text-secondary)" }}
          >
            {labels.home}
          </a>
          {pages.map((page) => (
            <a
              key={page.id}
              href={page.path}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(page.path);
              }}
              className="inline-flex min-h-6 items-center transition hover:underline"
              style={{ color: "var(--text-secondary)" }}
            >
              {labels[page.id]}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
