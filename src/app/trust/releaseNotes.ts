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
      "Brand Kit difokuskan pada identitas aktif; panel palet tersimpan yang redundan dihapus tanpa menghapus data saved colors.",
      "Saran pasangan font kini mengikuti font aktif; klik pairing hanya mengubah preview pasangan tanpa mengganti pilihan utama.",
      "Design System kini memiliki color picker dan input HEX untuk memilih warna dasar sendiri, dengan opsi memakai warna aktif dari workspace Color.",
      "Component Kit MVP hadir dengan preview Button, Badge, Input, Select, Checkbox, Switch, dan Alert berbasis token serta CSS handoff yang bisa disalin.",
      "Kategori Overlay menambahkan contoh Tabs, Dialog, dan Toast dengan interaksi lokal serta pola aksesibel untuk handoff.",
      "Handoff Component Kit kini bisa disalin sebagai CSS, Tailwind, atau React dengan nilai token yang konsisten.",
      "Pesan aksi Brand Kit memiliki copy Indonesia dan English; export CSS, JSON, SCSS, Tailwind, dan React Native tetap browser-local.",
      "Quality gate Node.js 22, 160 unit test, 33 skenario E2E (32 lulus, 1 opsional), production build, dan dependency audit dijalankan ulang untuk rilis ini.",
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
      "Brand Kit now focuses on the active identity; the redundant saved-palette panel was removed without deleting saved-color data.",
      "Font pairing suggestions now follow the active family; clicking a pairing only changes the pairing preview, not the primary selection.",
      "Design System now includes a color picker and HEX input for a custom base color, with an option to use the active Color workspace value.",
      "The Component Kit MVP adds token-driven Button, Badge, Input, Select, Checkbox, Switch, and Alert previews with copyable CSS handoff.",
      "The Overlays category adds Tabs, Dialog, and Toast examples with local interactions and accessible handoff patterns.",
      "Component Kit handoff can now be copied as CSS, Tailwind, or React with consistent token values.",
      "Brand Kit action messages are bilingual; CSS, JSON, SCSS, Tailwind, and React Native exports remain browser-local.",
      "The Node.js 22 quality gate, 160 unit tests, 33 E2E scenarios (32 passed, 1 optional), production build, and dependency audit were rerun for this release.",
      "The bilingual SEO, canonical, hreflang, sitemap, privacy, terms, and advertising-policy foundation from v1.0 remains intact.",
    ],
  },
};
