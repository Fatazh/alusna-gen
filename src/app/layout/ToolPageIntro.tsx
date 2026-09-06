import { type ToolPage } from "../router/routes";

export function ToolPageIntro({ page }: { page: ToolPage }) {
  const english = page.locale === "en";
  return (
    <section
      aria-labelledby="tool-page-title"
      className="border-b px-1 py-8 sm:py-10"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
        <div className="max-w-4xl">
          <p
            className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--accent)" }}
          >
            ALUSNA / {page.topTab === "color" ? "Color tools" : page.topTab}
          </p>
          <h1
            id="tool-page-title"
            className="text-3xl font-extrabold leading-[1.05] tracking-[-0.045em] sm:text-5xl"
            style={{ color: "var(--text-primary)" }}
          >
            {page.heading}
          </h1>
          <p
            className="mt-4 max-w-3xl text-sm leading-7 sm:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            {page.description}
          </p>
        </div>
        <dl
          className="grid grid-cols-3 gap-3 border-t pt-4 text-[10px] uppercase tracking-[0.12em] lg:block lg:space-y-3 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          <div>
            <dt>{english ? "Access" : "Akses"}</dt>
            <dd
              className="mt-1 font-mono text-xs normal-case tracking-normal"
              style={{ color: "var(--text-primary)" }}
            >
              {english ? "Free" : "Gratis"}
            </dd>
          </div>
          <div>
            <dt>{english ? "Account" : "Akun"}</dt>
            <dd
              className="mt-1 font-mono text-xs normal-case tracking-normal"
              style={{ color: "var(--text-primary)" }}
            >
              {english ? "Not required" : "Tidak perlu"}
            </dd>
          </div>
          <div>
            <dt>{english ? "Processing" : "Proses"}</dt>
            <dd
              className="mt-1 font-mono text-xs normal-case tracking-normal"
              style={{ color: "var(--text-primary)" }}
            >
              {english ? "In browser" : "Di browser"}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
