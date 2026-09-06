# ALUSNA design-reference audit

Tanggal: 2026-09-06  
Scope: home, palette, design system, typography, brand kit, contrast, accessibility, shades, gradient, experiment, matching, dan image tools pada route English.

## Kesimpulan

Tidak ditemukan celah P0 atau bug yang membuat aplikasi tidak dapat dipakai. Temuan utama adalah ketepatan token aksesibilitas, metadata bobot Google Fonts, dan kelengkapan export design token. Ketiganya sudah diperbaiki pada implementasi.

## Langkah yang diaudit

1. Home (`01-home.png`) — sehat; entry point dan hierarki utama jelas.
2. Palette (`02-palette.png`) — sehat; eksplorasi dan export mudah ditemukan.
3. Design System (`03-design-system.png`) — perlu perhatian; state kontras hover/active awalnya belum tervalidasi.
4. Design System preview (`03b-preview-controls.png`) — sehat; preview memberi konteks penggunaan token.
5. Font catalog (`04-font.png`) — perlu perhatian; font variable awalnya hanya menawarkan bobot 400.
6. Font pairing (`04b-pairing.png`) — sehat; pairing dan preview terbaca.
7. Brand Kit (`05-brand-kit.png`) — cukup sehat; beberapa copy detail masih campur bahasa.
8. Brand export (`05b-brand-export.png`) — sehat; format output dan preview tersedia.
9. Contrast Checker (`06-contrast-en.png`) — perlu perhatian; label English awalnya masih tercampur Indonesian.
10. Accessibility (`07-accessibility.png`) — perlu perhatian; warna aktif dapat terhitung dua kali.
11. Shades (`08-shades.png`) — cukup sehat; level 500 perlu penjelasan sebagai generated step.
12. Gradient, Experiment, Matching, Image (`09-gradient.png`–`12-image.png`) — sehat untuk alur eksplorasi dasar.

## Perbaikan yang diterapkan

- Simulator color blindness sekarang menghapus warna duplikat berdasarkan HEX sebelum menghitung distinguishability.
- Design System menambahkan foreground token untuk state hover/active dan memvalidasi kontras state tersebut, bukan hanya state normal.
- Catalog Google Fonts mengekspos bobot standar 100–900 untuk font variable agar selector dapat memilih 600/700 dan bobot lain yang valid.
- Export Tailwind v4 sekarang menyertakan text size, line-height, font-weight, dan tracking.
- Export React Native mengonversi letter-spacing berbasis `em` ke nilai pixel berdasarkan ukuran font.
- Contrast Checker pada route English tidak lagi menampilkan label Indonesian yang tercampur.

## Temuan lanjutan (P2)

- Design System masih memakai state lokal; berpindah menu akan mengembalikan prefix, mode, dan skala ke default. Persistensi sesi akan membuat alur eksplorasi lebih dapat diandalkan.
- `#6366F1` sebagai primary hanya memiliki rasio 4.14:1 terhadap surface. Itu aman untuk teks besar/komponen tertentu, tetapi bukan untuk body text normal; gunakan Contrast Checker sebelum memakai primary sebagai teks.
- Generator shades sengaja memakai lightness scale tetap sehingga level 500 bukan selalu warna input. UI perlu menegaskan bahwa scale tersebut adalah rekomendasi, bukan pemetaan exact input.
- Beberapa copy detail di Brand Kit dan modul legacy masih perlu satu pass lokalisasi untuk konsistensi English.

## Bukti

Screenshot hasil audit tersimpan di folder ini (`01-home.png` sampai `12-image.png`). Pengukuran domain terbaru tersimpan di `domain-measurements.json`.

## Validasi

Target validasi setelah perubahan: lint, formatting, dependency boundaries, unit test, build, dan E2E production preview. Online `npm audit` tetap perlu dijalankan dari lingkungan dengan akses registry.
