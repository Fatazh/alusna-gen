const sponsorUrl = import.meta.env.VITE_SPONSOR_URL?.trim();
const sponsorTitle = import.meta.env.VITE_SPONSOR_TITLE?.trim().slice(0, 80);
const sponsorText = import.meta.env.VITE_SPONSOR_TEXT?.trim().slice(0, 180);

function safeSponsorUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

export function SponsorSlot() {
  const url = safeSponsorUrl(sponsorUrl);
  if (!url || !sponsorTitle) return null;

  return (
    <aside aria-label="Iklan sponsor" className="mb-5 rounded-xl border px-4 py-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--chip-bg)" }}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Sponsor</span>
          <p className="mt-0.5 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{sponsorTitle}</p>
          {sponsorText && <p className="mt-0.5 text-xs" style={{ color: "var(--text-secondary)" }}>{sponsorText}</p>}
        </div>
        <a href={url} target="_blank" rel="sponsored noopener noreferrer" className="shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
          Kunjungi sponsor
        </a>
      </div>
    </aside>
  );
}
