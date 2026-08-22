import { APP_BRAND } from "../../shared/config/brand";
import { TRUST_PAGES } from "../router/routes";

export function AppFooter({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <footer className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-7 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p style={{ color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} {APP_BRAND.name} · {APP_BRAND.slogan}
        </p>
        <nav aria-label="Informasi dan kebijakan" className="flex flex-wrap gap-x-4 gap-y-2">
          <a
            href="/"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("/");
            }}
            className="inline-flex min-h-6 items-center transition hover:underline"
            style={{ color: "var(--text-secondary)" }}
          >
            Beranda
          </a>
          {TRUST_PAGES.map((page) => (
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
              {page.id === "about"
                ? "Tentang"
                : page.id === "privacy"
                  ? "Privasi"
                  : page.id === "terms"
                    ? "Ketentuan"
                    : "Kebijakan iklan"}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
