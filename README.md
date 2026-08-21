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

Persyaratan: Node.js 20 atau lebih baru.

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

Saat ini terdapat 111 unit/contract test dan 20 browser E2E wajib. Satu E2E tambahan memvalidasi slot sponsor ketika konfigurasi sponsor tersedia. GitHub Actions menjalankan quality gate yang sama pada push dan pull request.

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

## Batas upload

- Gambar palet: maksimum 10 MB; SVG tidak didukung
- Logo brand: maksimum 2 MB; PNG, JPEG, atau WebP
- Font: maksimum 5 MB per file; TTF, OTF, WOFF, atau WOFF2

## Build produksi

```sh
npm run build
npm run preview
```

Output produksi dibuat di `dist`. Terapkan CSP melalui response header dengan nonce/hash ketika melakukan deployment produksi; CSP meta saat ini tetap mengizinkan inline bootstrap untuk kompatibilitas Vite.

## SEO dan sponsor

Salin `.env.example` menjadi `.env`, lalu isi URL domain publik sebelum build:

```sh
VITE_SITE_URL=https://domain-anda.com
```

Build menghasilkan 15 halaman HTML dengan title dan description unik: 11 alat serta halaman Tentang, Privasi, Ketentuan, dan Kebijakan Iklan. Build juga menghasilkan `robots.txt` serta `sitemap.xml` jika `VITE_SITE_URL` tersedia.

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
