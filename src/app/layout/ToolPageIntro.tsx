import { type SeoPage } from "../../lib/seoPages";

export function ToolPageIntro({ page }: { page: SeoPage }) {
  return (
    <section
      aria-labelledby="tool-page-title"
      className="mb-5 rounded-2xl border px-5 py-4"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--card-bg)" }}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1
            id="tool-page-title"
            className="text-xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {page.heading}
          </h1>
          <p
            className="mt-1 max-w-3xl text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {page.description}
          </p>
        </div>
        <p className="shrink-0 text-[11px]" style={{ color: "var(--text-muted)" }}>
          Gratis · Tanpa akun · Diproses di browser
        </p>
      </div>
    </section>
  );
}
