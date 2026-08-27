# ALUSNA

**Bagusnya dimulai di sini.**

Frontend studio untuk eksplorasi warna, preview tipografi, pembuatan design token, dan penyusunan brand kit. Seluruh pemrosesan utama berjalan di browser.

## Stack

- React 18 dan TypeScript
- Vite
- Tailwind CSS
- Zustand dengan persistence `localStorage`
- Vitest

## Menjalankan proyek

Persyaratan: Node.js 22.x. Versi yang sama digunakan oleh CI dan dicatat di `.nvmrc`.

```sh
npm install
npm run dev
```

Vite menggunakan `http://localhost:5173` secara default.

## Validasi

```sh
npm run check
npm run test:e2e
npm audit --omit=dev
```

`npm run check` menjalankan lint, pemeriksaan format, batas dependensi modul, unit test, dan production build. Untuk E2E lokal, pasang Chromium Playwright satu kali terlebih dahulu:

```sh
npx playwright install chromium
```

Saat ini terdapat 145 unit/contract test dan 30 browser E2E wajib. Satu E2E tambahan memvalidasi slot sponsor ketika konfigurasi sponsor tersedia. GitHub Actions menjalankan quality gate yang sama pada push dan pull request.

## Struktur

- `src/app`: composition shell, provider, layout, router, SEO, trust pages, dan monetisasi
- `src/features/color`: model, service, UI, serta lazy loader alat warna
- `src/features/typography`: katalog/validasi font, browser font service, dan UI
- `src/features/design-system`: generator token, serializer, dan UI
- `src/features/brand-kit`: model, interop, serializer HTML, dan UI Brand Kit
- `src/shared`: konfigurasi dan UI generik lintas fitur
- `src/store`: state global dan persistence

## Penyimpanan dan privasi

Warna, palet, tema, font upload, dan brand kit disimpan secara lokal di browser pada storage versioned `alusna-studio`. Data lama `cikp-studio` disalin secara aman ketika ALUSNA pertama kali dibuka dan tetap dipertahankan sebagai rollback copy. Gambar yang dipakai untuk ekstraksi palet tidak dikirim ke server. Font dan logo yang dipersistensikan disimpan sebagai base64 sehingga penggunaan banyak file besar dapat mencapai quota browser; aplikasi akan menampilkan peringatan apabila penyimpanan gagal.

Google Fonts dimuat dari `fonts.googleapis.com` dan `fonts.gstatic.com` ketika font terkait dipilih. Hal ini memerlukan koneksi internet dan mengirim permintaan ke layanan Google.

## Katalog Google Fonts

ALUSNA memakai snapshot katalog lokal sehingga pencarian font tetap tersedia tanpa memanggil
Developer API dari browser. Font yang dipilih dimuat melalui Google Fonts CSS API menggunakan weight
dan style yang tersedia. Snapshot bawaan berisi 30 font populer dan dapat disinkronkan hingga 1.000
family dari Google Fonts Developer API.

Gunakan API key hanya di shell lokal atau CI secret. Jangan memakai nama yang diawali `VITE_` karena
nilai tersebut akan masuk ke bundle browser.

```powershell
$env:GOOGLE_FONTS_API_KEY="API_KEY_ANDA"
$env:GOOGLE_FONTS_LIMIT="300"
npm run fonts:sync
Remove-Item Env:GOOGLE_FONTS_API_KEY
Remove-Item Env:GOOGLE_FONTS_LIMIT
```

Script memvalidasi family, category, weight, style, subset, dan variable-weight axis sebelum
memperbarui `src/features/typography/data/googleFonts.generated.ts`. Jika API gagal atau menghasilkan
kurang dari 30 font valid, snapshot lama dipertahankan. Jalankan quality gate dan commit snapshot
generated setelah sinkronisasi.

## Batas upload

- Gambar palet: maksimum 10 MB; SVG tidak didukung
- Logo brand: maksimum 2 MB; PNG, JPEG, atau WebP
- Font: maksimum 5 MB per file; TTF, OTF, WOFF, atau WOFF2

## Build produksi

```sh
npm run build
npm run preview
```

`npm run build` digunakan oleh test lokal. Untuk artefak yang benar-benar akan dipublikasikan,
salin `.env.production.example` menjadi `.env.production`, isi domain HTTPS dan email aktif, lalu
jalankan:

```sh
npm run build:production
```

Perintah ini gagal tertutup apabila origin/email belum valid atau artefak tidak memiliki sitemap,
canonical URL, dan `hreflang`. Output dibuat di `dist`.

Bootstrap error produksi dimuat dari file eksternal sehingga `script-src` tidak memerlukan
`'unsafe-inline'`. UI masih menggunakan inline style React, sehingga `style-src 'unsafe-inline'`
belum dapat dihapus tanpa refactor presentasi yang lebih luas.

`public/_headers` menyediakan security header untuk Cloudflare Pages dan Netlify. Untuk Nginx,
gunakan `deploy/nginx-security.conf.example` di HTTPS server block. Pastikan header benar-benar
muncul pada respons domain produksi; file konfigurasi di repository tidak otomatis mengubah server.

Jika memakai Vercel, nonaktifkan **Vercel Toolbar** untuk environment publik melalui Project
Settings → General → Vercel Toolbar → Production → Off. Untuk preview yang tidak memerlukan
Comments, atur environment variable `VERCEL_PREVIEW_FEEDBACK_ENABLED=0`. Jangan menambahkan
`vercel.live` ke CSP hanya untuk menghilangkan pesan console; Toolbar membutuhkan beberapa izin
script, koneksi, frame, font, gambar, dan style pihak ketiga yang tidak dibutuhkan pengunjung ALUSNA.

## SEO dan sponsor

Salin `.env.example` menjadi `.env`, lalu isi URL domain publik sebelum build:

```sh
VITE_SITE_URL=https://domain-anda.com
```

Build menghasilkan 32 halaman HTML bilingual dengan title dan description unik. Build produksi juga
menghasilkan `robots.txt` dan `sitemap.xml` setelah `VITE_SITE_URL` tervalidasi.

Konfigurasikan kontak publik yang muncul pada halaman kebijakan ketika alamatnya sudah siap dipublikasikan:

```sh
VITE_CONTACT_EMAIL=halo@domain-anda.com
```

Slot sponsor langsung atau affiliate bersifat opsional dan transparan. Slot tidak dirender jika konfigurasi berikut kosong:

```sh
VITE_SPONSOR_URL=https://tautan-sponsor-atau-affiliate.com
VITE_SPONSOR_TITLE=Nama sponsor
VITE_SPONSOR_TEXT=Deskripsi singkat sponsor
```

Tautan sponsor diberi atribut `rel="sponsored"`, penempatannya dilabeli `Iklan / Sponsor`, dan pengguna dapat membuka `/kebijakan-iklan` untuk membaca disclosure. Konfigurasi yang tidak lengkap atau URL non-HTTP(S) tidak dirender.

Tidak ada script jaringan iklan pihak ketiga yang aktif secara default. Sebelum menambahkan Google AdSense atau penyedia serupa, tinjau CSP, cookie/identifier, consent, kebijakan privasi, dan persyaratan wilayah sesuai dokumentasi penyedia yang dipilih.
