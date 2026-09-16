import { SEO_PAGES } from "../router/routes";
import { type NotFoundPage } from "../router/routes";

export function NotFoundView({ page }: { page: NotFoundPage }) {
  const english = page.locale === "en";
  return (
    <article
      className="mx-auto max-w-4xl rounded-2xl border px-5 py-10 text-center sm:px-8"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--card-bg)" }}
    >
      <p
        className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: "var(--accent)" }}
      >
        404
      </p>
      <h1
        className="mt-3 text-3xl font-extrabold tracking-[-0.03em]"
        style={{ color: "var(--text-primary)" }}
      >
        {page.heading}
      </h1>
      <p
        className="mx-auto mt-3 max-w-xl text-sm leading-7"
        style={{ color: "var(--text-secondary)" }}
      >
        {page.description}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a
          href={english ? "/en" : "/"}
          className="rounded-lg px-4 py-2 text-sm font-medium transition hover:brightness-110"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-contrast)" }}
        >
          {english ? "Back to home" : "Kembali ke beranda"}
        </a>
      </div>
      <nav
        aria-label={english ? "Popular tools" : "Alat populer"}
        className="mt-8 border-t pt-6"
        style={{ borderColor: "var(--border)" }}
      >
        <p
          className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: "var(--text-muted)" }}
        >
          {english ? "Popular tools" : "Alat populer"}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {SEO_PAGES.filter((tool) => tool.locale === page.locale)
            .slice(0, 6)
            .map((tool) => (
              <a
                key={tool.path}
                href={tool.path}
                className="rounded-full border px-3 py-1.5 text-xs font-medium transition hover:border-[var(--accent)]"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                {tool.heading}
              </a>
            ))}
        </div>
      </nav>
    </article>
  );
}
