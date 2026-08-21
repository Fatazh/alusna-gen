export type ColorTab =
  "pattern" | "matching" | "experiment" | "gradient" | "shades" | "image" | "a11y" | "contrast";

export type TopModule = "color" | "font" | "design" | "brand";

export type ToolPage = {
  kind: "tool";
  path: string;
  topTab: TopModule;
  colorTab?: ColorTab;
  title: string;
  heading: string;
  description: string;
};

export type HomePage = {
  kind: "home";
  path: "/";
  title: string;
  heading: string;
  description: string;
};

export type TrustPageId = "about" | "privacy" | "terms" | "advertising";

export type TrustPage = {
  kind: "trust";
  id: TrustPageId;
  path: string;
  title: string;
  heading: string;
  description: string;
};

export type SeoPage = HomePage | ToolPage | TrustPage;

export const HOME_PAGE: HomePage = {
  kind: "home",
  path: "/",
  title: withBrandTitle("Alat Warna, Tipografi & Brand Kit Gratis"),
  heading: "Bagusnya dimulai di sini.",
  description:
    "Toolkit desain gratis untuk membuat palet warna, memilih tipografi, menyusun design token, dan membangun brand kit langsung di browser.",
};

export const SEO_PAGES: ToolPage[] = [
  {
    kind: "tool",
    path: "/color-palette-generator",
    topTab: "color",
    colorTab: "pattern",
    title: withBrandTitle("Color Palette Generator Gratis"),
    heading: "Color Palette Generator Gratis",
    description:
      "Buat, simpan, dan ekspor palet warna untuk website, aplikasi, dan identitas brand langsung dari browser.",
  },
  {
    kind: "tool",
    path: "/color-matching",
    topTab: "color",
    colorTab: "matching",
    title: withBrandTitle("Color Matching dan Harmoni Warna"),
    heading: "Color Matching dan Harmoni Warna",
    description:
      "Temukan kombinasi warna complementary, analogous, triadic, dan harmoni lain untuk kebutuhan desain.",
  },
  {
    kind: "tool",
    path: "/color-mixer",
    topTab: "color",
    colorTab: "experiment",
    title: withBrandTitle("Color Mixer Online Gratis"),
    heading: "Color Mixer Online",
    description:
      "Campurkan warna secara visual dan lihat hasil HEX, RGB, HSL, serta komposisi warna secara instan.",
  },
  {
    kind: "tool",
    path: "/gradient-generator",
    topTab: "color",
    colorTab: "gradient",
    title: withBrandTitle("CSS Gradient Generator Gratis"),
    heading: "CSS Gradient Generator",
    description:
      "Buat gradien CSS, atur arah dan color stop, lalu salin kode siap pakai untuk proyek web.",
  },
  {
    kind: "tool",
    path: "/shade-generator",
    topTab: "color",
    colorTab: "shades",
    title: withBrandTitle("Color Shade Generator 50–950"),
    heading: "Color Shade Generator",
    description:
      "Hasilkan skala warna 50 sampai 950 untuk design system, Tailwind CSS, dan UI aplikasi.",
  },
  {
    kind: "tool",
    path: "/image-color-extractor",
    topTab: "color",
    colorTab: "image",
    title: withBrandTitle("Ekstrak Palet Warna dari Gambar"),
    heading: "Image Color Palette Extractor",
    description:
      "Upload gambar dan ekstrak warna dominan secara lokal di browser tanpa mengirim gambar ke server.",
  },
  {
    kind: "tool",
    path: "/color-blindness-simulator",
    topTab: "color",
    colorTab: "a11y",
    title: withBrandTitle("Simulasi Buta Warna Online"),
    heading: "Color Blindness Simulator",
    description:
      "Simulasikan beberapa jenis buta warna dan periksa apakah palet tetap mudah dibedakan.",
  },
  {
    kind: "tool",
    path: "/contrast-checker",
    topTab: "color",
    colorTab: "contrast",
    title: withBrandTitle("WCAG Contrast Checker Gratis"),
    heading: "WCAG Color Contrast Checker",
    description:
      "Periksa rasio kontras warna dan status WCAG AA atau AAA untuk teks, tombol, dan antarmuka.",
  },
  {
    kind: "tool",
    path: "/font-pairing",
    topTab: "font",
    title: withBrandTitle("Font Pairing dan Typography Preview"),
    heading: "Font Pairing dan Typography Preview",
    description:
      "Bandingkan pasangan font, atur ukuran dan ketebalan, lalu salin CSS tipografi untuk proyek desain.",
  },
  {
    kind: "tool",
    path: "/design-token-generator",
    topTab: "design",
    title: withBrandTitle("Design Token Generator | CSS, Tailwind dan JSON"),
    heading: "Design Token Generator",
    description:
      "Buat color roles, typography, spacing, radius, dan shadow lalu ekspor ke CSS, Tailwind, JSON, atau React Native.",
  },
  {
    kind: "tool",
    path: "/brand-kit-generator",
    topTab: "brand",
    title: withBrandTitle("Brand Kit Generator Gratis"),
    heading: "Brand Kit Generator",
    description:
      "Susun palet, tipografi, panduan brand, dan audit aksesibilitas dalam satu alat yang berjalan di browser.",
  },
];

