import { type Locale } from "../../shared/i18n/locale.ts";
import { type TrustPageId } from "../router/routes.ts";

export type TrustSection = {
  title: string;
  body?: string;
  bullets?: string[];
};

export const TRUST_PAGE_UPDATED: Record<Locale, string> = {
  id: "15 September 2026",
  en: "September 15, 2026",
};

const ABOUT_ID: TrustSection[] = [
  {
    title: "Apa itu ALUSNA?",
    body: "ALUSNA adalah toolkit desain berbasis browser untuk eksplorasi warna, tipografi, design token, dan brand kit. Seluruh fitur inti tersedia tanpa akun, tanpa biaya, dan berjalan langsung di perangkat Anda.",
  },
  {
    title: "Cara kerja",
    body: "Perhitungan warna, pembuatan token, dan ekstraksi palet dari gambar dijalankan sepenuhnya di browser Anda — termasuk pemrosesan gambar di Web Worker agar antarmuka tetap responsif. Pilihan yang perlu bertahan disimpan di penyimpanan lokal perangkat (IndexedDB), bukan di server kami.",
  },
  {
    title: "Komitmen privasi",
    body: "Data desain Anda tidak pernah dikirim ke server ALUSNA. Situs ini tidak memakai akun pengguna, cookie pelacakan, atau jaringan iklan pihak ketiga secara bawaan. Rinciannya dijelaskan pada Kebijakan Privasi.",
  },
  {
    title: "Model pendanaan",
    body: "Fitur inti gratis. Operasional situs dapat didukung oleh slot sponsor berlabel, tautan afiliasi, atau tombol dukungan sukarela. Pendanaan tidak pernah memengaruhi hasil alat, dan setiap penempatan komersial diungkapkan secara terbuka pada Kebijakan Iklan dan Afiliasi.",
  },
];

const PRIVACY_ID: TrustSection[] = [
  {
    title: "1. Ringkasan",
    body: "Kebijakan ini menjelaskan data apa yang dikelola ALUSNA, di mana data itu berada, dan layanan pihak ketiga mana yang dapat menerima permintaan dari browser Anda saat Anda menggunakan situs ini. Intinya: pekerjaan desain Anda tetap di perangkat Anda.",
  },
  {
    title: "2. Data yang kami kelola dan tempat penyimpanannya",
    body: "Tidak ada data desain yang dikirim ke atau disimpan di server ALUSNA. Data berikut disimpan secara lokal di browser Anda melalui IndexedDB (basis data “alusna-studio”):",
    bullets: [
      "Tema, warna, dan palet yang Anda buat atau simpan.",
      "Metadata dan berkas font yang Anda unggah (disimpan sebagai data base64 di perangkat Anda).",
      "Logo dan aset brand yang Anda lampirkan.",
      "Konfigurasi Brand Kit dan preferensi studio lainnya.",
    ],
  },
  {
    title: "3. Kompatibilitas penyimpanan",
    body: "Saat pertama kali dibuka, aplikasi menyalin data dari penyimpanan lama berbasis localStorage (termasuk data legacy “cikp-studio”) ke IndexedDB satu kali. Salinan localStorage dipertahankan sebagai cadangan rollback dan tidak pernah dikirim ke mana pun. Bila IndexedDB tidak tersedia di browser Anda, aplikasi secara otomatis memakai localStorage.",
  },
  {
    title: "4. Data yang tidak pernah dikirim ke server",
    body: "ALUSNA tidak memiliki proses unggah ke server. Gambar yang dipakai untuk ekstraksi palet diproses lokal di browser (Web Worker dengan fallback main-thread), dan font, logo, maupun berkas lain yang Anda muat tidak pernah meninggalkan perangkat. Situs ini tidak menyediakan pendaftaran akun sehingga kami tidak mengumpulkan nama, email, atau data identitas lain.",
  },
  {
    title: "5. Layanan pihak ketiga",
    body: "Beberapa tindakan Anda di situs ini dapat memicu permintaan langsung dari browser ke layanan pihak ketiga:",
    bullets: [
      "Google Fonts — memuat font pilihan dapat mengirim permintaan ke fonts.googleapis.com dan fonts.gstatic.com. Permintaan tersebut tunduk pada kebijakan privasi Google.",
      "Tautan sponsor dan afiliasi — mengarah ke situs pihak ketiga dengan kebijakan privasinya masing-masing.",
      "Platform dukungan/donasi — tombol dukungan membuka platform pihak ketiga (mis. Trakteer); data pembayaran diproses oleh platform tersebut, bukan ALUSNA.",
    ],
  },
  {
    title: "6. Analitik dan pengukuran",
    body: 'Build standar tidak mengaktifkan jaringan iklan, analitik pihak ketiga, maupun pengiriman data ke server. Bila analitik halaman anonim diaktifkan, ia berjalan tanpa cookie dan hanya setelah Anda menekan "Izinkan analitik" pada banner persetujuan; keputusan Anda disimpan di perangkat Anda dan dapat diubah dengan menghapus data situs. Hanya nama halaman yang dikirim — tanpa string kueri, tanpa konten pengguna, tanpa profil iklan.',
  },
  {
    title: "7. Hak dan kontrol Anda",
    body: "Karena seluruh data berada di perangkat Anda, Anda memegang kendali penuh: hapus data situs melalui pengaturan browser untuk menghapus palet, font, logo, dan Brand Kit; atau cukup tutup dan buka kembali situs tanpa kehilangan apa pun. Tidak ada proses ekspor khusus yang diperlukan karena data tidak pernah keluar dari perangkat Anda.",
  },
  {
    title: "8. Perubahan kebijakan",
    body: "Kami dapat memperbarui kebijakan ini seiring perkembangan layanan. Perubahan material akan diumumkan pada halaman ini beserta tanggal berlakunya sebelum atau pada saat perubahan efektif.",
  },
];

