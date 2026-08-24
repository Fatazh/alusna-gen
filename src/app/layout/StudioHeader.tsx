import { Briefcase } from "@phosphor-icons/react/Briefcase";
import { GridFour } from "@phosphor-icons/react/GridFour";
import { Moon } from "@phosphor-icons/react/Moon";
import { Palette } from "@phosphor-icons/react/Palette";
import { Sun } from "@phosphor-icons/react/Sun";
import { TextAa } from "@phosphor-icons/react/TextAa";
import { type Icon } from "@phosphor-icons/react/lib";
import { CopyButton } from "../../shared/ui/CopyButton";
import { APP_BRAND } from "../../shared/config/brand";
import { type Locale } from "../../shared/i18n";
import { findPageForModule, type ColorTab, type TopModule } from "../router/routes";

const TOP_TABS: { id: TopModule; label: string; icon: Icon; desc: string }[] = [
  { id: "color", label: "Warna", icon: Palette, desc: "Color Playground" },
  { id: "font", label: "Font", icon: TextAa, desc: "Typography Preview" },
  { id: "design", label: "Design System", icon: GridFour, desc: "Token Generator" },
  { id: "brand", label: "Brand Kit", icon: Briefcase, desc: "Brand Identity" },
];

type StudioHeaderProps = {
  topTab: TopModule;
  colorTab: ColorTab;
  theme: "dark" | "light";
  shareUrl: string;
  onSwitchTab: (tab: TopModule) => void;
  onNavigateHome: () => void;
  onToggleTheme: () => void;
  toolNavigationActive: boolean;
  locale: Locale;
  onSwitchLocale: () => void;
};

export function StudioHeader({
  topTab,
  colorTab,
  theme,
  shareUrl,
  onSwitchTab,
  onNavigateHome,
  onToggleTheme,
  toolNavigationActive,
  locale,
  onSwitchLocale,
}: StudioHeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-xl"
      style={{ backgroundColor: "var(--chrome-bg)" }}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href={locale === "en" ? "/en" : "/"}
          aria-label={locale === "en" ? "ALUSNA home" : "Beranda ALUSNA"}
          onClick={(event) => {
            event.preventDefault();
            onNavigateHome();
          }}
          className="flex min-h-16 items-center gap-3 rounded-lg"
        >
          <div
            className="relative flex h-9 w-9 items-center justify-center rounded-md text-base font-extrabold text-white"
            style={{ backgroundColor: "var(--accent)" }}
            aria-hidden="true"
          >
            A
          </div>
          <div className="flex items-baseline gap-4">
            <div
              className="text-lg font-extrabold tracking-[-0.035em]"
              style={{ color: "var(--chrome-text)" }}
            >
              {APP_BRAND.name}
            </div>
            <p className="hidden text-xs lg:block" style={{ color: "var(--chrome-sub)" }}>
              {locale === "en" ? APP_BRAND.sloganEn : APP_BRAND.slogan}
            </p>
          </div>
        </a>

        <div className="flex min-w-0 items-center gap-1 sm:gap-3">
          <nav
            className="flex min-w-0 items-stretch overflow-x-auto"
            role="tablist"
            aria-label={locale === "en" ? "Studio modules" : "Modul studio"}
          >
            {TOP_TABS.map((tab) => {
              const TabIcon = tab.icon;
              const active = toolNavigationActive && topTab === tab.id;
              return (
                <a
                  key={tab.id}
                  href={findPageForModule(tab.id, colorTab, locale).path}
                  role="tab"
                  aria-selected={active}
                  onClick={(event) => {
                    event.preventDefault();
                    onSwitchTab(tab.id);
                  }}
                  title={tab.desc}
                  className="relative inline-flex min-h-16 shrink-0 items-center gap-2 px-2.5 text-xs font-semibold transition sm:px-4 sm:text-sm"
                  style={{ color: active ? "var(--accent)" : "var(--text-secondary)" }}
                >
                  <TabIcon size={18} weight={active ? "fill" : "regular"} aria-hidden="true" />
                  <span className={tab.id === "design" ? "hidden sm:inline" : "inline"}>
                    {locale === "en" && tab.id === "color" ? "Color" : tab.label}
                  </span>
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-2 bottom-0 h-0.5"
                      style={{ backgroundColor: "var(--accent)" }}
                    />
                  )}
                </a>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={onSwitchLocale}
            className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-[10px] font-bold transition"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            aria-label={locale === "en" ? "Gunakan Bahasa Indonesia" : "Use English"}
            title={locale === "en" ? "Bahasa Indonesia" : "English"}
          >
            {locale === "en" ? "ID" : "EN"}
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            className="hidden h-9 w-9 items-center justify-center rounded-md border transition md:inline-flex"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            title={locale === "en" ? "Change theme" : "Ganti tema"}
            aria-label={
              theme === "dark"
                ? locale === "en"
                  ? "Use light theme"
                  : "Gunakan tema terang"
                : locale === "en"
                  ? "Use dark theme"
                  : "Gunakan tema gelap"
            }
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <CopyButton
            value={shareUrl}
            label={locale === "en" ? "Copy link" : "Salin tautan"}
            className="hidden border px-3 py-2 md:inline-flex"
          />
        </div>
      </div>
    </header>
  );
}
