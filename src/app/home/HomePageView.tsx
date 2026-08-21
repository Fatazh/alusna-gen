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

export function HomePageView({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <section
        className="relative overflow-hidden rounded-3xl border px-5 py-10 sm:px-10 sm:py-14"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card-bg)" }}
      >
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl"
        />
        <div className="relative max-w-4xl">
          <p
            className="text-xs font-semibold uppercase tracking-[0.22em]"
            style={{ color: "var(--text-muted)" }}
          >
            Color, typography &amp; brand toolkit
          </p>
          <h1
            className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl"
            style={{ color: "var(--text-primary)" }}
          >
            {APP_BRAND.slogan}
          </h1>
          <p
            className="mt-5 max-w-2xl text-base leading-8 sm:text-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            Dari eksplorasi warna sampai brand kit siap pakai, ALUSNA membantu memperbagus keputusan
            desain tanpa akun dan tanpa memindahkan file kerja Anda ke server kami.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <PageLink
              path="/color-palette-generator"
              onNavigate={onNavigate}
              className="bg-indigo-600 text-white hover:bg-indigo-500"
            >
              Mulai dari palet warna
            </PageLink>
            <PageLink
              path="/brand-kit-generator"
              onNavigate={onNavigate}
              className="border hover:bg-black/5 dark:hover:bg-white/5"
            >
              Susun Brand Kit
            </PageLink>
          </div>
          <dl className="mt-9 grid max-w-2xl grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            {[
              ["11 alat", "Satu alur desain"],
              ["Tanpa akun", "Langsung digunakan"],
              ["Browser-local", "File tetap di perangkat"],
            ].map(([value, label]) => (
              <div
                key={value}
                className="rounded-xl border px-4 py-3"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--chip-bg)" }}
              >
                <dt className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  {value}
                </dt>
                <dd className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="home-tools-title">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
            Pilih sesuai kebutuhan
          </p>
          <h2
            id="home-tools-title"
            className="mt-2 text-2xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Semua alat ALUSNA
          </h2>
          <p className="mt-2 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
            Gunakan satu alat untuk pekerjaan cepat atau lanjutkan dari warna, tipografi, design
            token, hingga panduan brand yang konsisten.
          </p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SEO_PAGES.map((tool) => {
            const copy = TOOL_LABELS[tool.path];
            return (
              <PageLink
                key={tool.path}
                path={tool.path}
                onNavigate={onNavigate}
                className="group min-h-32 border p-5 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span
                  className="text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  {copy.eyebrow}
                </span>
                <strong className="mt-2 block text-base" style={{ color: "var(--text-primary)" }}>
                  {copy.label}
                </strong>
                <span
                  className="mt-2 block text-xs leading-5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {tool.description}
                </span>
                <span className="mt-4 block text-xs font-semibold text-indigo-500">
                  Buka alat <span aria-hidden="true">→</span>
                </span>
              </PageLink>
            );
          })}
        </div>
      </section>

      <section
        aria-labelledby="home-workflow-title"
        className="rounded-3xl border px-5 py-7 sm:px-8"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card-bg)" }}
      >
        <h2
          id="home-workflow-title"
          className="text-2xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Satu alur dari ide ke sistem
        </h2>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {WORKFLOW.map((item) => (
            <PageLink
              key={item.step}
              path={item.path}
              onNavigate={onNavigate}
              className="border p-4 hover:bg-black/5 dark:hover:bg-white/5"
            >
              <span className="text-xs font-bold text-indigo-500">{item.step}</span>
              <strong className="mt-2 block text-sm" style={{ color: "var(--text-primary)" }}>
                {item.title}
              </strong>
              <span
                className="mt-1.5 block text-xs leading-5"
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
  children,
}: {
  path: string;
  onNavigate: (path: string) => void;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={path}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(path);
      }}
      className={`rounded-2xl transition ${className}`}
    >
      {children}
    </a>
  );
}
