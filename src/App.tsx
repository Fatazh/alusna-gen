import { lazy, Suspense, useEffect, useState } from "react";
import { HistoryBar } from "./app/layout/HistoryBar";
import { ModuleLoading } from "./app/layout/ModuleLoading";
import { StudioHeader } from "./app/layout/StudioHeader";
import { ToolPageIntro } from "./app/layout/ToolPageIntro";
import { AppProviders } from "./app/providers/AppProviders";
import { useStudio } from "./store/studio";
import { rgbToHex, hexToRgb } from "./lib/color";
import { SponsorSlot } from "./shared/ui/SponsorSlot";
import { APP_BRAND } from "./shared/config/brand";
import {
  findPageForModule,
  findSeoPage,
  type ColorTab,
  type SeoPage,
  type TopModule,
} from "./lib/seoPages";

const PatternModule = lazy(() =>
  import("./modules/color/PatternModule").then((module) => ({ default: module.PatternModule })),
);
const MatchingModule = lazy(() =>
  import("./modules/color/MatchingModule").then((module) => ({ default: module.MatchingModule })),
);
const ExperimentModule = lazy(() =>
  import("./modules/color/ExperimentModule").then((module) => ({
    default: module.ExperimentModule,
  })),
);
const GradientModule = lazy(() =>
  import("./modules/color/GradientModule").then((module) => ({ default: module.GradientModule })),
);
const ShadeModule = lazy(() =>
  import("./modules/color/ShadeModule").then((module) => ({ default: module.ShadeModule })),
);
const ImageModule = lazy(() =>
  import("./modules/color/ImageModule").then((module) => ({ default: module.ImageModule })),
);
const AccessibilityModule = lazy(() =>
  import("./modules/color/AccessibilityModule").then((module) => ({
    default: module.AccessibilityModule,
  })),
);
const ContrastModule = lazy(() =>
  import("./modules/color/ContrastModule").then((module) => ({ default: module.ContrastModule })),
);
const FontModule = lazy(() =>
  import("./modules/font/FontModule").then((module) => ({ default: module.FontModule })),
);
const DesignSystemModule = lazy(() =>
  import("./modules/design/DesignSystemModule").then((module) => ({
    default: module.DesignSystemModule,
  })),
);
const BrandKitModule = lazy(() =>
  import("./modules/brand/BrandKitModule").then((module) => ({ default: module.BrandKitModule })),
);

const COLOR_TABS: { id: ColorTab; label: string; desc: string }[] = [
  { id: "pattern", label: "Pattern", desc: "Palet kurasi" },
  { id: "matching", label: "Matching", desc: "Harmoni warna" },
  { id: "experiment", label: "Experiment", desc: "Campur warna" },
  { id: "gradient", label: "Gradient", desc: "Gradien CSS" },
  { id: "shades", label: "Shades", desc: "Skala 50–950" },
  { id: "image", label: "Image", desc: "Ekstrak gambar" },
  { id: "a11y", label: "Akses", desc: "Buta warna" },
  { id: "contrast", label: "Contrast", desc: "WCAG checker" },
];

function updateBrowserPath(path: string, replace = false) {
  const url = new URL(window.location.href);
  url.pathname = path;
  url.searchParams.delete("m");
  window.history[replace ? "replaceState" : "pushState"]({}, "", url);
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
}

