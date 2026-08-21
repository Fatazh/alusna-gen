import { type RGB, rgbToHex, bestTextOn, describe, formatRgba } from "../lib/color";
import { getColorName } from "../lib/colorNames";
import { CopyButton } from "./CopyButton";
import { cn } from "../lib/cn";
import { useToast } from "./toastContext";

// ---------------------------------------------------------------------------
// ColorDetail — shows color name + all code formats
// ---------------------------------------------------------------------------
type ColorDetailProps = {
  rgb: RGB;
  alpha?: number;
  showAlpha?: boolean;
  className?: string;
};

export function ColorDetail({ rgb, alpha = 1, showAlpha = false, className }: ColorDetailProps) {
  const info = describe(rgb);
  const colorInfo = getColorName(rgb);
  const rgba = formatRgba({ ...rgb, a: alpha });

  const rows: { label: string; value: string }[] = [
    { label: "HEX", value: info.hex },
    { label: "RGB", value: info.rgb },
    { label: "RGBA", value: rgba },
    { label: "CMYK", value: info.cmyk },
    { label: "HSL", value: info.hsl },
  ];

  return (
    <div className={cn("space-y-2", className)}>
      {/* Color name badge */}
      <div
        className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5"
        style={{ backgroundColor: "var(--chip-bg)" }}
      >
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {colorInfo.name}
        </span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-medium",
            colorInfo.isVariant
              ? "bg-amber-500/15 text-amber-600 dark:text-amber-300"
              : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
          )}
        >
          {colorInfo.isVariant ? "Varian" : "Tepat"}
        </span>
      </div>

      {/* Code rows */}
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between gap-3 rounded-lg px-3 py-2"
          style={{ backgroundColor: "var(--chip-bg)" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-10 text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              {row.label}
            </span>
            <code className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {row.value}
            </code>
          </div>
          <CopyButton value={row.value} />
        </div>
      ))}

      {showAlpha && (
        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          Alpha: <span style={{ color: "var(--text-secondary)" }}>{alpha.toFixed(2)}</span>
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Swatch — color block with auto-resolved name label
// ---------------------------------------------------------------------------
type SwatchProps = {
  rgb: RGB;
  onClick?: () => void;
  onAdd?: () => void;
  selected?: boolean;
  size?: "sm" | "md" | "lg";
  showCode?: boolean;
  /** If provided, overrides auto-resolved color name */
  label?: string;
};

export function Swatch({
  rgb,
  onClick,
  onAdd,
  selected,
  size = "md",
  showCode = true,
  label,
}: SwatchProps) {
  const hex = rgbToHex(rgb);
  const textColor = bestTextOn(rgb);
  const dims = size === "sm" ? "h-20" : size === "lg" ? "h-40" : "h-28";
  const { show } = useToast();

  // Auto-resolve name when no explicit label is provided.
  const colorInfo = getColorName(rgb);
  const displayLabel = label ?? colorInfo.label;

  const copyHex = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(hex);
      show(`✓ ${hex} berhasil disalin!`);
    } catch {
      // fail silently
    }
  };

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "relative w-full overflow-hidden rounded-xl border transition",
          dims,
          selected ? "ring-2 ring-indigo-500/30" : "",
        )}
        style={{
          backgroundColor: hex,
          borderColor: selected ? "rgba(99,102,241,0.5)" : "var(--border)",
        }}
      >
        {/* Color name / label at bottom */}
        <span
          className="absolute bottom-0 left-0 right-0 truncate px-2 pb-2 pt-6 text-left text-[11px] font-medium"
          style={{
            color: textColor,
            background:
              textColor === "#FFFFFF"
                ? "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)"
                : "linear-gradient(to top, rgba(255,255,255,0.35) 0%, transparent 100%)",
          }}
        >
          {displayLabel}
        </span>
      </button>

      {/* HEX badge is a sibling to avoid nesting interactive controls. */}
      {showCode && (
        <button
          type="button"
          onClick={copyHex}
          className="absolute right-2 top-2 cursor-pointer rounded-md px-1.5 py-0.5 text-[10px] font-mono backdrop-blur transition hover:scale-110 hover:brightness-125"
          style={{
            color: textColor,
            backgroundColor:
              textColor === "#FFFFFF" ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)",
          }}
          aria-label={`Salin ${hex}`}
          title="Klik untuk salin HEX"
        >
          {hex}
        </button>
      )}

      {/* Add to palette button */}
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full opacity-0 shadow transition group-hover:opacity-100"
          style={{ backgroundColor: "var(--surface)", color: "var(--text-primary)" }}
          title="Tambah ke palet tersimpan"
        >
          +
        </button>
      )}
    </div>
  );
}
