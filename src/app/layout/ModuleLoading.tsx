import { useLocale } from "../../shared/i18n";

export function ModuleLoading() {
  const { text } = useLocale();
  return (
    <div
      className="min-h-48 rounded-2xl border p-6"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--card-bg)" }}
      role="status"
      aria-live="polite"
    >
      <div className="space-y-4" aria-hidden="true">
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-10 w-2/3 rounded-lg" />
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="skeleton h-24 rounded-xl" />
          <div className="skeleton h-24 rounded-xl" />
          <div className="skeleton h-24 rounded-xl" />
        </div>
      </div>
      <span className="sr-only">{text("Memuat modul…", "Loading module…")}</span>
    </div>
  );
}
