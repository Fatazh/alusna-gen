import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { ArrowUpRight } from "@phosphor-icons/react/ArrowUpRight";
import { APP_BRAND } from "../../shared/config/brand";
import { SEO_PAGES } from "../router/routes";

const WORKFLOW = [
  {
    step: "01",
    title: "Temukan arah warna",
    text: "Mulai dari palet, harmoni, gradien, atau warna dari gambar.",
    path: "/color-palette-generator",
  },
  {
    step: "02",
    title: "Tetapkan tipografi",
    text: "Bandingkan font dan susun hierarki teks yang konsisten.",
    path: "/font-pairing",
  },
  {
    step: "03",
    title: "Bangun sistem",
    text: "Ubah keputusan visual menjadi token siap dipakai developer.",
    path: "/design-token-generator",
  },
  {
    step: "04",
    title: "Satukan brand kit",
    text: "Rangkum warna, font, panduan, ekspor, dan aksesibilitas.",
    path: "/brand-kit-generator",
  },
] as const;

const TOOL_LABELS: Record<string, { eyebrow: string; label: string }> = {
  "/color-palette-generator": { eyebrow: "Inspirasi", label: "Buat palet warna" },
  "/color-matching": { eyebrow: "Harmoni", label: "Cocokkan kombinasi warna" },
  "/color-mixer": { eyebrow: "Eksperimen", label: "Campurkan dua warna" },
  "/gradient-generator": { eyebrow: "CSS", label: "Rancang gradien" },
  "/shade-generator": { eyebrow: "Design system", label: "Buat skala warna 50–950" },
  "/image-color-extractor": { eyebrow: "Gambar", label: "Ekstrak warna dominan" },
  "/color-blindness-simulator": { eyebrow: "Aksesibilitas", label: "Simulasikan buta warna" },
  "/contrast-checker": { eyebrow: "WCAG", label: "Periksa kontras warna" },
  "/font-pairing": { eyebrow: "Tipografi", label: "Bandingkan pasangan font" },
  "/design-token-generator": { eyebrow: "Developer handoff", label: "Hasilkan design token" },
  "/brand-kit-generator": { eyebrow: "Identitas", label: "Susun brand kit" },
};

const FEATURE_COLORS = ["#1E40AF", "#D81B60", "#F2B705", "#F2F4F7", "#111111"];