const TERMS_ID: TrustSection[] = [
  {
    title: "1. Penerimaan ketentuan",
    body: "Dengan mengakses atau menggunakan ALUSNA, Anda menyetujui ketentuan ini. Jika Anda tidak menyetujui ketentuan ini, hentikan penggunaan situs. Kami dapat memperbarui ketentuan dari waktu ke waktu; versi terbaru selalu tersedia di halaman ini, dan penggunaan berkelanjutan setelah perubahan dianggap sebagai penerimaan.",
  },
  {
    title: "2. Deskripsi layanan",
    body: "ALUSNA menyediakan alat bantu desain umum — palet warna, pencocokan warna, gradien, skala warna, pemeriksa kontras, tipografi, design token, dan brand kit — yang berjalan sepenuhnya di browser tanpa akun. Layanan disediakan sebagaimana adanya.",
  },
  {
    title: "3. Kelayakan penggunaan",
    body: "Anda menyatakan memiliki kapasitas hukum untuk menyetujui ketentuan ini. Jika Anda menggunakan ALUSNA untuk atau atas nama organisasi, Anda menyatakan memiliki kewenangan untuk mengikat organisasi tersebut pada ketentuan ini.",
  },
  {
    title: "4. Penggunaan yang dilarang",
    body: "Anda dilarang menggunakan situs untuk:",
    bullets: [
      "Melanggar hukum atau peraturan yang berlaku.",
      "Mengganggu, menguji keamanan tanpa otorisasi, atau merusak ketersediaan layanan.",
      "Menyebarkan malware, kode berbahaya, atau konten ilegal.",
      "Melanggar hak kekayaan intelektual pihak lain, termasuk menggunakan aset tanpa izin.",
      "Menyalahgunakan situs secara otomatis (scraping berlebihan, permintaan otomatis yang memberatkan layanan).",
      "Menyalahgunakan nama, merek, atau reputasi ALUSNA.",
    ],
  },
  {
    title: "5. Konten dan aset pengguna",
    body: "Seluruh hak atas berkas, gambar, font, dan data yang Anda muat tetap berada pada pemiliknya. Karena ALUSNA memproses aset tersebut sepenuhnya di browser Anda dan tidak pernah menerimanya di server, tidak ada lisensi atas aset Anda yang diberikan kepada ALUSNA. Anda bertanggung jawab memastikan memiliki izin untuk menggunakan setiap aset yang Anda muat.",
  },
  {
    title: "6. Hasil keluaran",
    body: "Palet warna, design token, Brand Kit, dan keluaran lain yang Anda hasilkan dengan ALUSNA sepenuhnya milik Anda dan bebas Anda gunakan untuk keperluan apa pun, termasuk keperluan komersial.",
  },
  {
    title: "7. Kekayaan intelektual ALUSNA",
    body: "Nama, merek, kode sumber, antarmuka, dan desain ALUSNA dilindungi hukum kekayaan intelektual. Anda tidak diberikan lisensi untuk menyalin, memodifikasi, atau mendistribusikan bagian-bagian tersebut selain yang diperuntukkan oleh fungsi layanan.",
  },
  {
    title: "8. Ketersediaan dan perubahan layanan",
    body: "Layanan dapat berubah untuk alasan keamanan, kompatibilitas, atau penyempurnaan fitur, dan dapat dilakukan tanpa pemberitahuan sebelumnya. Tidak ada jaminan bahwa situs selalu tersedia tanpa gangguan, dan tidak ada komitmen tingkat layanan (SLA) untuk layanan gratis ini.",
  },
  {
    title: "9. Sanggahan jaminan",
    body: "Layanan disediakan “sebagaimana adanya” dan “sebagaimana tersedia” tanpa jaminan dalam bentuk apa pun, tersurat maupun tersirat, termasuk jaminan kelayakan untuk tujuan tertentu, ketepatan hasil, atau kebebasan dari gangguan. Anda bertanggung jawab memverifikasi ketepatan hasil, lisensi aset, aksesibilitas, dan kelayakan keluaran sebelum memakainya dalam produksi.",
  },
  {
    title: "10. Pembatasan tanggung jawab",
    body: "Sejauh diizinkan oleh hukum yang berlaku, ALUSNA tidak bertanggung jawab atas kerugian tidak langsung, insidental, khusus, atau konsekuensial yang timbul dari penggunaan atau ketidaktersediaan layanan. Total tanggung jawab ALUSNA kepada Anda untuk klaim apa pun dibatasi maksimal sebesar jumlah yang Anda bayarkan kepada ALUSNA dalam dua belas bulan terakhir, yang umumnya nol karena layanan disediakan gratis.",
  },
  {
    title: "11. Ganti kerugian",
    body: "Anda setuju membebaskan ALUSNA dari klaim pihak ketiga yang timbul dari penggunaan layanan Anda yang melanggar ketentuan ini atau dari aset yang Anda muat tanpa hak atau izin yang memadai.",
  },
  {
    title: "12. Hukum yang berlaku",
    body: "Ketentuan ini diatur dan ditafsirkan berdasarkan hukum yang berlaku di Republik Indonesia, tanpa memperhatikan aturan kolisi hukumnya.",
  },
];