export const TRUST_PAGES: TrustPage[] = [
  {
    kind: "trust",
    id: "about",
    path: "/tentang",
    title: withBrandTitle("Tentang ALUSNA"),
    heading: "Tentang ALUSNA",
    description:
      "Pelajari tujuan ALUSNA sebagai toolkit warna, tipografi, design system, dan brand kit yang berjalan di browser.",
  },
  {
    kind: "trust",
    id: "privacy",
    path: "/privasi",
    title: withBrandTitle("Kebijakan Privasi"),
    heading: "Kebijakan Privasi",
    description:
      "Penjelasan tentang penyimpanan lokal, upload file, Google Fonts, tautan sponsor, dan pilihan privasi di ALUSNA.",
  },
  {
    kind: "trust",
    id: "terms",
    path: "/ketentuan",
    title: withBrandTitle("Ketentuan Penggunaan"),
    heading: "Ketentuan Penggunaan",
    description:
      "Ketentuan penggunaan alat gratis ALUSNA, tanggung jawab pengguna, dan batas layanan.",
  },
  {
    kind: "trust",
    id: "advertising",
    path: "/kebijakan-iklan",
    title: withBrandTitle("Kebijakan Iklan dan Afiliasi"),
    heading: "Kebijakan Iklan dan Afiliasi",
    description:
      "Cara ALUSNA menandai sponsor, iklan, dan tautan afiliasi tanpa memengaruhi hasil alat desain.",
  },
];

export const PUBLIC_PAGES: SeoPage[] = [HOME_PAGE, ...SEO_PAGES, ...TRUST_PAGES];

export const DEFAULT_TOOL_PAGE = SEO_PAGES[0];
export const DEFAULT_SEO_PAGE = HOME_PAGE;

export function findSeoPage(pathname: string): SeoPage {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return PUBLIC_PAGES.find((page) => page.path === normalized) ?? DEFAULT_SEO_PAGE;
}

export function findPageForModule(topTab: TopModule, colorTab: ColorTab = "pattern"): ToolPage {
  return (
    SEO_PAGES.find(
      (page) => page.topTab === topTab && (topTab !== "color" || page.colorTab === colorTab),
    ) ?? DEFAULT_TOOL_PAGE
  );
}

export function isToolPage(page: SeoPage): page is ToolPage {
  return page.kind === "tool";
}

export function isHomePage(page: SeoPage): page is HomePage {
  return page.kind === "home";
}
import { withBrandTitle } from "../../shared/config/brand.ts";
