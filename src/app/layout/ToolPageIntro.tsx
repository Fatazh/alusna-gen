import { type ToolPage } from "../router/routes";

export function ToolPageIntro({ page }: { page: ToolPage }) {
  const english = page.locale === "en";
  return (
    <section aria-labelledby="tool-page-title" className="px-1 py-7 sm:py-9">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p
            className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--accent)" }}
          >
            ALUSNA / {page.topTab === "color" ? "Color tools" : page.topTab}
          </p>
          <h1
            id="tool-page-title"
            className="text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl"
            style={{ color: "var(--text-primary)" }}
          >
            {page.heading}
          </h1>
          <p
            className="mt-3 max-w-3xl text-sm leading-7 sm:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            {page.description}
          </p>
        </div>
        <p
          className="shrink-0 border-l-2 pl-3 text-[11px] leading-5"
          style={{ color: "var(--text-muted)", borderColor: "var(--amber)" }}
        >
          {english ? "Free" : "Gratis"}
          <br />
          {english ? "No account" : "Tanpa akun"}
          <br />
          {english ? "Processed in-browser" : "Diproses di browser"}
        </p>
      </div>
    </section>
  );
}