const ADVERTISING_ID: TrustSection[] = [
  {
    title: "1. Prinsip umum",
    body: "ALUSNA gratis dan dapat didukung pendanaan komersial yang diungkapkan secara terbuka. Prinsip kami: setiap penempatan berbayar diberi label jelas, tidak pernah disamarkan sebagai kontrol aplikasi, dan tidak pernah memengaruhi hasil alat.",
  },
  {
    title: "2. Slot iklan dan sponsor",
    body: 'Slot sponsor hanya dirender bila dikonfigurasi sepenuhnya. Setiap slot ditandai sebagai “Iklan / Sponsor”, memakai atribut tautan rel="sponsored", dan tidak pernah ditempatkan atau distilisasi seolah-olah bagian dari kontrol utama aplikasi.',
  },
  {
    title: "3. Tautan afiliasi",
    body: "ALUSNA dapat menerima komisi dari tautan afiliasi. Komisi tersebut tidak memengaruhi keluaran generator warna, rekomendasi tipografi, design token, maupun penilaian aksesibilitas. Penilaian alat selalu independen dari hubungan komersial apa pun.",
  },
  {
    title: "4. Tombol dukungan dan donasi",
    body: "Tombol dukungan/donasi adalah slot terpisah dari iklan dan tidak ditandai sebagai penempatan komersial — donasi adalah dukungan komunitas, bukan iklan. Tombol ini hanya tampil bila dikonfigurasi sepenuhnya, membuka platform pihak ketiga di tab baru, dan seluruh transaksi diproses oleh platform tersebut.",
  },
  {
    title: "5. Data dan periklanan",
    body: "Tidak ada skrip jaringan iklan pihak ketiga yang aktif secara bawaan, dan ALUSNA tidak mengumpulkan data di server untuk dijual atau dibagikan kepada pengiklan. Sebelum penyedia periklanan apa pun diaktifkan, kami akan meninjau kebijakan CSP, mekanisme persetujuan (termasuk persetujuan untuk periklanan berbasis perilaku), kebijakan privasi, dan persyaratan wilayah sesuai dokumentasi penyedia — dan memperbarui kebijakan ini sebelum aktivasi.",
  },
  {
    title: "6. Pelaporan",
    body: "Jika Anda menemukan penempatan komersial yang tidak berlabel, menyesatkan, atau bertentangan dengan kebijakan ini, laporkan melalui kontak yang tercantum di bagian Kontak. Laporan ditinjau dan ditindaklanjuti.",
  },
];