export function HomePageView({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div className="space-y-16 animate-fade-in sm:space-y-20">
      <section className="grid gap-10 border-b pb-12 lg:grid-cols-12 lg:gap-8 lg:pb-16">
        <div className="lg:col-span-7">
          <p
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Color · Typography · Brand systems
          </p>
          <h1
            className="mt-5 max-w-4xl text-5xl font-extrabold leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-[88px]"
            style={{ color: "var(--text-primary)" }}
          >
            {APP_BRAND.slogan}
          </h1>
          <p
            className="mt-7 max-w-2xl text-base leading-8 sm:text-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            Toolkit untuk desainer UI yang ingin bergerak dari eksplorasi visual menuju sistem yang
            siap dipakai—langsung di browser, tanpa akun.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PageLink
              path="/color-palette-generator"
              onNavigate={onNavigate}
              className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-bold"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-contrast)" }}
            >
              Mulai dari palet warna <ArrowRight size={17} />
            </PageLink>
            <PageLink
              path="/brand-kit-generator"
              onNavigate={onNavigate}
              className="inline-flex items-center justify-center rounded-md border px-5 py-3 text-sm font-bold"
            >
              Susun Brand Kit
            </PageLink>
          </div>
        </div>

        <div
          className="flex min-h-[360px] overflow-hidden rounded-lg border lg:col-span-5"
          style={{ borderColor: "var(--border)" }}
        >
          {FEATURE_COLORS.map((color, index) => (
            <a
              key={color}
              href="/color-palette-generator"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("/color-palette-generator");
              }}
              className="group relative flex-1 transition hover:flex-[1.35]"
              style={{ backgroundColor: color }}
              aria-label={`Buka palet warna dari swatch ${index + 1}`}
            >
              <span
                className="absolute bottom-4 left-1/2 -translate-x-1/2 -rotate-90 whitespace-nowrap font-mono text-[9px] font-semibold opacity-0 transition group-hover:opacity-100 group-focus:opacity-100"
                style={{ color: index === 2 || index === 3 ? "#111111" : "#ffffff" }}
              >
                {color}
              </span>
            </a>
          ))}
        </div>

        <dl className="grid gap-0 border-t pt-5 sm:grid-cols-3 lg:col-span-12">
          {[
            ["11 alat", "Satu alur desain"],
            ["Tanpa akun", "Langsung digunakan"],
            ["Browser-local", "File tetap di perangkat"],
          ].map(([value, label]) => (
            <div
              key={value}
              className="border-b py-4 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0"
            >
              <dt className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                {value}
              </dt>
              <dd className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                {label}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="home-tools-title">
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--magenta)" }}
            >
              Toolkit
            </p>
            <h2
              id="home-tools-title"
              className="mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              Semua alat ALUSNA
            </h2>
          </div>
          <p
            className="max-w-2xl text-sm leading-7 lg:col-span-6 lg:col-start-7"
            style={{ color: "var(--text-secondary)" }}
          >
            Gunakan satu alat untuk pekerjaan cepat atau lanjutkan dari warna, tipografi, design
            token, hingga panduan brand yang konsisten.
          </p>
        </div>

        <div className="mt-8 grid border-t sm:grid-cols-2">
          {SEO_PAGES.map((tool, index) => {
            const copy = TOOL_LABELS[tool.path];
            return (
              <PageLink
                key={tool.path}
                path={tool.path}
                onNavigate={onNavigate}
                className={`group flex min-h-40 items-start justify-between gap-5 border-b p-5 sm:p-6 ${index % 2 === 0 ? "sm:border-r" : ""}`}
              >
                <span>
                  <span
                    className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {String(index + 1).padStart(2, "0")} / {copy.eyebrow}
                  </span>
                  <strong
                    className="mt-4 block text-lg font-bold tracking-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {copy.label}
                  </strong>
                  <span
                    className="mt-2 block max-w-md text-xs leading-6"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {tool.description}
                  </span>
                </span>
                <ArrowUpRight
                  size={20}
                  className="shrink-0 transition group-hover:-translate-y-1 group-hover:translate-x-1"
                  style={{ color: "var(--accent)" }}
                />
              </PageLink>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="home-workflow-title" className="border-t pt-8">
        <h2
          id="home-workflow-title"
          className="text-3xl font-extrabold tracking-[-0.04em]"
          style={{ color: "var(--text-primary)" }}
        >
          Satu alur dari ide ke sistem
        </h2>
        <div className="mt-7 grid border-t md:grid-cols-4">
          {WORKFLOW.map((item) => (
            <PageLink
              key={item.step}
              path={item.path}
              onNavigate={onNavigate}
              className="border-b p-5 transition md:border-b-0 md:border-r md:last:border-r-0"
            >
              <span className="font-mono text-[10px] font-bold" style={{ color: "var(--accent)" }}>
                {item.step}
              </span>
              <strong
                className="mt-8 block text-sm font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {item.title}
              </strong>
              <span
                className="mt-2 block text-xs leading-5"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.text}
              </span>
            </PageLink>
          ))}
        </div>
      </section>
    </div>
  );
}

function PageLink({
  path,
  onNavigate,
  className,
  style,
  children,
}: {
  path: string;
  onNavigate: (path: string) => void;
  className: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <a
      href={path}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(path);
      }}
      className={`transition ${className}`}
      style={{ borderColor: "var(--border)", color: "var(--text-primary)", ...style }}
    >
      {children}
    </a>
  );
}
