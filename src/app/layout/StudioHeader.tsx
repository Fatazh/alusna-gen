import { CopyButton } from "../../shared/ui/CopyButton";
import { APP_BRAND } from "../../shared/config/brand";
import { findPageForModule, type ColorTab, type TopModule } from "../router/routes";

const TOP_TABS: { id: TopModule; label: string; icon: string; desc: string }[] = [
  { id: "color", label: "Warna", icon: "🎨", desc: "Color Playground" },
  { id: "font", label: "Font", icon: "🔤", desc: "Typography Preview" },
  { id: "design", label: "Design System", icon: "🏗", desc: "Token Generator" },
  { id: "brand", label: "Brand Kit", icon: "🏷", desc: "Brand Identity" },
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
}: StudioHeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 border-b border-white/5 backdrop-blur"
      style={{ backgroundColor: "var(--chrome-bg)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a
          href="/"
          aria-label="Beranda ALUSNA"
          onClick={(event) => {
            event.preventDefault();
            onNavigateHome();
          }}
          className="flex items-center gap-2.5 rounded-xl"
        >
          <div
            className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 via-indigo-500 to-fuchsia-500 text-sm font-black text-white shadow-sm"
            aria-hidden="true"
          >
            A
            <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-300" />
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: "var(--chrome-text)" }}>
              {APP_BRAND.name}
            </div>
            <p className="text-[11px]" style={{ color: "var(--chrome-sub)" }}>
              {APP_BRAND.slogan}
            </p>
          </div>
        </a>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="hidden rounded-md border px-2.5 py-1 text-xs font-medium transition sm:inline-flex"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            title="Ganti tema"
          >
            {theme === "dark" ? "☀ Terang" : "🌙 Gelap"}
          </button>
          <CopyButton value={shareUrl} label="Salin tautan" className="hidden sm:inline-flex" />

          <nav
            className="flex gap-0.5 rounded-full p-1"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--chip-bg)",
              border: "1px solid var(--border)",
            }}
            role="tablist"
            aria-label="Modul studio"
          >
            {TOP_TABS.map((tab) => (
              <a
                key={tab.id}
                href={findPageForModule(tab.id, colorTab).path}
                role="tab"
                aria-selected={toolNavigationActive && topTab === tab.id}
                onClick={(event) => {
                  event.preventDefault();
                  onSwitchTab(tab.id);
                }}
                title={tab.desc}
                className="rounded-full px-3 py-1.5 text-xs font-medium transition"
                style={
                  toolNavigationActive && topTab === tab.id
                    ? {
                        backgroundColor: "var(--surface)",
                        color: "var(--text-primary)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      }
                    : { color: "var(--text-secondary)" }
                }
              >
                <span className="hidden sm:inline">{tab.icon} </span>
                {tab.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