const ABOUT_EN: TrustSection[] = [
  {
    title: "What is ALUSNA?",
    body: "ALUSNA is a browser-based design toolkit for exploring color, typography, design tokens, and brand kits. All core features are free, require no account, and run directly on your device.",
  },
  {
    title: "How it works",
    body: "Color calculations, token generation, and image-palette extraction run entirely in your browser — including image processing in a Web Worker so the interface stays responsive. Preferences that need to persist are stored in your device's local storage (IndexedDB), not on our servers.",
  },
  {
    title: "Privacy commitment",
    body: "Your design data is never sent to an ALUSNA server. The site uses no user accounts, no tracking cookies, and no third-party ad networks by default. Details are described in the Privacy Policy.",
  },
  {
    title: "Funding model",
    body: "Core features are free. Site operations may be supported by clearly labeled sponsor slots, affiliate links, or voluntary support buttons. Funding never alters tool results, and every commercial placement is disclosed in the Advertising and Affiliate Policy.",
  },
];

const PRIVACY_EN: TrustSection[] = [
  {
    title: "1. Summary",
    body: "This policy explains what data ALUSNA manages, where that data lives, and which third-party services your browser may contact while you use this site. In short: your design work stays on your device.",
  },
  {
    title: "2. Data we manage and where it is stored",
    body: "No design data is sent to or stored on an ALUSNA server. The following is stored locally in your browser through IndexedDB (the “alusna-studio” database):",
    bullets: [
      "Themes, colors, and palettes you create or save.",
      "Metadata and files for fonts you upload (stored as base64 data on your device).",
      "Logos and brand assets you attach.",
      "Brand Kit configurations and other studio preferences.",
    ],
  },
  {
    title: "3. Storage compatibility",
    body: "On first open, the app imports data from the previous localStorage-based storage (including legacy “cikp-studio” data) into IndexedDB once. The localStorage copy is retained as a rollback backup and is never sent anywhere. If IndexedDB is unavailable in your browser, the app automatically uses localStorage instead.",
  },
  {
    title: "4. Data never sent to a server",
    body: "ALUSNA has no server upload path. Images used for palette extraction are processed locally in your browser (in a Web Worker with a main-thread fallback), and fonts, logos, and other files you load never leave your device. The site offers no account registration, so we collect no name, email, or other identity data.",
  },
  {
    title: "5. Third-party services",
    body: "Some actions on this site may trigger direct requests from your browser to third-party services:",
    bullets: [
      "Google Fonts — loading a selected font may request files from fonts.googleapis.com and fonts.gstatic.com. Those requests are subject to Google's privacy policy.",
      "Sponsor and affiliate links — lead to third-party sites with their own privacy policies.",
      "Support/donation platforms — the support button opens a third-party platform (e.g., Trakteer); payment data is processed by that platform, not ALUSNA.",
    ],
  },
  {
    title: "6. Analytics and measurement",
    body: 'The standard build enables no third-party ad networks, analytics, or server transmission. When anonymous page measurement is enabled, it runs without cookies and only after you press "Allow analytics" on the consent banner; your decision is stored on your device and can be changed by clearing the site\'s data. Only page names are sent — no query strings, no user content, no advertising profiles.',
  },
  {
    title: "7. Your rights and controls",
    body: "Because all data stays on your device, you hold full control: clear the site's data in your browser settings to remove palettes, fonts, logos, and Brand Kits — or simply close and reopen the site without losing anything. No special export process is needed because your data never left your device.",
  },
  {
    title: "8. Changes to this policy",
    body: "We may update this policy as the service evolves. Material changes will be announced on this page with their effective date before or when the change takes effect.",
  },
];

