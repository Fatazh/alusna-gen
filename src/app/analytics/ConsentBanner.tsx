import { useCallback } from "react";
import { recordAnalyticsConsent } from "./consent";
import { useLocale } from "../../shared/i18n";

const COPY = {
  id: {
    message:
      "Kami menggunakan analitik tanpa cookie (Google Analytics 4 dengan penyimpanan analitik dinonaktifkan) untuk mengukur halaman mana yang paling digunakan — tanpa iklan, tanpa penjualan data, tanpa identitas Anda.",
    accept: "Izinkan analitik",
    decline: "Tidak, terima kasih",
    policy: "Kebijakan Privasi",
  },
  en: {
    message:
      "We use cookieless analytics (Google Analytics 4 with analytics storage disabled) to learn which pages are most used — no ads, no data sales, no identity of yours.",
    accept: "Allow analytics",
    decline: "No, thanks",
    policy: "Privacy Policy",
  },
} as const;

export function ConsentBanner({ visible, onDecided }: { visible: boolean; onDecided: () => void }) {
  const { locale } = useLocale();
  const copy = COPY[locale];

  const decide = useCallback(
    (consent: "granted" | "denied") => {
      recordAnalyticsConsent(consent);
      onDecided();
    },
    [onDecided],
  );

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t px-4 py-4 sm:px-6"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--chrome-bg)",
        boxShadow: "var(--shadow-soft)",
      }}
      role="region"
      aria-label={locale === "en" ? "Analytics consent" : "Persetujuan analitik"}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-3xl text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {copy.message}{" "}
          <a
            href={locale === "en" ? "/en/privacy" : "/privasi"}
            className="underline decoration-dotted underline-offset-2 transition hover:opacity-80"
            style={{ color: "var(--accent)" }}
          >
            {copy.policy}
          </a>
          .
        </p>
        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide("denied")}
            className="rounded-md border px-3 py-2 text-xs font-semibold transition hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            {copy.decline}
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="rounded-md px-4 py-2 text-xs font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
