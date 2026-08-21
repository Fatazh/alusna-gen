import { lazy, Suspense } from "react";
import { HistoryBar } from "./app/layout/HistoryBar";
import { ModuleLoading } from "./app/layout/ModuleLoading";
import { StudioHeader } from "./app/layout/StudioHeader";
import { ToolPageIntro } from "./app/layout/ToolPageIntro";
import { AppProviders } from "./app/providers/AppProviders";
import { useStudioRouter } from "./app/router/useStudioRouter";
import { usePageSeo } from "./app/seo/usePageSeo";
import { useStudio } from "./store/studio";
import { rgbToHex } from "./lib/color";
import { SponsorSlot } from "./shared/ui/SponsorSlot";
import { findPageForModule, type ColorTab } from "./app/router/routes";

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

export default function App() {
  const theme = useStudio((s) => s.theme);
  const setTheme = useStudio((s) => s.setTheme);

  const setSelectedColor = useStudio((s) => s.setSelectedColor);
  const pushColorHistory = useStudio((s) => s.pushColorHistory);
  const selectedColor = useStudio((s) => s.selectedColor);
  const colorHistory = useStudio((s) => s.colorHistory);
  const activeFontFamily = useStudio((s) => s.activeFontFamily);
  const { colorTab, topTab, currentPage, switchTopTab, switchColorTab } = useStudioRouter();

  usePageSeo(currentPage);

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
