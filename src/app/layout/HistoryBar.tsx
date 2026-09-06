import { rgbToHex, type RGB } from "../../features/color/domain";
import { useLocale } from "../../shared/i18n";

type HistoryBarProps = {
  colors: RGB[];
  onPick: (rgb: RGB) => void;
  activeHex: string;
};

export function HistoryBar({ colors, onPick, activeHex }: HistoryBarProps) {
  const { text } = useLocale();
  return (
    <div
      className="sticky bottom-0 z-20 border-t backdrop-blur"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--card-bg)" }}
    >
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
        <span
          className="shrink-0 text-[11px] font-medium uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          {text("Riwayat", "Recent")}
        </span>
        <div className="flex gap-2">
          {colors.map((color, index) => {
            const hex = rgbToHex(color);
            const isActive = hex === activeHex;
            return (
              <button
                key={`${hex}-${index}`}
                type="button"
                onClick={() => onPick(color)}
                title={hex}
                className="h-9 w-9 rounded-md border transition hover:-translate-y-px active:scale-95"
                style={{
                  backgroundColor: hex,
                  borderColor: isActive ? "var(--text-primary)" : "var(--border)",
                  boxShadow: isActive ? "0 0 0 2px var(--focus-ring)" : undefined,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
