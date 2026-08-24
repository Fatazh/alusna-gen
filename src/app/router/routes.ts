import { withBrandTitle } from "../../shared/config/brand.ts";
import { localeFromPath, type Locale } from "../../shared/i18n/locale.ts";

export type ColorTab =
  "pattern" | "matching" | "experiment" | "gradient" | "shades" | "image" | "a11y" | "contrast";
export type TopModule = "color" | "font" | "design" | "brand";
export type TrustPageId = "about" | "privacy" | "terms" | "advertising";
export type PageKey = "home" | TopModule | ColorTab | TrustPageId;

type PageBase = {
  key: PageKey;
  locale: Locale;
  path: string;
  title: string;
  heading: string;
  description: string;
};
export type ToolPage = PageBase & {
  kind: "tool";
  topTab: TopModule;
  colorTab?: ColorTab;
};
export type HomePage = PageBase & { kind: "home" };
export type TrustPage = PageBase & { kind: "trust"; id: TrustPageId };
export type SeoPage = HomePage | ToolPage | TrustPage;

type LocalizedCopy = { id: string; en: string };
type ToolDefinition = {
  key: PageKey;
  path: string;
  topTab: TopModule;
  colorTab?: ColorTab;
  title: LocalizedCopy;
  heading: LocalizedCopy;
  description: LocalizedCopy;
};
const copy = (id: string, en: string): LocalizedCopy => ({ id, en });

const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    key: "pattern",
    path: "/color-palette-generator",
    topTab: "color",
    colorTab: "pattern",
    title: copy("Color Palette Generator Gratis", "Free Color Palette Generator"),
    heading: copy("Color Palette Generator Gratis", "Free Color Palette Generator"),
    description: copy(
      "Buat, simpan, dan ekspor palet warna untuk website, aplikasi, dan identitas brand langsung dari browser.",
      "Create, save, and export color palettes for websites, apps, and brand identities directly in your browser.",
    ),
  },
  {
    key: "matching",
    path: "/color-matching",
    topTab: "color",
    colorTab: "matching",
    title: copy("Color Matching dan Harmoni Warna", "Color Matching and Color Harmony"),
    heading: copy("Color Matching dan Harmoni Warna", "Color Matching and Color Harmony"),
    description: copy(
      "Temukan kombinasi warna complementary, analogous, triadic, dan harmoni lain untuk kebutuhan desain.",
      "Discover complementary, analogous, triadic, and other harmonious color combinations for your designs.",
    ),
  },
  {
    key: "experiment",
    path: "/color-mixer",
    topTab: "color",
    colorTab: "experiment",
    title: copy("Color Mixer Online Gratis", "Free Online Color Mixer"),
    heading: copy("Color Mixer Online", "Online Color Mixer"),
    description: copy(
      "Campurkan warna secara visual dan lihat hasil HEX, RGB, HSL, serta komposisi warna secara instan.",
      "Mix colors visually and inspect the resulting HEX, RGB, HSL, and color composition instantly.",
    ),
  },
  {
    key: "gradient",
    path: "/gradient-generator",
    topTab: "color",
    colorTab: "gradient",
    title: copy("CSS Gradient Generator Gratis", "Free CSS Gradient Generator"),
    heading: copy("CSS Gradient Generator", "CSS Gradient Generator"),
    description: copy(
      "Buat gradien CSS, atur arah dan color stop, lalu salin kode siap pakai untuk proyek web.",
      "Build CSS gradients, adjust direction and color stops, then copy production-ready code for web projects.",
    ),
  },
  {
    key: "shades",
    path: "/shade-generator",
    topTab: "color",
    colorTab: "shades",
    title: copy("Color Shade Generator 50–950", "Color Shade Generator 50–950"),
    heading: copy("Color Shade Generator", "Color Shade Generator"),
    description: copy(
      "Hasilkan skala warna 50 sampai 950 untuk design system, Tailwind CSS, dan UI aplikasi.",
      "Generate a 50–950 color scale for design systems, Tailwind CSS, and application interfaces.",
    ),
  },
  {
    key: "image",
    path: "/image-color-extractor",
    topTab: "color",
    colorTab: "image",
    title: copy("Ekstrak Palet Warna dari Gambar", "Extract a Color Palette from an Image"),
    heading: copy("Image Color Palette Extractor", "Image Color Palette Extractor"),
    description: copy(
      "Upload gambar dan ekstrak warna dominan secara lokal di browser tanpa mengirim gambar ke server.",
      "Upload an image and extract its dominant colors locally without sending the file to a server.",
    ),
  },
  {
    key: "a11y",
    path: "/color-blindness-simulator",
    topTab: "color",
    colorTab: "a11y",
    title: copy("Simulasi Buta Warna Online", "Online Color Blindness Simulator"),
    heading: copy("Color Blindness Simulator", "Color Blindness Simulator"),
    description: copy(
      "Simulasikan beberapa jenis buta warna dan periksa apakah palet tetap mudah dibedakan.",
      "Simulate several types of color vision deficiency and check whether your palette remains distinguishable.",
    ),
  },
  {
    key: "contrast",
    path: "/contrast-checker",
    topTab: "color",
    colorTab: "contrast",
    title: copy("WCAG Contrast Checker Gratis", "Free WCAG Contrast Checker"),
    heading: copy("WCAG Color Contrast Checker", "WCAG Color Contrast Checker"),
    description: copy(
      "Periksa rasio kontras warna dan status WCAG AA atau AAA untuk teks, tombol, dan antarmuka.",
      "Check color contrast ratios and WCAG AA or AAA status for text, buttons, and interfaces.",
    ),
  },
  {
    key: "font",
    path: "/font-pairing",
    topTab: "font",
    title: copy("Font Pairing dan Typography Preview", "Font Pairing and Typography Preview"),
    heading: copy("Font Pairing dan Typography Preview", "Font Pairing and Typography Preview"),
    description: copy(
      "Bandingkan pasangan font, atur ukuran dan ketebalan, lalu salin CSS tipografi untuk proyek desain.",
      "Compare font pairs, adjust size and weight, then copy typography CSS for your design project.",
    ),
  },
  {
    key: "design",
    path: "/design-token-generator",
    topTab: "design",
    title: copy(
      "Design Token Generator | CSS, Tailwind dan JSON",
      "Design Token Generator | CSS, Tailwind and JSON",
    ),
    heading: copy("Design Token Generator", "Design Token Generator"),
    description: copy(
      "Buat color roles, typography, spacing, radius, dan shadow lalu ekspor ke CSS, Tailwind, JSON, atau React Native.",
      "Create color roles, typography, spacing, radii, and shadows, then export to CSS, Tailwind, JSON, or React Native.",
    ),
  },
  {
    key: "brand",
    path: "/brand-kit-generator",
    topTab: "brand",
    title: copy("Brand Kit Generator Gratis", "Free Brand Kit Generator"),
    heading: copy("Brand Kit Generator", "Brand Kit Generator"),
    description: copy(
      "Susun palet, tipografi, panduan brand, dan audit aksesibilitas dalam satu alat yang berjalan di browser.",
      "Build a palette, typography system, brand guidelines, and accessibility audit in one browser-based tool.",
    ),
  },
];

