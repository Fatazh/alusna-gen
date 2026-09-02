import { ENGLISH_SEO_PAGES, SEO_PAGES, type ToolPage } from "../router/routes.ts";

export type ToolGuide = {
  overview: string;
  steps: readonly string[];
  useCases: readonly string[];
  tips: readonly string[];
  relatedPaths: readonly string[];
};

const ENGLISH_TOOL_GUIDES: Record<string, ToolGuide> = {
  "/color-palette-generator": {
    overview:
      "A focused palette keeps product interfaces and brand assets visually consistent. Start with a useful direction, then assign each selected color a clear role.",
    steps: [
      "Choose a palette pattern as a starting point.",
      "Inspect each color in HEX, RGB, HSL, and CMYK.",
      "Save useful colors and export them in the format your workflow needs.",
    ],
    useCases: ["Visual identity", "Web and app UI", "Presentations and social content"],
    tips: [
      "Assign semantic roles such as primary, surface, and accent.",
      "Check text and background pairs before production use.",
    ],
    relatedPaths: ["/color-matching", "/contrast-checker", "/brand-kit-generator"],
  },
  "/color-matching": {
    overview:
      "Color harmony gives structure to subjective choices. Compare complementary, analogous, and triadic relationships before assigning visual roles.",
    steps: [
      "Choose a base color that represents the design direction.",
      "Compare harmony methods and inspect hue changes.",
      "Save a combination and test dominant, supporting, and accent roles.",
    ],
    useCases: ["Visual campaigns", "Illustration", "Interface themes"],
    tips: [
      "Avoid using every color in equal proportions.",
      "A harmonious palette can still fail text contrast requirements.",
    ],
    relatedPaths: ["/color-palette-generator", "/color-blindness-simulator", "/contrast-checker"],
  },
  "/color-mixer": {
    overview:
      "Color Mixer combines source colors and can derive a formula for a target. Use RGB Light for channel intensity or Paint / Ink for idealized CMYK coverage.",
    steps: [
      "Choose a target color or set source colors manually.",
      "Adjust percentages while monitoring HEX and perceptual similarity.",
      "Apply the formula to the experiment and copy the resulting color.",
    ],
    useCases: ["Target color formulas", "Color transitions", "Simple tint exploration"],
    tips: [
      "RGB light and physical paint mixing are different models.",
      "Use Shade Generator for a systematic light-to-dark scale.",
    ],
    relatedPaths: ["/gradient-generator", "/shade-generator", "/color-matching"],
  },
  "/gradient-generator": {
    overview:
      "Effective gradients use direction, stops, and contrast to support content. Build the transition here and copy CSS for a real component test.",
    steps: [
      "Choose start and end colors.",
      "Set the direction and add only necessary stops.",
      "Copy the CSS and test it at the intended component size.",
    ],
    useCases: ["Website heroes", "Card backgrounds", "Highlights and decoration"],
    tips: [
      "Keep text away from areas with unstable contrast.",
      "Subtle gradients are generally easier to integrate.",
    ],
    relatedPaths: ["/color-mixer", "/color-palette-generator", "/contrast-checker"],
  },
  "/shade-generator": {
    overview:
      "A 50–950 scale turns one color into a reusable range for surfaces, borders, text, and interaction states.",
    steps: [
      "Enter the base color.",
      "Review every level and identify the closest brand default.",
      "Export the scale with a meaningful semantic or family name.",
    ],
    useCases: ["Tailwind themes", "Component states", "Semantic color tokens"],
    tips: [
      "Level 500 is not automatically the right primary color.",
      "Scale numbers do not guarantee WCAG contrast.",
    ],
    relatedPaths: ["/design-token-generator", "/contrast-checker", "/color-palette-generator"],
  },
  "/image-color-extractor": {
    overview:
      "Image Color Extractor finds dominant colors locally in your browser. Treat the result as exploration material, then reduce it to clear functional roles.",
    steps: [
      "Choose an image that represents the intended visual mood.",
      "Compare dominant colors with smaller distinctive details.",
      "Save relevant colors and refine them in Palette or Brand Kit.",
    ],
    useCases: ["Moodboards", "Product photography", "Visual identity references"],
    tips: [
      "Strong shadows can overproduce dark colors.",
      "You must still have permission to use the source asset.",
    ],
    relatedPaths: ["/color-palette-generator", "/color-matching", "/brand-kit-generator"],
  },
  "/color-blindness-simulator": {
    overview:
      "This simulator provides an initial view of how color distinctions may change across several color-vision conditions. It is not a medical diagnosis or user testing replacement.",
    steps: [
      "Enter colors that already have interface roles.",
      "Compare simulations and find hard-to-distinguish elements.",
      "Add labels, icons, patterns, or lightness differences.",
    ],
    useCases: ["Application states", "Data charts", "Notification systems"],
    tips: [
      "Never use color as the only status indicator.",
      "Use Contrast Checker to assess text readability.",
    ],
    relatedPaths: ["/contrast-checker", "/color-matching", "/design-token-generator"],
  },
  "/contrast-checker": {
    overview:
      "Contrast Checker calculates foreground-to-background contrast and reports WCAG status for the actual text size and weight you plan to use.",
    steps: [
      "Enter the exact text and background colors.",
      "Review normal-text, large-text, AA, and AAA results.",
      "Adjust one color's lightness if the pair fails.",
    ],
    useCases: ["Text and backgrounds", "Buttons", "Forms and focus states"],
    tips: [
      "Passing color contrast does not guarantee complete accessibility.",
      "Check hover, disabled, error, and dark-mode states too.",
    ],
    relatedPaths: ["/color-blindness-simulator", "/shade-generator", "/brand-kit-generator"],
  },
  "/font-pairing": {
    overview:
      "Font pairing balances visual character and readability. Strong pairs usually have clearly different jobs without competing in shape, weight, or proportion.",
    steps: [
      "Choose a heading font for character and a body font for reading.",
      "Test realistic headings, paragraphs, labels, buttons, and numbers.",
      "Copy CSS after size, line height, weight, and fallbacks are final.",
    ],
    useCases: ["Landing pages", "Editorial design", "Brand identity"],
    tips: [
      "One family with several weights may be enough.",
      "Check licensing, language support, and performance.",
    ],
    relatedPaths: ["/brand-kit-generator", "/design-token-generator", "/color-palette-generator"],
  },
  "/design-token-generator": {
    overview:
      "Design tokens translate visual decisions into reusable names and values across design and code. ALUSNA separates primitive shades, semantic roles, and component aliases so the exported theme communicates purpose rather than raw values alone.",
    steps: [
      "Set a clear token prefix, theme mode, spacing unit, and radius foundation.",
      "Review the component preview and WCAG contrast checks before inspecting individual tokens.",
      "Download DTCG 2025.10, Tailwind v4, CSS, SCSS, or React Native output and review it before production use.",
    ],
    useCases: ["Light and dark themes", "Figma and developer handoff", "Multi-platform tokens"],
    tips: [
      "Keep primitive values, semantic decisions, and component aliases in separate layers.",
      "Version and review downloaded tokens when they are shared by multiple products.",
    ],
    relatedPaths: ["/shade-generator", "/font-pairing", "/brand-kit-generator"],
  },
  "/brand-kit-generator": {
    overview:
      "Brand Kit keeps foundational color, typography, tone, and visual-use decisions in one place. Adapt the generated foundation to your real brand context.",
    steps: [
      "Enter brand identity, tone, logo, colors, and typography.",
      "Review guidelines, previews, and accessibility checks.",
      "Export the formats required by your team.",
    ],
    useCases: ["New brands", "Internal documentation", "Design and developer handoff"],
    tips: [
      "Keep the JSON export as a re-importable source.",
      "Confirm usage rights for every logo, font, photo, and name.",
    ],
    relatedPaths: ["/color-palette-generator", "/font-pairing", "/design-token-generator"],
  },
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
      "Color Mixer memperlihatkan hasil pencampuran warna dan dapat mencari formula untuk target. Gunakan Cahaya RGB untuk intensitas kanal Merah, Hijau, dan Biru, atau Cat/Tinta untuk cakupan Cyan, Magenta, Kuning, dan Hitam.",
    steps: [
      "Pilih warna target untuk memperoleh intensitas RGB atau cakupan CMYK, atau tentukan warna sumber secara manual.",
      "Sesuaikan persentase pada slider atau input angka sambil memantau HEX dan skor kemiripan secara langsung.",
      "Gunakan formula untuk memuatnya ke eksperimen, lalu salin kode hasil dan bandingkan kembali terhadap warna sumber.",
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
      "Design token menerjemahkan keputusan visual menjadi nama dan nilai yang dapat dipakai lintas desain serta kode. ALUSNA memisahkan shade primitive, peran semantik, dan alias komponen agar tema menjelaskan fungsi, bukan hanya nilai mentah.",
    steps: [
      "Tentukan prefix token, mode tema, unit spacing, dan radius dasar.",
      "Periksa preview komponen dan hasil kontras WCAG sebelum meninjau setiap kelompok token.",
      "Unduh DTCG 2025.10, Tailwind v4, CSS, SCSS, atau React Native lalu review sebelum dipakai di produksi.",
    ],
    useCases: ["Tema light dan dark", "Handoff Figma dan developer", "Token multi-platform"],
    tips: [
      "Pisahkan nilai primitive, keputusan semantik, dan alias komponen ke lapisan berbeda.",
      "Beri versioning dan review pada file token yang dipakai oleh lebih dari satu produk.",
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
  const basePath = page.path.replace(/^\/en(?=\/)/, "");
  return page.locale === "en" ? ENGLISH_TOOL_GUIDES[basePath] : TOOL_GUIDES[basePath];
}

export function getRelatedTools(guide: ToolGuide, locale: ToolPage["locale"] = "id"): ToolPage[] {
  const pages = locale === "en" ? ENGLISH_SEO_PAGES : SEO_PAGES;
  return guide.relatedPaths.flatMap((path) => {
    const page = pages.find((candidate) => candidate.path.replace(/^\/en(?=\/)/, "") === path);
    return page ? [page] : [];
  });
}
