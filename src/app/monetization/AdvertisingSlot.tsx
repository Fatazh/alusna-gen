import { getConfiguredSponsor } from "./advertising";
import { useLocale } from "../../shared/i18n";
import { ENGLISH_TRUST_PAGES, TRUST_PAGES } from "../router/routes";

export function AdvertisingSlot() {
  const { locale, text } = useLocale();
  const sponsor = getConfiguredSponsor();
  if (!sponsor) return null;

  return (
    <aside
      aria-label={text("Iklan sponsor", "Sponsored advertisement")}
      data-ad-placement="tool-top"
      className="mb-5 rounded-xl border px-4 py-3"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--chip-bg)" }}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            {text("Iklan / Sponsor", "Ad / Sponsor")}
          </span>
          <p className="mt-0.5 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {sponsor.title}
          </p>
          {sponsor.text && (
            <p className="mt-0.5 text-xs" style={{ color: "var(--text-secondary)" }}>
              {sponsor.text}
            </p>
          )}
        </div>
        <a
          href={sponsor.url}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition hover:bg-black/5 dark:hover:bg-white/5"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
        >
          {text("Kunjungi sponsor", "Visit sponsor")}
        </a>
      </div>
      <a
        href={
          (locale === "en" ? ENGLISH_TRUST_PAGES : TRUST_PAGES).find(
            (page) => page.id === "advertising",
          )?.path
        }
        className="mt-2 inline-block text-[10px] underline"
        style={{ color: "var(--text-muted)" }}
      >
        {text(
          "Cara ALUSNA menangani iklan dan afiliasi",
          "How ALUSNA handles advertising and affiliates",
        )}
      </a>
    </aside>
  );
}
