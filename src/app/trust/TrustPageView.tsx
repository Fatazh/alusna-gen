import { type ReactNode } from "react";
import { APP_BRAND } from "../../shared/config/brand";
import { type Locale } from "../../shared/i18n";
import { type TrustPage, type TrustPageId } from "../router/routes";

type SectionCopy = { title: string; body: string };
type TrustCopy = Record<TrustPageId, SectionCopy[]>;

const COPY: Record<Locale, TrustCopy> = {
  id: {
    about: [
      {
        title: "Apa itu ALUSNA?",
        body: `${APP_BRAND.name} adalah toolkit berbasis browser untuk membantu eksplorasi warna, tipografi, design token, dan brand kit. Tujuannya adalah membuat pekerjaan dasar desain lebih cepat tanpa mewajibkan akun.`,
      },
      {
        title: "Cara kerja",
        body: "Perhitungan warna, pembuatan token, dan ekstraksi palet gambar dijalankan di perangkat pengguna. Pilihan yang perlu bertahan setelah halaman ditutup disimpan di penyimpanan lokal browser.",
      },
      {
        title: "Model pendanaan",
        body: "Fitur inti tersedia gratis. Operasional situs dapat didukung oleh iklan, sponsor langsung, atau tautan afiliasi yang selalu diberi label dan tidak mengubah hasil alat.",
      },
    ],
    privacy: [
      {
        title: "Data yang disimpan di browser",
        body: "Tema, warna, palet, metadata font upload, dan Brand Kit disimpan melalui localStorage di perangkat pengguna. Data ini tidak otomatis dikirim ke server ALUSNA.",
      },
      {
        title: "File gambar, logo, dan font",
        body: "Ekstraksi warna gambar berlangsung lokal di browser. Font dan logo yang dipilih dapat disimpan sebagai data lokal browser dan dihapus melalui pengaturan data situs.",
      },
      {
        title: "Layanan eksternal",
        body: "Ketika Google Font dipilih, browser dapat meminta file dari fonts.googleapis.com atau fonts.gstatic.com. Tautan sponsor dan afiliasi menuju situs pihak ketiga dengan kebijakan privasinya sendiri.",
      },
      {
        title: "Iklan dan pengukuran",
        body: "Build standar tidak mengaktifkan jaringan iklan atau analitik pihak ketiga. Event halaman anonim nonaktif secara default dan tidak dikirim ke jaringan. Kebijakan serta mekanisme persetujuan akan diperbarui sebelum layanan eksternal diaktifkan.",
      },
    ],
    terms: [
      {
        title: "Penggunaan alat",
        body: "ALUSNA disediakan sebagai alat bantu desain umum. Pengguna bertanggung jawab memeriksa ketepatan hasil, lisensi aset, aksesibilitas, dan kelayakan output sebelum digunakan dalam produksi.",
      },
      {
        title: "Ketersediaan layanan",
        body: "Layanan disediakan apa adanya dan dapat berubah untuk keamanan, kompatibilitas, atau fitur. Tidak ada jaminan bahwa situs selalu tersedia tanpa gangguan.",
      },
      {
        title: "Penggunaan yang dilarang",
        body: "Pengguna tidak boleh menyalahgunakan situs untuk melanggar hukum, merusak layanan, menyebarkan malware, atau melanggar hak pihak lain.",
      },
      {
        title: "Konten dan aset pengguna",
        body: "Hak atas file dan data yang dimasukkan tetap berada pada pemiliknya. Pengguna harus memiliki izin untuk memakai logo, font, gambar, dan materi lain.",
      },
    ],
    advertising: [
      {
        title: "Label yang jelas",
        body: "Penempatan berbayar ditandai sebagai “Iklan / Sponsor”. Tautan komersial memakai atribut sponsored dan tidak disamarkan sebagai kontrol utama aplikasi.",
      },
      {
        title: "Afiliasi",
        body: "ALUSNA dapat menerima komisi dari tautan afiliasi. Komisi tidak menentukan hasil generator maupun penilaian aksesibilitas.",
      },
      {
        title: "Pemisahan dari hasil alat",
        body: "Sponsor tidak memperoleh akses untuk mengubah algoritme warna, rekomendasi tipografi, design token, atau Brand Kit yang dihasilkan.",
      },
      {
        title: "Pihak ketiga",
        body: "Situs tujuan dan jaringan iklan dapat memiliki praktik data sendiri. Baca kebijakan pihak ketiga sebelum memberikan data atau melakukan transaksi.",
      },
    ],
  },
  en: {
    about: [
      {
        title: "What is ALUSNA?",
        body: `${APP_BRAND.name} is a browser-based toolkit for exploring color, typography, design tokens, and brand kits. It helps designers complete foundational work faster without requiring an account.`,
      },
      {
        title: "How it works",
        body: "Color calculations, token generation, and image-palette extraction run on your device. Preferences that need to persist are stored in your browser's local storage.",
      },
      {
        title: "Funding model",
        body: "Core features are free. Site operations may be supported by clearly labeled advertising, direct sponsorships, or affiliate links that never alter tool results.",
      },
    ],
    privacy: [
      {
        title: "Data stored in your browser",
        body: "Theme, colors, palettes, uploaded-font metadata, and Brand Kit data are stored in localStorage on your device. They are not automatically sent to an ALUSNA server.",
      },
      {
        title: "Images, logos, and fonts",
        body: "Image color extraction runs locally. Selected fonts and logos may be stored in browser data and can be removed through your browser's site-data settings.",
      },
      {
        title: "External services",
        body: "Selecting a Google Font may request files from fonts.googleapis.com or fonts.gstatic.com. Sponsor and affiliate links lead to third-party sites with their own privacy policies.",
      },
      {
        title: "Advertising and measurement",
        body: "The standard build does not enable third-party ad networks or analytics. Anonymous page events are disabled by default and are not sent over the network. This policy and consent controls will be updated before any external service is activated.",
      },
    ],
    terms: [
      {
        title: "Using the tools",
        body: "ALUSNA provides general design assistance. You are responsible for checking accuracy, asset licenses, accessibility, and output suitability before production use.",
      },
      {
        title: "Service availability",
        body: "The service is provided as-is and may change for security, compatibility, or product improvements. Continuous availability is not guaranteed.",
      },
      {
        title: "Prohibited use",
        body: "You must not use the site to break the law, damage the service, distribute malware, or infringe another party's rights.",
      },
      {
        title: "User content and assets",
        body: "Ownership of submitted files and data remains with their owner. You must have permission to use every logo, font, image, and other asset.",
      },
    ],
    advertising: [
      {
        title: "Clear labeling",
        body: "Paid placements are labeled “Ad / Sponsor”. Commercial links use the sponsored attribute and are not disguised as primary application controls.",
      },
      {
        title: "Affiliate links",
        body: "ALUSNA may earn a commission through affiliate links. Commissions do not determine generator output or accessibility assessments.",
      },
      {
        title: "Independent tool results",
        body: "Sponsors cannot alter color algorithms, typography recommendations, design tokens, or generated Brand Kits.",
      },
      {
        title: "Third parties",
        body: "Destination sites and ad networks may follow their own data practices. Review their policies before sharing data or completing a transaction.",
      },
    ],
  },
};

