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
      <div className="mx-auto grid max-w-[1440px] grid-cols-[auto_1fr] items-center gap-x-3 px-4 py-2 sm:px-6 lg:px-8 xl:grid-cols-[auto_1fr_auto] xl:gap-x-6 xl:py-0">
        <a
          href={locale === "en" ? "/en" : "/"}
          aria-label={locale === "en" ? "ALUSNA home" : "Beranda ALUSNA"}
          onClick={(event) => {
            event.preventDefault();
            onNavigateHome();
          }}
          className="col-start-1 row-start-1 flex min-h-12 shrink-0 items-center rounded-lg xl:min-h-16"
        >
          <img
            src={theme === "dark" ? "/logo.svg" : "/logo.png"}
            alt={`${APP_BRAND.name} — ${locale === "en" ? APP_BRAND.sloganEn : APP_BRAND.slogan}`}
            className="h-9 w-auto rounded-md object-contain sm:h-11"
          />
        </a>

        <nav
          className="col-span-2 row-start-2 grid min-w-0 grid-cols-4 border-t pt-1 xl:col-span-1 xl:col-start-2 xl:row-start-1 xl:flex xl:justify-end xl:border-t-0 xl:pt-0"
          style={{ borderColor: "var(--border)" }}
          role="tablist"
          aria-label={locale === "en" ? "Studio modules" : "Modul studio"}
        >
          {TOP_TABS.map((tab) => {
            const TabIcon = tab.icon;
            const active = toolNavigationActive && topTab === tab.id;
            const mobileLabel =
              tab.id === "color"
                ? locale === "en"
                  ? "Color"
                  : "Warna"
                : tab.id === "design"
                  ? "Design"
                  : tab.id === "brand"
                    ? "Brand"
                    : tab.label;
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
                className="relative inline-flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-md px-1 text-[11px] font-semibold transition hover:bg-[var(--surface-hover)] active:scale-[0.98] xl:min-h-16 xl:shrink-0 xl:gap-2 xl:px-4 xl:text-sm"
                style={{
                  color: active ? "var(--accent)" : "var(--text-secondary)",
                  backgroundColor: active ? "var(--accent-soft)" : undefined,
                }}
              >
                <TabIcon size={18} weight={active ? "fill" : "regular"} aria-hidden="true" />
                <span className="truncate xl:hidden">{mobileLabel}</span>
                <span className="hidden xl:inline">
                  {locale === "en" && tab.id === "color" ? "Color" : tab.label}
                </span>
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-2 bottom-0 h-0.5 rounded-full"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="col-start-2 row-start-1 flex min-w-0 items-center justify-end gap-1 sm:gap-2 xl:col-start-3 xl:gap-3">
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border transition"
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
