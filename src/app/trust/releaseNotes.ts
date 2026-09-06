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
    releasedAt: "6 September 2026",
    title: "Rilis workspace desain v1.2",
    summary:
      "ALUSNA v1.2 menyatukan workspace desain yang lebih rapi dengan fondasi launch yang lebih aman dan mudah dirawat.",
    items: [
      "Riwayat Fase 0–8 tetap menjadi fondasi rilis ini: baseline dan arsitektur modular, safety net, identitas ALUSNA, migrasi feature, app shell/SEO, hardening, organic growth, serta redesign visual workspace.",
      "Design System kini memiliki draft session yang dipulihkan otomatis, sanitasi input, dan validasi mode serta format export.",
      "Homepage, Color, Typography, Design System, dan Brand Kit memakai visual system editorial yang konsisten di light/dark mode.",
      "Tab Brand Kit dan panel editor menjadi responsif tanpa scroll horizontal pada mobile/tablet.",
      "Pesan aksi Brand Kit memiliki copy Indonesia dan English; export CSS, JSON, SCSS, Tailwind, dan React Native tetap browser-local.",
      "Quality gate Node.js 22, 154 unit test, 31 E2E, production build, dan dependency audit dijalankan ulang untuk rilis ini.",
      "Fondasi bilingual SEO, canonical, hreflang, sitemap, privacy, terms, dan advertising policy dari v1.0 tetap dipertahankan.",
    ],
  },
  en: {
    version: `v${APP_BRAND.version}`,
    releasedAt: "September 6, 2026",
    title: "Design workspace release v1.2",
    summary:
      "ALUSNA v1.2 brings a clearer design workspace together with safer launch foundations and a more maintainable codebase.",
    items: [
      "Phases 0–8 remain the foundation of this release: modular architecture and safety net, ALUSNA identity, feature migration, app shell/SEO, hardening, organic growth, and the visual workspace redesign.",
      "Design System drafts are restored automatically for the current browser session with strict sanitization and mode/export validation.",
      "Homepage, Color, Typography, Design System, and Brand Kit now share a consistent editorial visual system in light and dark mode.",
      "Brand Kit tabs and editor panels are responsive without horizontal scrolling on mobile and tablet.",
      "Brand Kit action messages are bilingual; CSS, JSON, SCSS, Tailwind, and React Native exports remain browser-local.",
      "The Node.js 22 quality gate, 154 unit tests, 31 E2E tests, production build, and dependency audit were rerun for this release.",
      "The bilingual SEO, canonical, hreflang, sitemap, privacy, terms, and advertising-policy foundation from v1.0 remains intact.",
    ],
  },
};