const TRUST_DEFINITIONS = [
  {
    id: "about" as const,
    idPath: "/tentang",
    enPath: "/about",
    title: copy("Tentang ALUSNA", "About ALUSNA"),
    heading: copy("Tentang ALUSNA", "About ALUSNA"),
    description: copy(
      "Pelajari tujuan ALUSNA sebagai toolkit warna, tipografi, design system, dan brand kit yang berjalan di browser.",
      "Learn how ALUSNA supports color, typography, design-system, and brand-kit work directly in the browser.",
    ),
  },
  {
    id: "privacy" as const,
    idPath: "/privasi",
    enPath: "/privacy",
    title: copy("Kebijakan Privasi", "Privacy Policy"),
    heading: copy("Kebijakan Privasi", "Privacy Policy"),
    description: copy(
      "Penjelasan tentang penyimpanan lokal, upload file, Google Fonts, tautan sponsor, dan pilihan privasi di ALUSNA.",
      "How ALUSNA handles local storage, file uploads, Google Fonts, sponsor links, and privacy choices.",
    ),
  },
  {
    id: "terms" as const,
    idPath: "/ketentuan",
    enPath: "/terms",
    title: copy("Ketentuan Penggunaan", "Terms of Use"),
    heading: copy("Ketentuan Penggunaan", "Terms of Use"),
    description: copy(
      "Ketentuan penggunaan alat gratis ALUSNA, tanggung jawab pengguna, dan batas layanan.",
      "Terms for using ALUSNA's free tools, user responsibilities, and service limitations.",
    ),
  },
  {
    id: "advertising" as const,
    idPath: "/kebijakan-iklan",
    enPath: "/advertising-policy",
    title: copy("Kebijakan Iklan dan Afiliasi", "Advertising and Affiliate Policy"),
    heading: copy("Kebijakan Iklan dan Afiliasi", "Advertising and Affiliate Policy"),
    description: copy(
      "Cara ALUSNA menandai sponsor, iklan, dan tautan afiliasi tanpa memengaruhi hasil alat desain.",
      "How ALUSNA labels sponsorships, advertisements, and affiliate links without affecting tool results.",
    ),
  },
];

