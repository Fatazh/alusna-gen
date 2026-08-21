import { rgbToHex, type RGB } from "../../features/color/domain";

type HistoryBarProps = {
  colors: RGB[];
  onPick: (rgb: RGB) => void;
  activeHex: string;
};

export function HistoryBar({ colors, onPick, activeHex }: HistoryBarProps) {
  return (
    <div
      className="sticky bottom-0 z-20 border-t backdrop-blur"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--card-bg)" }}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-3 sm:px-6">
        <span
          className="shrink-0 text-[11px] font-medium uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          Riwayat
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
                className="h-9 w-9 rounded-lg border transition"
                style={{
                  backgroundColor: hex,
                  borderColor: isActive ? "var(--text-primary)" : "var(--border)",
                  boxShadow: isActive ? "0 0 0 2px rgba(99,102,241,0.3)" : undefined,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