const TERMS_EN: TrustSection[] = [
  {
    title: "1. Acceptance of terms",
    body: "By accessing or using ALUSNA you agree to these terms. If you do not agree, stop using the site. We may update these terms from time to time; the latest version is always available on this page, and continued use after a change constitutes acceptance.",
  },
  {
    title: "2. Service description",
    body: "ALUSNA provides general design assistance — color palettes, color matching, gradients, color scales, contrast checking, typography, design tokens, and brand kits — running entirely in your browser without an account. The service is provided as-is.",
  },
  {
    title: "3. Eligibility",
    body: "You represent that you have the legal capacity to agree to these terms. If you use ALUSNA for or on behalf of an organization, you represent that you are authorized to bind that organization to these terms.",
  },
  {
    title: "4. Prohibited use",
    body: "You must not use the site to:",
    bullets: [
      "Violate any applicable law or regulation.",
      "Interfere with, perform unauthorized security testing on, or degrade the availability of the service.",
      "Distribute malware, malicious code, or unlawful content.",
      "Infringe another party's intellectual property, including using assets without permission.",
      "Abuse the site through excessive automated access (aggressive scraping or automated load).",
      "Misuse ALUSNA's name, brand, or reputation.",
    ],
  },
  {
    title: "5. User content and assets",
    body: "All rights in files, images, fonts, and data you load remain with their owner. Because ALUSNA processes those assets entirely in your browser and never receives them on a server, no license to your assets is granted to ALUSNA. You are responsible for ensuring you have permission to use every asset you load.",
  },
  {
    title: "6. Output",
    body: "Color palettes, design tokens, Brand Kits, and other output you generate with ALUSNA are entirely yours and free to use for any purpose, including commercial use.",
  },
  {
    title: "7. ALUSNA intellectual property",
    body: "ALUSNA's name, brand, source code, interface, and design are protected by intellectual property law. You are not granted a license to copy, modify, or distribute those elements beyond what the service's function itself provides.",
  },
  {
    title: "8. Availability and changes",
    body: "The service may change for security, compatibility, or product improvement reasons, with or without prior notice. Continuous availability is not guaranteed, and no service-level commitment (SLA) applies to this free service.",
  },
  {
    title: "9. Disclaimer of warranties",
    body: "The service is provided “as is” and “as available” without warranties of any kind, express or implied, including fitness for a particular purpose, accuracy of results, or freedom from interruption. You are responsible for verifying accuracy, asset licensing, accessibility, and output suitability before production use.",
  },
  {
    title: "10. Limitation of liability",
    body: "To the maximum extent permitted by applicable law, ALUSNA is not liable for indirect, incidental, special, or consequential damages arising from use of or inability to use the service. ALUSNA's total liability to you for any claim is limited to the amount you paid ALUSNA in the last twelve months, which is generally zero because the service is free.",
  },
  {
    title: "11. Indemnification",
    body: "You agree to hold ALUSNA harmless from third-party claims arising from your violation of these terms or from assets you load without sufficient rights or permissions.",
  },
  {
    title: "12. Governing law",
    body: "These terms are governed by and construed in accordance with the laws of the Republic of Indonesia, without regard to its conflict-of-law rules.",
  },
];

const ADVERTISING_EN: TrustSection[] = [
  {
    title: "1. General principles",
    body: "ALUSNA is free and may be supported by openly disclosed commercial funding. Our principles: every paid placement is clearly labeled, never disguised as an application control, and never affects tool results.",
  },
  {
    title: "2. Ad and sponsor slots",
    body: 'Sponsor slots render only when fully configured. Every slot is labeled “Ad / Sponsor”, uses the rel="sponsored" link attribute, and is never placed or styled to look like a primary application control.',
  },
  {
    title: "3. Affiliate links",
    body: "ALUSNA may earn a commission through affiliate links. That commission does not influence color-generator output, typography recommendations, design tokens, or accessibility assessments. Tool assessments are always independent of any commercial relationship.",
  },
  {
    title: "4. Support and donation buttons",
    body: "The support/donation button is a separate slot from advertising and is not marked as a commercial placement — donations are community support, not advertising. The button renders only when fully configured, opens a third-party platform in a new tab, and all transactions are processed by that platform.",
  },
  {
    title: "5. Data and advertising",
    body: "No third-party ad network scripts are active by default, and ALUSNA collects no server-side data to sell or share with advertisers. Before any advertising provider is activated, we will review CSP policy, consent mechanisms (including consent for behavioral advertising), privacy policy, and regional requirements per the provider's documentation — and update this policy before activation.",
  },
  {
    title: "6. Reporting",
    body: "If you find an unlabeled, misleading, or policy-violating commercial placement, report it through the contact listed in the Contact section. Reports are reviewed and acted upon.",
  },
];

export const TRUST_COPY: Record<Locale, Record<TrustPageId, TrustSection[]>> = {
  id: {
    about: ABOUT_ID,
    privacy: PRIVACY_ID,
    terms: TERMS_ID,
    advertising: ADVERTISING_ID,
  },
  en: {
    about: ABOUT_EN,
    privacy: PRIVACY_EN,
    terms: TERMS_EN,
    advertising: ADVERTISING_EN,
  },
};