function localizedPath(locale: Locale, basePath: string): string {
  return locale === "en" ? `/en${basePath === "/" ? "" : basePath}` : basePath;
}

function makeHome(locale: Locale): HomePage {
  return {
    kind: "home",
    key: "home",
    locale,
    path: localizedPath(locale, "/"),
    title: withBrandTitle(
      locale === "id"
        ? "Alat Warna, Tipografi & Brand Kit Gratis"
        : "Free Color, Typography & Brand Kit Tools",
    ),
    heading: locale === "id" ? "Bagusnya dimulai di sini." : "Better design starts here.",
    description:
      locale === "id"
        ? "Toolkit desain gratis untuk membuat palet warna, memilih tipografi, menyusun design token, dan membangun brand kit langsung di browser."
        : "A free design toolkit for creating color palettes, choosing typography, generating design tokens, and building brand kits directly in your browser.",
  };
}

function makeTools(locale: Locale): ToolPage[] {
  return TOOL_DEFINITIONS.map((definition) => ({
    kind: "tool",
    key: definition.key,
    locale,
    path: localizedPath(locale, definition.path),
    topTab: definition.topTab,
    colorTab: definition.colorTab,
    title: withBrandTitle(definition.title[locale]),
    heading: definition.heading[locale],
    description: definition.description[locale],
  }));
}

function makeTrustPages(locale: Locale): TrustPage[] {
  return TRUST_DEFINITIONS.map((definition) => ({
    kind: "trust",
    key: definition.id,
    id: definition.id,
    locale,
    path: localizedPath(locale, locale === "id" ? definition.idPath : definition.enPath),
    title: withBrandTitle(definition.title[locale]),
    heading: definition.heading[locale],
    description: definition.description[locale],
  }));
}

export const HOME_PAGE = makeHome("id");
export const ENGLISH_HOME_PAGE = makeHome("en");
export const SEO_PAGES = makeTools("id");
export const ENGLISH_SEO_PAGES = makeTools("en");
export const TRUST_PAGES = makeTrustPages("id");
export const ENGLISH_TRUST_PAGES = makeTrustPages("en");
export const PUBLIC_PAGES: SeoPage[] = [
  HOME_PAGE,
  ...SEO_PAGES,
  ...TRUST_PAGES,
  ENGLISH_HOME_PAGE,
  ...ENGLISH_SEO_PAGES,
  ...ENGLISH_TRUST_PAGES,
];

export const DEFAULT_TOOL_PAGE = SEO_PAGES[0];
export const DEFAULT_SEO_PAGE = HOME_PAGE;

export function findSeoPage(pathname: string): SeoPage {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return (
    PUBLIC_PAGES.find((page) => page.path === normalized) ??
    (localeFromPath(normalized) === "en" ? ENGLISH_HOME_PAGE : HOME_PAGE)
  );
}

export function findPageForModule(
  topTab: TopModule,
  colorTab: ColorTab = "pattern",
  locale: Locale = "id",
): ToolPage {
  const pages = locale === "en" ? ENGLISH_SEO_PAGES : SEO_PAGES;
  return (
    pages.find(
      (page) => page.topTab === topTab && (topTab !== "color" || page.colorTab === colorTab),
    ) ?? pages[0]
  );
}

export function findAlternatePage(page: SeoPage): SeoPage {
  const targetLocale: Locale = page.locale === "id" ? "en" : "id";
  return (
    PUBLIC_PAGES.find(
      (candidate) => candidate.locale === targetLocale && candidate.key === page.key,
    ) ?? (targetLocale === "en" ? ENGLISH_HOME_PAGE : HOME_PAGE)
  );
}

export function isToolPage(page: SeoPage): page is ToolPage {
  return page.kind === "tool";
}

export function isHomePage(page: SeoPage): page is HomePage {
  return page.kind === "home";
}
