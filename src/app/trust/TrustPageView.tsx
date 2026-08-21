import { type ReactNode } from "react";
import { APP_BRAND } from "../../shared/config/brand";
import { type TrustPage } from "../router/routes";

const LAST_UPDATED = "21 Agustus 2026";

export function TrustPageView({ page }: { page: TrustPage }) {
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
          Terakhir diperbarui: {LAST_UPDATED}
        </p>
      </header>
      <div className="space-y-7">
        {page.id === "about" && <AboutContent />}
        {page.id === "privacy" && <PrivacyContent />}
        {page.id === "terms" && <TermsContent />}
        {page.id === "advertising" && <AdvertisingContent />}
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

function AboutContent() {
  return (
    <>
      <Section title="Apa itu ALUSNA?">
        <p>
          {APP_BRAND.name} adalah toolkit berbasis browser untuk membantu eksplorasi warna,
          tipografi, design token, dan brand kit. Tujuannya adalah membuat pekerjaan dasar desain
          lebih cepat tanpa mewajibkan akun.
        </p>
      </Section>
      <Section title="Cara kerja">
        <p>
          Perhitungan warna, pembuatan token, dan ekstraksi palet gambar dijalankan di perangkat
          pengguna. Pilihan yang perlu bertahan setelah halaman ditutup disimpan di penyimpanan
          lokal browser.
        </p>
      </Section>
      <Section title="Model pendanaan">
        <p>
          Fitur inti tersedia gratis. Operasional situs dapat didukung oleh iklan, sponsor langsung,
          atau tautan afiliasi yang selalu diberi label dan tidak mengubah hasil alat.
        </p>
      </Section>
      <ContactSection />
    </>
  );
}

function PrivacyContent() {
  return (
    <>
      <Section title="Data yang disimpan di browser">
        <p>
          Tema, warna, palet, metadata font upload, dan Brand Kit disimpan melalui localStorage di
          perangkat pengguna. Data ini tidak otomatis dikirim ke server ALUSNA.
        </p>
      </Section>
      <Section title="File gambar, logo, dan font">
        <p>
          Ekstraksi warna gambar berlangsung lokal di browser. Font dan logo yang dipilih untuk
          disimpan dapat disimpan sebagai data lokal browser. Pengguna dapat menghapusnya dengan
          menghapus data situs melalui pengaturan browser.
        </p>
      </Section>
      <Section title="Layanan eksternal">
        <p>
          Ketika Google Font dipilih, browser dapat meminta file CSS dan font dari
          fonts.googleapis.com atau fonts.gstatic.com. Membuka tautan sponsor atau afiliasi akan
          membawa pengguna ke situs pihak ketiga yang memiliki kebijakan privasinya sendiri.
        </p>
      </Section>
      <Section title="Iklan dan pengukuran">
        <p>
          Build standar tidak mengaktifkan script jaringan iklan atau analitik pihak ketiga. ALUSNA
          hanya menyediakan event halaman anonim yang nonaktif secara default dan tidak mengirim
          data ke jaringan. Jika layanan yang menggunakan cookie, identifier, atau transmisi
          eksternal ditambahkan, kebijakan ini dan mekanisme persetujuan akan diperbarui sebelum
          aktivasi sesuai kebutuhan hukum dan penyedia.
        </p>
      </Section>
      <ContactSection />
    </>
  );
}

function TermsContent() {
  return (
    <>
      <Section title="Penggunaan alat">
        <p>
          ALUSNA disediakan sebagai alat bantu desain umum. Pengguna bertanggung jawab memeriksa
          ketepatan hasil, lisensi font atau aset, aksesibilitas, dan kelayakan output sebelum
          digunakan dalam proyek produksi.
        </p>
      </Section>
      <Section title="Ketersediaan layanan">
        <p>
          Layanan disediakan apa adanya dan dapat berubah untuk perbaikan keamanan, kompatibilitas,
          atau fitur. Tidak ada jaminan bahwa situs akan selalu tersedia tanpa gangguan.
        </p>
      </Section>
      <Section title="Penggunaan yang dilarang">
        <p>
          Pengguna tidak boleh menyalahgunakan situs untuk melanggar hukum, merusak layanan,
          menyebarkan malware, atau melanggar hak pihak lain.
        </p>
      </Section>
      <Section title="Konten dan aset pengguna">
        <p>
          Hak atas file dan data yang dimasukkan tetap berada pada pemiliknya. Pengguna harus
          memastikan bahwa mereka memiliki izin untuk memakai logo, font, gambar, dan materi lain.
        </p>
      </Section>
      <ContactSection />
    </>
  );
}

function AdvertisingContent() {
  return (
    <>
      <Section title="Label yang jelas">
        <p>
          Penempatan berbayar ditandai sebagai “Iklan / Sponsor”. Tautan komersial memakai atribut
          sponsored dan tidak disamarkan sebagai kontrol utama aplikasi.
        </p>
      </Section>
      <Section title="Afiliasi">
        <p>
          ALUSNA dapat menerima komisi ketika pengguna membuka atau membeli melalui tautan afiliasi.
          Biaya pengguna tidak selalu berubah, dan komisi tidak menentukan hasil generator maupun
          penilaian aksesibilitas.
        </p>
      </Section>
      <Section title="Pemisahan dari hasil alat">
        <p>
          Sponsor tidak memperoleh akses untuk mengubah algoritme warna, rekomendasi tipografi,
          design token, atau Brand Kit yang dihasilkan.
        </p>
      </Section>
      <Section title="Pihak ketiga">
        <p>
          Situs tujuan dan jaringan iklan dapat memiliki praktik data sendiri. Pengguna sebaiknya
          membaca kebijakan pihak ketiga sebelum memberikan data atau melakukan transaksi.
        </p>
      </Section>
      <ContactSection />
    </>
  );
}

function ContactSection() {
  const configuredEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim();
  const email =
    configuredEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuredEmail) ? configuredEmail : null;

  return (
    <Section title="Kontak">
      {email ? (
        <p>
          Pertanyaan, permintaan privasi, atau laporan iklan dapat dikirim ke{" "}
          <a className="underline" href={`mailto:${email}`}>
            {email}
          </a>
          .
        </p>
      ) : (
        <p>Alamat kontak resmi akan ditampilkan setelah domain produksi ALUSNA dikonfigurasi.</p>
      )}
    </Section>
  );
}
