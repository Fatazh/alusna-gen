import { useLocale } from "../../shared/i18n";

export function ModuleLoading() {
  const { text } = useLocale();
  return (
    <div
      className="flex min-h-48 items-center justify-center rounded-2xl border text-sm"
      style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      role="status"
      aria-live="polite"
    >
      {text("Memuat modul…", "Loading module…")}
    </div>
  );
}
