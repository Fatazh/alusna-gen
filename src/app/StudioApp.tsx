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
  const { colorTab, topTab, currentPage, switchTopTab, switchColorTab, navigateToPath } =
    useStudioRouter();
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
      <div className="min-h-screen" style={{ background: "var(--app-bg)" }}>
        <StudioHeader
          topTab={topTab}
          colorTab={colorTab}
          theme={theme}
          shareUrl={shareUrl}
          onSwitchTab={switchTopTab}
          onNavigateHome={() => navigateToPath("/")}
          onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          toolNavigationActive={showingTool}
        />

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          {showingTool ? (
            <>
              <ToolPageIntro page={currentPage} />
              <AdvertisingSlot />
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
              <Suspense fallback={null}>
                <ToolGuideView page={currentPage} onNavigate={navigateToPath} />
              </Suspense>
            </>
          ) : showingHome ? (
            <Suspense fallback={<ModuleLoading />}>
              <HomePageView onNavigate={navigateToPath} />
            </Suspense>
          ) : (
            <Suspense fallback={<ModuleLoading />}>
              <TrustPageView page={currentPage} />
            </Suspense>
          )}
        </main>

        <AppFooter onNavigate={navigateToPath} />

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
    </AppProviders>
  );
}
