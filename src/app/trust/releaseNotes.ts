import { APP_BRAND } from "../../shared/config/brand.ts";
import { type Locale } from "../../shared/i18n/locale.ts";

export type ReleaseNotes = {
  version: string;
  releasedAt: string;
  title: string;
  summary: string;
  items: readonly string[];
};

export const RELEASE_NOTES: Record<Locale, ReleaseNotes> = {
  id: {
    version: `v${APP_BRAND.version}`,
    releasedAt: "24 Agustus 2026",
    title: "Rilis publik pertama",
    summary:
      "Fondasi ALUSNA siap dipublikasikan sebagai toolkit desain gratis yang berjalan langsung di browser.",
    items: [
      "Sebelas alat untuk palet, harmoni, pencampuran warna, gradien, shade, ekstraksi gambar, aksesibilitas, tipografi, design token, dan Brand Kit.",
      "Antarmuka bilingual dengan URL Indonesia yang tetap dipertahankan dan versi Inggris di bawah /en.",
      "Penyimpanan preferensi dan aset yang didukung tetap lokal di browser tanpa mewajibkan akun.",
      "Halaman statis, metadata bilingual, canonical, hreflang, dan sitemap disiapkan untuk peluncuran SEO.",
      "Halaman privasi, ketentuan, dan kebijakan iklan tersedia sebelum integrasi iklan pihak ketiga.",
    ],
  },
  en: {
    version: `v${APP_BRAND.version}`,
    releasedAt: "August 24, 2026",
    title: "First public release",
    summary:
      "The ALUSNA foundation is ready to launch as a free design toolkit that runs directly in the browser.",
    items: [
      "Eleven tools for palettes, color harmony, color mixing, gradients, shades, image extraction, accessibility, typography, design tokens, and Brand Kits.",
      "A bilingual interface that preserves Indonesian URLs and publishes English pages under /en.",
      "Supported preferences and assets remain stored locally in the browser with no account required.",
      "Static pages, bilingual metadata, canonical URLs, hreflang, and sitemap output are ready for SEO launch.",
      "Privacy, terms, and advertising-policy pages are available before any third-party ad integration.",
    ],
  },
};
