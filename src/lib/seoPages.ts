export type ColorTab =
  "pattern" | "matching" | "experiment" | "gradient" | "shades" | "image" | "a11y" | "contrast";

export type TopModule = "color" | "font" | "design" | "brand";

export type SeoPage = {
  path: string;
  topTab: TopModule;
  colorTab?: ColorTab;
  title: string;
  heading: string;
  description: string;
};

export const SEO_PAGES: SeoPage[] = [
  {
    path: "/color-palette-generator",
    topTab: "color",
    colorTab: "pattern",
    title: withBrandTitle("Color Palette Generator Gratis"),
    heading: "Color Palette Generator Gratis",
    description:
      "Buat, simpan, dan ekspor palet warna untuk website, aplikasi, dan identitas brand langsung dari browser.",
  },
  {
    path: "/color-matching",
    topTab: "color",
    colorTab: "matching",
    title: withBrandTitle("Color Matching dan Harmoni Warna"),
    heading: "Color Matching dan Harmoni Warna",
    description:
      "Temukan kombinasi warna complementary, analogous, triadic, dan harmoni lain untuk kebutuhan desain.",
  },
  {
    path: "/color-mixer",
    topTab: "color",
    colorTab: "experiment",
    title: withBrandTitle("Color Mixer Online Gratis"),
    heading: "Color Mixer Online",
    description:
      "Campurkan warna secara visual dan lihat hasil HEX, RGB, HSL, serta komposisi warna secara instan.",
  },
  {
    path: "/gradient-generator",
    topTab: "color",
    colorTab: "gradient",
    title: withBrandTitle("CSS Gradient Generator Gratis"),
    heading: "CSS Gradient Generator",
    description:
      "Buat gradien CSS, atur arah dan color stop, lalu salin kode siap pakai untuk proyek web.",
  },
  {
    path: "/shade-generator",
    topTab: "color",
    colorTab: "shades",
    title: withBrandTitle("Color Shade Generator 50–950"),
    heading: "Color Shade Generator",
    description:
      "Hasilkan skala warna 50 sampai 950 untuk design system, Tailwind CSS, dan UI aplikasi.",
  },
  {
    path: "/image-color-extractor",
    topTab: "color",
    colorTab: "image",
    title: withBrandTitle("Ekstrak Palet Warna dari Gambar"),
    heading: "Image Color Palette Extractor",
    description:
      "Upload gambar dan ekstrak warna dominan secara lokal di browser tanpa mengirim gambar ke server.",
  },
  {
    path: "/color-blindness-simulator",
    topTab: "color",
    colorTab: "a11y",
    title: withBrandTitle("Simulasi Buta Warna Online"),
    heading: "Color Blindness Simulator",
    description:
      "Simulasikan beberapa jenis buta warna dan periksa apakah palet tetap mudah dibedakan.",
  },
  {
    path: "/contrast-checker",
    topTab: "color",
    colorTab: "contrast",
    title: withBrandTitle("WCAG Contrast Checker Gratis"),
    heading: "WCAG Color Contrast Checker",
    description:
      "Periksa rasio kontras warna dan status WCAG AA atau AAA untuk teks, tombol, dan antarmuka.",
  },
  {
    path: "/font-pairing",
    topTab: "font",
    title: withBrandTitle("Font Pairing dan Typography Preview"),
    heading: "Font Pairing dan Typography Preview",
    description:
      "Bandingkan pasangan font, atur ukuran dan ketebalan, lalu salin CSS tipografi untuk proyek desain.",
  },
  {
    path: "/design-token-generator",
    topTab: "design",
    title: withBrandTitle("Design Token Generator | CSS, Tailwind dan JSON"),
    heading: "Design Token Generator",
    description:
      "Buat color roles, typography, spacing, radius, dan shadow lalu ekspor ke CSS, Tailwind, JSON, atau React Native.",
  },
  {
    path: "/brand-kit-generator",
    topTab: "brand",
    title: withBrandTitle("Brand Kit Generator Gratis"),
    heading: "Brand Kit Generator",
    description:
      "Susun palet, tipografi, panduan brand, dan audit aksesibilitas dalam satu alat yang berjalan di browser.",
  },
];

export const DEFAULT_SEO_PAGE = SEO_PAGES[0];

export function findSeoPage(pathname: string): SeoPage {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return SEO_PAGES.find((page) => page.path === normalized) ?? DEFAULT_SEO_PAGE;
}

export function findPageForModule(topTab: TopModule, colorTab: ColorTab = "pattern"): SeoPage {
  return (
    SEO_PAGES.find(
      (page) => page.topTab === topTab && (topTab !== "color" || page.colorTab === colorTab),
    ) ?? DEFAULT_SEO_PAGE
  );
}
import { withBrandTitle } from "../shared/config/brand.ts";
