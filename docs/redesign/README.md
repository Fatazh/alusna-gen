# ALUSNA visual redesign

Status: Fase 0–10 verified  
Tanggal: 2026-09-06

## Tujuan

Mengubah ALUSNA menjadi ruang kerja referensi desain untuk UI/UX designer, graphic designer,
logo designer, illustrator, animator, dan developer handoff tanpa mengubah URL publik, domain
logic, export contract, atau data browser yang sudah tersimpan.

## Fase 0 — Baseline

### Fakta proyek

- Stack: React 18 + Vite 8 + Tailwind CSS 3.4 + TypeScript.
- Semua feature utama sudah memiliki boundary dan public entry point.
- 11 tool publik memiliki halaman English dan Indonesian.
- Theme, color history, saved palette, font, dan Brand Kit memakai Zustand persistence.
- Ikon standar proyek adalah `@phosphor-icons/react`.
- Node.js 22 adalah runtime contract.

### Batasan yang dikunci

- Tidak menghapus atau mengganti URL publik.
- Tidak mengubah format data localStorage.
- Tidak memindahkan domain calculation ke komponen React.
- Tidak menambahkan dependency visual/motion baru tanpa verifikasi `package.json`.
- Setiap desktop layout asimetris harus runtuh menjadi satu kolom pada mobile.

### Arah visual

- Creative workshop editorial, bukan dashboard SaaS generik.
- Neutral paper/ink surfaces dengan cobalt sebagai action accent tunggal.
- Magenta dan amber hanya untuk penanda status atau visualisasi, bukan CTA tambahan.
- Manrope untuk interface dan IBM Plex Mono untuk nilai teknis.
- Border, whitespace, dan hierarchy menjadi pemisah utama; shadow hanya untuk elevation yang bermakna.

## Fase 1 — Shared visual foundation

Selesai pada perubahan ini:

- Menyetel ulang semantic CSS variables light/dark.
- Mengurangi saturasi aksen dan menghapus perilaku glow neon.
- Menambah shadow/focus/selection tokens.
- Menambahkan `prefers-reduced-motion` guard.
- Mengubah Card dan CardHeader menjadi surface editorial dengan padding konsisten.
- Mengubah module loading menjadi skeleton yang mempertahankan bentuk layout.
- Memperbaiki HistoryBar agar terlokalisasi, tactile, dan tidak memakai ring indigo hardcoded.

## Fase 2 — App shell dan navigasi

Selesai pada perubahan ini:

- Header desktop lebih ringkas dengan state aktif yang jelas.
- Header mobile/tablet tetap dua baris tetapi tidak memakai nested horizontal navigation.
- Color tool navigation berubah menjadi grid responsif pada mobile/tablet dan flex pada desktop.
- Tool intro memakai metadata tiga kolom dan tetap mempertahankan satu `h1` SEO.
- Footer mengikuti surface dan spacing baru.

## Fase 3 — Homepage sebagai design-reference hub

Selesai:

- Hero sekarang menjelaskan ALUSNA untuk UI/UX, graphic, logo, dan motion designer.
- Menambahkan context router berbasis pekerjaan: UI/UX, identitas, motion/visual, dan handoff.
- Library alat dan workflow memakai hierarchy editorial yang tetap crawlable tanpa JavaScript.
- Palet hero diselaraskan dengan token cobalt, magenta, amber, paper, dan ink.

## Fase 4 — Color workspace

Selesai:

- Color Palette Generator memiliki header workspace, ringkasan palet aktif, dan elevation yang konsisten.
- Active state pada selector, swatch, harmony, format, dan search memakai semantic theme tokens.
- Tombol aksi lintas tool warna memakai accent yang sama dan tidak lagi bergantung pada indigo hardcoded.
- Kontrol tambah warna memakai ikon Phosphor agar tetap jelas di touch layout.

## Fase 5 — Typography / Font Pairing workspace

Selesai:

- Workspace typography memakai spacing yang lebih lega dan grouping yang mengikuti alur pilih → filter → preview.
- Ringkasan family aktif, jumlah weight, dan mode preview tampil sebelum katalog font.
- Upload font mempertahankan validasi, persistence, dan fallback Google Fonts; perubahan hanya pada presentasi.

## Fase 6 — Design System workspace

Selesai:

- Workspace token memiliki pengantar yang menjelaskan alur primitive → semantic → component.
- Ringkasan token aktif membantu membaca dampak perubahan mode, spacing, radius, dan font.
- Pemeriksaan kontras lebih mudah dipindai pada mobile dengan grid satu kolom lalu bertambah bertahap.
- Preview, export panel, collapsible sections, spacing scale, dan radius memakai semantic accent bersama.

## Fase 7 — Brand Kit workspace

Selesai:

- Header Brand Kit mempertahankan alur upload logo, identitas, tone, import, dan save dalam satu area kerja.
- Tab Palette, Typography, Guidelines, Export, dan Accessibility kini memakai grid responsif tanpa scroll horizontal.
- State drag-and-drop logo, tone aktif, saved kit, dan pemilih warna mengikuti token cobalt/soft accent.
- Panel Palette, Typography, dan Export tidak lagi memakai indigo hardcoded sebagai identitas visual.

## Fase 8 — Final visual polish

Selesai:

- Aksen lintas feature diseragamkan untuk light/dark mode tanpa mengubah kontrak domain atau export.
- Semua editor besar memakai rhythm spacing yang konsisten dengan shell dan Card shared.
- Focus/hover state tetap berbasis semantic variables, sementara ikon kontrol tetap Phosphor dan touch-safe.
- Regression pass memastikan URL, localStorage, lazy loading, dan fallback font tidak berubah.

## Fase 9 — Draft continuity dan English editorial pass

Selesai:

- Design System menyimpan draft editor ke `sessionStorage` dengan key berversi dan validasi ketat.
- Draft dipulihkan saat kembali ke menu selama sesi browser yang sama; data corrupt atau storage yang
  diblokir tidak menghentikan editor.
- Pesan aksi Brand Kit (save, import, load, delete, export, dan copy) kini memiliki pasangan Indonesia
  dan English yang konsisten.
- Format draft dibatasi ke mode, export format, spacing, radius, dan nama token yang valid.

## Fase 10 — Launch-readiness handoff

Selesai:

- Release gate Node.js 22, build production, audit dependency, boundary check, dan E2E dijalankan ulang
  setelah perubahan Fase 9.
- Checklist launch tetap fail-closed: origin HTTPS dan contact email nyata masih wajib disediakan lewat
  environment production sebelum deploy.
- Risiko eksternal (domain, Search Console, consent, dan provider iklan) tetap didokumentasikan sebagai
  langkah operasional, bukan diaktifkan diam-diam dari kode.

## Validasi fase

Validasi saat ini: lint, dependency boundaries, 154 unit tests, build, dan 31 E2E lulus (1 sponsor
scenario sengaja dilewati). `npm audit --omit=dev` melaporkan 0 vulnerabilities. `format:check`
hanya memperingatkan file untracked lama `scripts/debug-probe.mjs`; semua file redesign yang
diubah sudah lolos Prettier.

## Risiko tersisa

- Design System draft hanya bertahan selama sesi browser; persistensi lintas perangkat membutuhkan
  akun atau server dan sengaja belum ditambahkan.
- Beberapa copy detail tool legacy masih membutuhkan review editorial native English.
- Domain, hosting, Search Console, consent, dan provider iklan tetap merupakan langkah operasional
  eksternal sebelum monetisasi.