function applySeoMetadata(page: SeoPage) {
  const configuredOrigin = import.meta.env.VITE_SITE_URL?.replace(/\/+$/, "");
  const canonicalUrl = `${configuredOrigin || window.location.origin}${page.path}`;
  document.title = page.title;
  upsertMeta('meta[name="description"]', { name: "description", content: page.description });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: page.title });
  upsertMeta('meta[property="og:site_name"]', {
    property: "og:site_name",
    content: APP_BRAND.name,
  });
  upsertMeta('meta[property="og:description"]', {
    property: "og:description",
    content: page.description,
  });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;

  let structuredData = document.head.querySelector<HTMLScriptElement>(
    `#${APP_BRAND.structuredDataId}`,
  );
  if (!structuredData) {
    structuredData = document.createElement("script");
    structuredData.id = APP_BRAND.structuredDataId;
    structuredData.type = "application/ld+json";
    document.head.appendChild(structuredData);
  }
  structuredData.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${page.heading} — ${APP_BRAND.name}`,
    alternateName: APP_BRAND.slogan,
    description: page.description,
    url: canonicalUrl,
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    inLanguage: "id-ID",
    isAccessibleForFree: true,
    brand: { "@type": "Brand", name: APP_BRAND.name },
    offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
  });
}

export default function App() {
  const initialPage = findSeoPage(window.location.pathname);
  const setActiveModule = useStudio((s) => s.setActiveModule);
  const theme = useStudio((s) => s.theme);
  const setTheme = useStudio((s) => s.setTheme);

  const setSelectedColor = useStudio((s) => s.setSelectedColor);
  const pushColorHistory = useStudio((s) => s.pushColorHistory);
  const selectedColor = useStudio((s) => s.selectedColor);
  const colorHistory = useStudio((s) => s.colorHistory);
  const activeFontFamily = useStudio((s) => s.activeFontFamily);
  const setActiveFontFamily = useStudio((s) => s.setActiveFontFamily);

  const [colorTab, setColorTab] = useState<ColorTab>(initialPage.colorTab ?? "pattern");
  const [topTab, setTopTab] = useState<TopModule>(initialPage.topTab);
  const currentPage = findPageForModule(topTab, colorTab);

  // Restore shared state from URL params (e.g. ?c=%23ff0000&m=color&f=Inter).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const c = p.get("c");
    const m = p.get("m");
    const f = p.get("f");
    if (c && hexToRgb(c)) {
      const rgb = hexToRgb(c)!;
      setSelectedColor(rgb);
      pushColorHistory(rgb);
    }
    if (window.location.pathname === "/" && m && ["color", "font", "design", "brand"].includes(m)) {
      const legacyModule = m as TopModule;
      // This one-time compatibility update translates the legacy `?m=` URL.
      // Routing extraction in Phase 5 will move it out of a React effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTopTab(legacyModule);
      if (m === "color" || m === "font") setActiveModule(m);
      updateBrowserPath(findPageForModule(legacyModule).path, true);
    }
    // Validate font family to prevent CSS injection via URL parameter
    const SAFE_FONT_PATTERN = /^[a-zA-Z0-9\s\-_]+$/;
    if (f && SAFE_FONT_PATTERN.test(f) && f.length <= 100) {
      setActiveFontFamily(f);
    }
  }, [setSelectedColor, pushColorHistory, setActiveModule, setActiveFontFamily]);

  useEffect(() => {
    if (window.location.pathname !== currentPage.path) updateBrowserPath(currentPage.path, true);
    applySeoMetadata(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const onPopState = () => {
      const page = findSeoPage(window.location.pathname);
      setTopTab(page.topTab);
      if (page.colorTab) setColorTab(page.colorTab);
      if (page.topTab === "color" || page.topTab === "font") setActiveModule(page.topTab);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [setActiveModule]);

  // Global keyboard shortcuts (ignore while typing in inputs).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "c") {
        setTopTab("color");
        setActiveModule("color");
        updateBrowserPath(findPageForModule("color", colorTab).path);
      } else if (k === "f") {
        setTopTab("font");
        setActiveModule("font");
        updateBrowserPath(findPageForModule("font").path);
      } else if (k === "d") {
        setTopTab("design");
        updateBrowserPath(findPageForModule("design").path);
      } else if (k === "b") {
        setTopTab("brand");
        updateBrowserPath(findPageForModule("brand").path);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [colorTab, setActiveModule]);

  const shareUrl = (() => {
    const p = new URLSearchParams();
    p.set("c", rgbToHex(selectedColor));
    p.set("f", activeFontFamily);
    return `${window.location.origin}${window.location.pathname}?${p.toString()}`;
  })();

  const switchTopTab = (tab: TopModule) => {
    setTopTab(tab);
    if (tab === "color" || tab === "font") setActiveModule(tab);
    updateBrowserPath(findPageForModule(tab, colorTab).path);
  };

  const switchColorTab = (tab: ColorTab) => {
    setColorTab(tab);
    setTopTab("color");
    setActiveModule("color");
    updateBrowserPath(findPageForModule("color", tab).path);
  };

  return (
    <AppProviders>
      <div className="min-h-screen" style={{ background: "var(--app-bg)" }}>
        <StudioHeader
          topTab={topTab}
          colorTab={colorTab}
          theme={theme}
          shareUrl={shareUrl}
          onSwitchTab={switchTopTab}
          onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        />

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <ToolPageIntro page={currentPage} />

          <SponsorSlot />

          <Suspense fallback={<ModuleLoading />}>
            {/* ── Color Module ── */}
            {topTab === "color" && (
              <div className="space-y-6 animate-fade-in">
                {/* Color sub-tabs */}
                <div
                  className="flex flex-wrap items-center gap-2"
                  role="tablist"
                  aria-label="Alat warna"
                >
                  {COLOR_TABS.map((t) => (
                    <a
                      key={t.id}
                      href={findPageForModule("color", t.id).path}
                      role="tab"
                      aria-selected={colorTab === t.id}
                      onClick={(event) => {
                        event.preventDefault();
                        switchColorTab(t.id);
                      }}
                      className="group rounded-xl border px-4 py-2.5 text-left transition"
                      style={
                        colorTab === t.id
                          ? {
                              borderColor: "var(--border)",
                              backgroundColor: "var(--chip-active-bg)",
                            }
                          : { borderColor: "var(--border)", backgroundColor: "var(--chip-bg)" }
                      }
                    >
                      <div
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {t.label}
                      </div>
                      <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        {t.desc}
                      </div>
                    </a>
                  ))}
                </div>

                {colorTab === "pattern" && <PatternModule />}
                {colorTab === "matching" && <MatchingModule />}
                {colorTab === "experiment" && <ExperimentModule />}
                {colorTab === "gradient" && <GradientModule />}
                {colorTab === "shades" && <ShadeModule />}
                {colorTab === "image" && <ImageModule />}
                {colorTab === "a11y" && <AccessibilityModule />}
                {colorTab === "contrast" && <ContrastModule />}
              </div>
            )}

            {/* ── Font Module ── */}
            {topTab === "font" && <FontModule />}

            {/* ── Design System Module ── */}
            {topTab === "design" && <DesignSystemModule />}

            {/* ── Brand Kit Module ── */}
            {topTab === "brand" && <BrandKitModule />}
          </Suspense>
        </main>

        {/* Recent colors bar */}
        {colorHistory.length > 0 && (
          <HistoryBar
            colors={colorHistory}
            onPick={(rgb) => {
              setSelectedColor(rgb);
              pushColorHistory(rgb);
            }}
            activeHex={rgbToHex(selectedColor)}
          />
        )}
      </div>
    </AppProviders>
  );
}
