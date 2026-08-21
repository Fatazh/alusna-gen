import { getConfiguredSponsor } from "./advertising";

export function AdvertisingSlot() {
  const sponsor = getConfiguredSponsor();
  if (!sponsor) return null;

  return (
    <aside
      aria-label="Iklan sponsor"
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
            Iklan / Sponsor
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
          Kunjungi sponsor
        </a>
      </div>
      <a
        href="/kebijakan-iklan"
        className="mt-2 inline-block text-[10px] underline"
        style={{ color: "var(--text-muted)" }}
      >
        Cara ALUSNA menangani iklan dan afiliasi
      </a>
    </aside>
  );
}
