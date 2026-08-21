export function ModuleLoading() {
  return (
    <div
      className="flex min-h-48 items-center justify-center rounded-2xl border text-sm"
      style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      role="status"
      aria-live="polite"
    >
      Memuat modul…
    </div>
  );
}
