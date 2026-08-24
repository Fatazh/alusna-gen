import { lazy, Suspense } from "react";
import { HistoryBar } from "./layout/HistoryBar";
import { AppFooter } from "./layout/AppFooter";
import { ModuleLoading } from "./layout/ModuleLoading";
import { StudioHeader } from "./layout/StudioHeader";
import { ToolPageIntro } from "./layout/ToolPageIntro";
import { AppProviders } from "./providers/AppProviders";
import { AdvertisingSlot } from "./monetization/AdvertisingSlot";
import { useStudioRouter } from "./router/useStudioRouter";
import { usePageSeo } from "./seo/usePageSeo";
import { usePageAnalytics } from "./analytics/usePageAnalytics";
import { rgbToHex } from "../features/color/domain";
import {
  loadAccessibilityModule,
  loadContrastModule,
  loadExperimentModule,
  loadGradientModule,
  loadImageModule,
  loadMatchingModule,
  loadPatternModule,
  loadShadeModule,
} from "../features/color/loaders";
import { loadFontModule } from "../features/typography/loaders";
import { loadDesignSystemModule } from "../features/design-system/loaders";
import { loadBrandKitModule } from "../features/brand-kit/loaders";
import { useStudio } from "../store/studio";
import { LocaleProvider } from "../shared/i18n";
import { findPageForModule, isHomePage, isToolPage, type ColorTab } from "./router/routes";

const PatternModule = lazy(loadPatternModule);
const MatchingModule = lazy(loadMatchingModule);
const ExperimentModule = lazy(loadExperimentModule);
const GradientModule = lazy(loadGradientModule);
const ShadeModule = lazy(loadShadeModule);
const ImageModule = lazy(loadImageModule);
const AccessibilityModule = lazy(loadAccessibilityModule);
const ContrastModule = lazy(loadContrastModule);
const FontModule = lazy(loadFontModule);
const DesignSystemModule = lazy(loadDesignSystemModule);
const BrandKitModule = lazy(loadBrandKitModule);
const TrustPageView = lazy(() =>
  import("./trust/TrustPageView").then((module) => ({ default: module.TrustPageView })),
);
const HomePageView = lazy(() =>
  import("./home/HomePageView").then((module) => ({ default: module.HomePageView })),
);
const ToolGuideView = lazy(() =>
  import("./content/ToolGuideView").then((module) => ({ default: module.ToolGuideView })),
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

export default function App() {
  const theme = useStudio((s) => s.theme);
  const setTheme = useStudio((s) => s.setTheme);

  const setSelectedColor = useStudio((s) => s.setSelectedColor);
  const pushColorHistory = useStudio((s) => s.pushColorHistory);
  const selectedColor = useStudio((s) => s.selectedColor);
  const colorHistory = useStudio((s) => s.colorHistory);
  const activeFontFamily = useStudio((s) => s.activeFontFamily);
  const {
    colorTab,
    topTab,
    currentPage,
    switchTopTab,
    switchColorTab,
    navigateToPath,
    switchLocale,
  } = useStudioRouter();
  const showingTool = isToolPage(currentPage);
  const showingHome = isHomePage(currentPage);

  usePageSeo(currentPage);
  usePageAnalytics(currentPage);

  const shareUrl = (() => {
    const p = new URLSearchParams();
    p.set("c", rgbToHex(selectedColor));
    p.set("f", activeFontFamily);
    return `${window.location.origin}${window.location.pathname}?${p.toString()}`;
  })();

  return (
    <AppProviders>
      <LocaleProvider locale={currentPage.locale}>
        <div className="min-h-screen" style={{ background: "var(--app-bg)" }}>
          <StudioHeader
            topTab={topTab}
            colorTab={colorTab}
            theme={theme}
            shareUrl={shareUrl}
            onSwitchTab={switchTopTab}
            locale={currentPage.locale}
            onNavigateHome={() => navigateToPath(currentPage.locale === "en" ? "/en" : "/")}
            onSwitchLocale={switchLocale}
            onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
            toolNavigationActive={showingTool}
          />

          <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            {showingTool ? (
              <>
                {topTab === "color" && (
                  <nav
                    className="-mx-4 flex items-stretch gap-1 overflow-x-auto border-b px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
                    style={{ borderColor: "var(--border)" }}
                    role="tablist"
                    aria-label={currentPage.locale === "en" ? "Color tools" : "Alat warna"}
                  >
                    {COLOR_TABS.map((t) => {
                      const active = colorTab === t.id;
                      return (
                        <a
                          key={t.id}
                          href={findPageForModule("color", t.id, currentPage.locale).path}
                          role="tab"
                          aria-selected={active}
                          onClick={(event) => {
                            event.preventDefault();
                            switchColorTab(t.id);
                          }}
                          className="relative shrink-0 px-3 py-4 text-left text-xs font-semibold transition sm:px-4"
                          style={{ color: active ? "var(--accent)" : "var(--text-secondary)" }}
                          title={
                            currentPage.locale === "en"
                              ? (
                                  {
                                    pattern: "Curated palettes",
                                    matching: "Color harmony",
                                    experiment: "Mix colors",
                                    gradient: "CSS gradients",
                                    shades: "50–950 scale",
                                    image: "Extract from image",
                                    a11y: "Color blindness",
                                    contrast: "WCAG checker",
                                  } as Record<ColorTab, string>
                                )[t.id]
                              : t.desc
                          }
                        >
                          {currentPage.locale === "en" && t.id === "a11y"
                            ? "Accessibility"
                            : t.label}
                          {active && (
                            <span
                              aria-hidden="true"
                              className="absolute inset-x-3 bottom-0 h-0.5 sm:inset-x-4"
                              style={{ backgroundColor: "var(--accent)" }}
                            />
                          )}
                        </a>
                      );
                    })}
                  </nav>
                )}
                <ToolPageIntro page={currentPage} />
                <AdvertisingSlot />
                <Suspense fallback={<ModuleLoading />}>
                  {/* ── Color Module ── */}
                  {topTab === "color" && (
                    <div className="space-y-6 animate-fade-in">
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
                <Suspense fallback={null}>
                  <ToolGuideView page={currentPage} onNavigate={navigateToPath} />
                </Suspense>
              </>
            ) : showingHome ? (
              <div className="py-8 sm:py-10">
                <Suspense fallback={<ModuleLoading />}>
                  <HomePageView onNavigate={navigateToPath} />
                </Suspense>
              </div>
            ) : (
              <div className="py-8 sm:py-10">
                <Suspense fallback={<ModuleLoading />}>
                  <TrustPageView page={currentPage} />
                </Suspense>
              </div>
            )}
          </main>

          <AppFooter locale={currentPage.locale} onNavigate={navigateToPath} />

          {/* Recent colors bar */}
          {showingTool && colorHistory.length > 0 && (
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
      </LocaleProvider>
    </AppProviders>
  );
}
