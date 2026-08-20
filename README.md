# CIKP Studio

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
npm test
npm run build
npm audit --omit=dev
```

## Struktur

- `src/components`: komponen UI bersama
- `src/modules/color`: alat warna dan aksesibilitas
- `src/modules/font`: katalog, preview, pairing, dan upload font
- `src/modules/design`: generator design system
- `src/modules/brand`: generator dan ekspor brand kit
- `src/lib`: logika domain dan serializer
- `src/store`: state global dan persistence

## Penyimpanan dan privasi

Warna, palet, tema, font upload, dan brand kit disimpan secara lokal di browser. Gambar yang dipakai untuk ekstraksi palet tidak dikirim ke server. Font dan logo yang dipersistensikan disimpan sebagai base64 sehingga penggunaan banyak file besar dapat mencapai quota browser; aplikasi akan menampilkan peringatan apabila penyimpanan gagal.

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

Build akan menghasilkan halaman HTML dengan title dan description unik untuk setiap alat, `robots.txt`, serta `sitemap.xml` jika `VITE_SITE_URL` tersedia.

Slot sponsor langsung atau affiliate bersifat opsional dan transparan. Slot tidak dirender jika konfigurasi berikut kosong:

```sh
VITE_SPONSOR_URL=https://tautan-sponsor-atau-affiliate.com
VITE_SPONSOR_TITLE=Nama sponsor
VITE_SPONSOR_TEXT=Deskripsi singkat sponsor
```

Tautan sponsor diberi atribut `rel="sponsored"`. Jangan menyamarkan sponsor sebagai tombol aplikasi. Jika kelak memakai jaringan iklan berbasis script/cookie, perbarui CSP dan kebijakan privasi sesuai persyaratan penyedia tersebut.
