import { SEO_PAGES, type ToolPage } from "../router/routes.ts";

export type ToolGuide = {
  overview: string;
  steps: readonly string[];
  useCases: readonly string[];
  tips: readonly string[];
  relatedPaths: readonly string[];
};

export const TOOL_GUIDES: Record<ToolPage["path"], ToolGuide> = {
  "/color-palette-generator": {
    overview:
      "Palet warna membantu menjaga tampilan produk tetap konsisten. Mulailah dari koleksi yang paling mendekati suasana brand, lalu sesuaikan warna aktif dan simpan pilihan yang benar-benar memiliki fungsi.",
    steps: [
      "Pilih pola palet sebagai titik awal, bukan sebagai hasil final yang harus diterima mentah-mentah.",
      "Buka detail setiap warna untuk memeriksa HEX, RGB, HSL, CMYK, serta nama warna terdekat.",
      "Simpan warna penting dan ekspor palet ke CSS, JSON, Tailwind, atau PNG sesuai alur kerja Anda.",
    ],
    useCases: ["Identitas visual", "UI website dan aplikasi", "Presentasi dan konten sosial"],
    tips: [
      "Tetapkan peran seperti primary, background, surface, dan accent agar palet mudah diterapkan.",
      "Periksa kembali pasangan teks dan latar di Contrast Checker sebelum digunakan di produksi.",
    ],
    relatedPaths: ["/color-matching", "/contrast-checker", "/brand-kit-generator"],
  },
  "/color-matching": {
    overview:
      "Harmoni warna memberi struktur pada pilihan warna yang terasa subjektif. Gunakan complementary untuk kontras kuat, analogous untuk nuansa tenang, atau triadic untuk variasi yang tetap seimbang.",
    steps: [
      "Tentukan satu warna dasar yang mewakili karakter utama desain.",
      "Bandingkan beberapa metode harmoni dan perhatikan perubahan hue, bukan hanya warna favorit.",
      "Simpan kombinasi terpilih lalu uji pembagian perannya pada elemen utama, pendukung, dan aksen.",
    ],
    useCases: ["Kampanye visual", "Ilustrasi", "Tema antarmuka"],
    tips: [
      "Jangan memakai semua warna dengan porsi yang sama; satu warna tetap perlu dominan.",
      "Harmoni yang bagus secara visual belum tentu memiliki kontras teks yang cukup.",
    ],
    relatedPaths: ["/color-palette-generator", "/color-blindness-simulator", "/contrast-checker"],
  },
  "/color-mixer": {
    overview:
      "Color Mixer memperlihatkan hasil pencampuran warna dan dapat mencari resep untuk target. Gunakan model Cahaya RGB untuk pasangan sumber cahaya atau Cat/Tinta untuk formula cakupan Cyan, Magenta, Kuning, dan Hitam.",
    steps: [
      "Pilih warna target untuk memperoleh rekomendasi bahan dan proporsi, atau tentukan warna sumber secara manual.",
      "Pilih model campuran yang sesuai, lalu gunakan resep terdekat untuk memuat warna dan bobot ke eksperimen.",
      "Salin kode hasil dan bandingkan kembali terhadap warna sumber sebelum diterapkan.",
    ],
    useCases: ["Resep warna target", "Warna transisi", "Eksplorasi tint sederhana"],
    tips: [
      "Campuran cahaya RGB dan campuran cat bersifat berbeda; simulasi pigmen di layar bukan formula produksi.",
      "Untuk rangkaian terang-gelap yang sistematis, lanjutkan hasilnya ke Shade Generator.",
    ],
    relatedPaths: ["/gradient-generator", "/shade-generator", "/color-matching"],
  },
  "/gradient-generator": {
    overview:
      "Gradien yang efektif memiliki arah, titik warna, dan tingkat kontras yang mendukung isi. Gunakan generator ini untuk menyusun transisi visual sekaligus memperoleh CSS yang dapat langsung diuji.",
    steps: [
      "Tentukan warna awal dan akhir, kemudian tambahkan color stop hanya jika benar-benar diperlukan.",
      "Atur arah gradien berdasarkan gerak visual komponen atau sumber cahaya yang ingin disimulasikan.",
      "Salin CSS dan uji pada ukuran komponen sebenarnya, bukan hanya pada preview generator.",
    ],
    useCases: ["Hero website", "Latar kartu", "Highlight dan dekorasi"],
    tips: [
      "Hindari meletakkan teks di area gradien yang berubah kontras terlalu ekstrem.",
      "Gradien halus biasanya lebih mudah dipadukan dengan komponen lain daripada terlalu banyak stop.",
    ],
    relatedPaths: ["/color-mixer", "/color-palette-generator", "/contrast-checker"],
  },
  "/shade-generator": {
    overview:
      "Skala 50–950 mengubah satu warna menjadi rentang yang dapat dipakai konsisten untuk latar, border, teks, hover, dan state interaksi. Nomor menunjukkan posisi relatif dalam skala, bukan ukuran aksesibilitas.",
    steps: [
      "Masukkan warna dasar yang akan menjadi identitas utama skala.",
      "Tinjau perubahan setiap tingkat dan pilih tingkat default yang paling dekat dengan warna brand.",
      "Ekspor skala lalu beri nama berdasarkan peran atau keluarga warna dalam design system.",
    ],
    useCases: ["Tema Tailwind", "State komponen", "Token warna semantik"],
    tips: [
      "Jangan berasumsi tingkat 500 selalu cocok sebagai primary; pilih berdasarkan konteks visual.",
      "Uji warna teks dan latar per pasangan karena nomor skala tidak menjamin rasio WCAG.",
    ],
    relatedPaths: ["/design-token-generator", "/contrast-checker", "/color-palette-generator"],
  },
  "/image-color-extractor": {
    overview:
      "Image Color Extractor mengambil warna dominan dari gambar secara lokal di browser. Hasilnya cocok sebagai bahan eksplorasi, tetapi tetap perlu disederhanakan menjadi palet yang memiliki peran jelas.",
    steps: [
      "Pilih gambar dengan pencahayaan dan warna yang mewakili suasana visual target.",
      "Ekstrak warna, lalu bandingkan warna dominan dengan detail kecil yang mungkin lebih menarik.",
      "Simpan pilihan yang relevan dan lanjutkan ke palet atau Brand Kit untuk menetapkan fungsinya.",
    ],
    useCases: ["Moodboard", "Foto produk", "Referensi identitas visual"],
    tips: [
      "Foto dengan bayangan kuat dapat menghasilkan banyak warna gelap yang sebenarnya berasal dari cahaya.",
      "Gambar diproses lokal, tetapi Anda tetap harus memiliki hak untuk menggunakan aset sumber.",
    ],
    relatedPaths: ["/color-palette-generator", "/color-matching", "/brand-kit-generator"],
  },
  "/color-blindness-simulator": {
    overview:
      "Simulator membantu melihat bagaimana perbedaan warna dapat berubah pada beberapa kondisi penglihatan warna. Hasil simulasi adalah alat pemeriksaan awal, bukan diagnosis medis atau pengganti pengujian pengguna.",
    steps: [
      "Masukkan warna atau palet yang sudah memiliki fungsi dalam antarmuka.",
      "Bandingkan setiap simulasi dan cari elemen yang menjadi sulit dibedakan.",
      "Tambahkan label, ikon, pola, atau perbedaan terang-gelap agar informasi tidak bergantung pada warna saja.",
    ],
    useCases: ["Status aplikasi", "Grafik data", "Sistem notifikasi"],
    tips: [
      "Jangan menjadikan warna satu-satunya pembeda untuk sukses, gagal, aktif, atau nonaktif.",
      "Lanjutkan pemeriksaan dengan Contrast Checker untuk menilai keterbacaan teks.",
    ],
    relatedPaths: ["/contrast-checker", "/color-matching", "/design-token-generator"],
  },
  "/contrast-checker": {
    overview:
      "Contrast Checker menghitung rasio antara warna depan dan latar serta menunjukkan status WCAG. Gunakan hasilnya sesuai ukuran dan ketebalan teks yang benar-benar dipakai dalam antarmuka.",
    steps: [
      "Masukkan warna teks dan warna latar persis seperti yang akan tampil di produk.",
      "Periksa status untuk teks normal, teks besar, dan kebutuhan target AA atau AAA.",
      "Jika gagal, ubah lightness salah satu warna sambil mempertahankan karakter palet sebisa mungkin.",
    ],
    useCases: ["Teks dan latar", "Tombol", "Form dan status fokus"],
    tips: [
      "Kontras warna yang lolos tidak otomatis membuat ukuran font, hierarki, atau fokus keyboard ikut aksesibel.",
      "Periksa juga kondisi hover, disabled, error, dan dark mode—bukan hanya keadaan default.",
    ],
    relatedPaths: ["/color-blindness-simulator", "/shade-generator", "/brand-kit-generator"],
  },
  "/font-pairing": {
    overview:
      "Font pairing menyatukan karakter visual dengan keterbacaan. Pasangan yang baik biasanya memiliki perbedaan fungsi yang jelas tanpa bersaing terlalu kuat dalam bentuk, berat, dan proporsi.",
    steps: [
      "Pilih font heading berdasarkan karakter brand dan font body berdasarkan kenyamanan membaca.",
      "Uji pasangan pada judul, paragraf panjang, label, tombol, dan angka dengan teks realistis.",
      "Salin CSS setelah ukuran, line-height, weight, dan fallback font sudah sesuai.",
    ],
    useCases: ["Landing page", "Editorial", "Identitas brand"],
    tips: [
      "Dua font tidak selalu lebih baik; satu keluarga dengan beberapa weight sering lebih ringan dan konsisten.",
      "Periksa lisensi, dukungan karakter, dan performa file sebelum memakai font di produksi.",
    ],
    relatedPaths: ["/brand-kit-generator", "/design-token-generator", "/color-palette-generator"],
  },
  "/design-token-generator": {
    overview:
      "Design token menerjemahkan keputusan visual menjadi nama dan nilai yang dapat dipakai lintas desain serta kode. Token yang baik menjelaskan fungsi, bukan hanya menyimpan nilai mentah.",
    steps: [
      "Tentukan warna dasar dan prefix yang jelas untuk proyek atau brand.",
      "Tinjau peran warna, tipografi, spacing, radius, dan shadow yang dihasilkan.",
      "Pilih format ekspor yang sesuai lalu review penamaan sebelum dimasukkan ke repository produksi.",
    ],
    useCases: ["Design system", "Handoff developer", "Tema multi-platform"],
    tips: [
      "Gunakan nama semantik seperti text-primary atau surface, bukan nama yang terikat pada warna tertentu.",
      "Token perlu versioning dan review ketika dipakai oleh lebih dari satu produk atau platform.",
    ],
    relatedPaths: ["/shade-generator", "/font-pairing", "/brand-kit-generator"],
  },
  "/brand-kit-generator": {
    overview:
      "Brand Kit menyatukan identitas dasar agar keputusan warna, tipografi, tone, dan penggunaan visual tidak tersebar. Hasil generator adalah fondasi yang perlu disesuaikan dengan konteks brand sebenarnya.",
    steps: [
      "Isi nama, tagline, tone, logo, warna utama, dan pasangan tipografi yang sudah dipilih.",
      "Tinjau panduan, preview, dan pemeriksaan aksesibilitas sebelum menyimpan versi final.",
      "Ekspor HTML, JSON, design token, Tailwind, CSS, SCSS, atau React Native sesuai kebutuhan tim.",
    ],
    useCases: ["Brand baru", "Dokumentasi internal", "Handoff desain dan developer"],
    tips: [
      "Simpan versi JSON sebagai sumber yang dapat diimpor kembali, bukan hanya hasil visual.",
      "Pastikan logo, font, foto, dan nama yang digunakan memiliki hak pemakaian yang sesuai.",
    ],
    relatedPaths: ["/color-palette-generator", "/font-pairing", "/design-token-generator"],
  },
};

export function getToolGuide(page: ToolPage): ToolGuide {
  return TOOL_GUIDES[page.path];
}

export function getRelatedTools(guide: ToolGuide): ToolPage[] {
  return guide.relatedPaths.flatMap((path) => {
    const page = SEO_PAGES.find((candidate) => candidate.path === path);
    return page ? [page] : [];
  });
}