export function TrustPageView({ page }: { page: TrustPage }) {
  const updated = page.locale === "en" ? "August 21, 2026" : "21 Agustus 2026";
  return (
    <article
      className="mx-auto max-w-4xl rounded-2xl border px-5 py-6 sm:px-8 sm:py-8"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--card-bg)" }}
    >
      <header className="mb-8 border-b pb-5" style={{ borderColor: "var(--border)" }}>
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
          {page.heading}
        </h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {page.description}
        </p>
        <p className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
          {page.locale === "en" ? "Last updated" : "Terakhir diperbarui"}: {updated}
        </p>
      </header>
      <div className="space-y-7">
        {COPY[page.locale][page.id].map((section) => (
          <Section key={section.title} title={section.title}>
            <p>{section.body}</p>
          </Section>
        ))}
        <ContactSection locale={page.locale} />
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
        {title}
      </h2>
      <div className="mt-2 space-y-2 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
        {children}
      </div>
    </section>
  );
}

function ContactSection({ locale }: { locale: Locale }) {
  const configuredEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim();
  const email =
    configuredEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuredEmail) ? configuredEmail : null;
  return (
    <Section title={locale === "en" ? "Contact" : "Kontak"}>
      {email ? (
        <p>
          {locale === "en"
            ? "Privacy requests, questions, and advertising reports can be sent to"
            : "Pertanyaan, permintaan privasi, atau laporan iklan dapat dikirim ke"}{" "}
          <a className="underline" href={`mailto:${email}`}>
            {email}
          </a>
          .
        </p>
      ) : (
        <p>
          {locale === "en"
            ? "The official contact address will appear after the ALUSNA production domain is configured."
            : "Alamat kontak resmi akan ditampilkan setelah domain produksi ALUSNA dikonfigurasi."}
        </p>
      )}
    </Section>
  );
}
