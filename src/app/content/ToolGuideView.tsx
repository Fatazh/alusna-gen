import { type ToolPage } from "../router/routes";
import { getRelatedTools, getToolGuide } from "./toolGuides";

export function ToolGuideView({
  page,
  onNavigate,
}: {
  page: ToolPage;
  onNavigate: (path: string) => void;
}) {
  const guide = getToolGuide(page);
  const relatedTools = getRelatedTools(guide);

  return (
    <article
      data-evergreen-content={page.path}
      className="mt-10 space-y-7 rounded-3xl border px-5 py-7 sm:px-8 sm:py-9"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--card-bg)" }}
    >
      <header className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
          Panduan praktis
        </p>
        <h2 className="mt-2 text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Cara menggunakan {page.heading}
        </h2>
        <p className="mt-3 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
          {guide.overview}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="tool-guide-steps">
          <h3 id="tool-guide-steps" className="text-base font-semibold theme-text">
            Langkah penggunaan
          </h3>
          <ol className="mt-3 space-y-3">
            {guide.steps.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm leading-6 theme-text-sub">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ color: "var(--text-primary)", backgroundColor: "var(--chip-active-bg)" }}
                >
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="space-y-5">
          <GuideList title="Cocok digunakan untuk" items={guide.useCases} />
          <GuideList title="Catatan penting" items={guide.tips} />
        </div>
      </div>

      <section aria-labelledby="related-tools-title" className="border-t pt-6 theme-border">
        <h3 id="related-tools-title" className="text-base font-semibold theme-text">
          Lanjutkan dengan alat terkait
        </h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {relatedTools.map((related) => (
            <a
              key={related.path}
              href={related.path}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(related.path);
              }}
              className="rounded-xl border px-4 py-3 transition hover:bg-black/5 dark:hover:bg-white/5"
              style={{ borderColor: "var(--border)" }}
            >
              <strong className="block text-sm theme-text">{related.heading}</strong>
              <span className="mt-1 block text-xs leading-5 theme-text-muted">
                {related.description}
              </span>
            </a>
          ))}
        </div>
      </section>
    </article>
  );
}

function GuideList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <section>
      <h3 className="text-sm font-semibold theme-text">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm leading-6 theme-text-sub">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true" className="text-indigo-500">
              •
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
