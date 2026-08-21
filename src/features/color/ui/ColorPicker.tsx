import { useId, useState, useMemo, useEffect, useRef } from "react";
import {
  type RGB,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  randomColor,
  hexToRgb,
} from "../model/color";
import { searchColorNames } from "../model/colorNames";
import { bestTextOn } from "../model/color";

type ColorPickerProps = {
  rgb: RGB;
  alpha?: number;
  onRgbChange: (rgb: RGB) => void;
  onAlphaChange?: (a: number) => void;
  showAlpha?: boolean;
};

const hasEyeDropper = typeof window !== "undefined" && "EyeDropper" in window;

export function ColorPicker({
  rgb,
  alpha = 1,
  onRgbChange,
  onAlphaChange,
  showAlpha = false,
}: ColorPickerProps) {
  const pickerId = useId();
  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Local hex text state — decoupled from the parent RGB so the cursor
  // doesn't jump while the user is mid-typing.
  const [hexText, setHexText] = useState(() => rgbToHex(rgb));
  const hexFocused = useRef(false);

  // Sync incoming RGB changes to the text field only when it's not focused.
  useEffect(() => {
    if (!hexFocused.current) {
      setHexText(rgbToHex(rgb));
    }
  }, [rgb]);

  const searchResults = useMemo(() => searchColorNames(query), [query]);

  const updateHsl = (partial: Partial<typeof hsl>) => {
    onRgbChange(hslToRgb({ ...hsl, ...partial }));
  };

  const trackStyle = (gradient: string): React.CSSProperties => ({
    background: gradient,
    height: "8px",
    borderRadius: "9999px",
  });

  const onSearchSelect = (r: RGB) => {
    onRgbChange(r);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <div className="space-y-4">
      {/* ── Picker header ── */}
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={rgbToHex(rgb)}
          onChange={(e) => {
            const hex = e.target.value;
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            onRgbChange({ r, g, b });
          }}
          className="h-12 w-14 shrink-0 rounded-xl"
          aria-label="Pemilih warna"
        />
        <div className="flex-1">
          <label
            htmlFor={`${pickerId}-hex`}
            className="mb-1 block text-[11px] font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            Kode HEX
          </label>
          <input
            id={`${pickerId}-hex`}
            type="text"
            value={hexText}
            onFocus={() => {
              hexFocused.current = true;
            }}
            onBlur={() => {
              hexFocused.current = false;
              // Normalize back to canonical uppercase hex on blur.
              setHexText(rgbToHex(rgb));
            }}
            onChange={(e) => {
              const v = e.target.value;
              // Allow typing freely; only characters that could form a hex code.
              if (!/^#?[0-9a-fA-F]{0,6}$/.test(v)) return;
              setHexText(v);
              const clean = v.startsWith("#") ? v : `#${v}`;
              // Apply immediately when a full 6-digit hex is entered.
              if (/^#[0-9a-fA-F]{6}$/.test(clean)) {
                onRgbChange({
                  r: parseInt(clean.slice(1, 3), 16),
                  g: parseInt(clean.slice(3, 5), 16),
                  b: parseInt(clean.slice(5, 7), 16),
                });
              }
              // Also handle 3-digit shorthand (#fff → #ffffff).
              if (/^#[0-9a-fA-F]{3}$/.test(clean)) {
                const [, a, b2, c] = clean;
                onRgbChange({
                  r: parseInt(a + a, 16),
                  g: parseInt(b2 + b2, 16),
                  b: parseInt(c + c, 16),
                });
              }
            }}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            style={{
              borderColor: "var(--input-border)",
              backgroundColor: "var(--input-bg)",
              color: "var(--input-text)",
            }}
          />
        </div>
        {/* Search toggle */}
        <button
          type="button"
          onClick={() => setSearchOpen((o) => !o)}
          className={
            "shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition " +
            (searchOpen
              ? "border-indigo-500/50 bg-indigo-500/20 text-indigo-600 dark:text-indigo-300"
              : "")
          }
          style={
            !searchOpen
              ? { borderColor: "var(--input-border)", color: "var(--text-secondary)" }
              : undefined
          }
          title="Cari warna berdasarkan nama"
        >
          Cari nama
        </button>

        {/* Random color */}
        <button
          type="button"
          onClick={() => onRgbChange(randomColor())}
          className="shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition"
          style={{ borderColor: "var(--input-border)", color: "var(--text-secondary)" }}
          title="Warna acak"
        >
          Acak
        </button>

        {/* EyeDropper (Chromium-only) */}
        {hasEyeDropper && (
          <button
            type="button"
            onClick={async () => {
              try {
                const ed = new (
                  window as unknown as {
                    EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> };
                  }
                ).EyeDropper();
                const res = await ed.open();
                const rgb = hexToRgb(res.sRGBHex);
                if (rgb) onRgbChange(rgb);
              } catch {
                /* user cancelled */
              }
            }}
            className="shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition"
            style={{ borderColor: "var(--input-border)", color: "var(--text-secondary)" }}
            title="Ambil warna dari layar"
          >
            Pipet
          </button>
        )}
      </div>

      {/* ── Search panel ── */}
      {searchOpen && (
        <div
          className="rounded-xl border p-3 space-y-2"
          style={{ borderColor: "var(--card-border)", backgroundColor: "var(--card-bg)" }}
        >
          <input
            type="text"
            autoFocus
            placeholder="Ketik nama warna... (contoh: crimson, teal, gold)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            style={{
              borderColor: "var(--input-border)",
              backgroundColor: "var(--input-bg)",
              color: "var(--input-text)",
            }}
          />
          <div className="grid max-h-52 grid-cols-3 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-4">
            {searchResults.length === 0 && (
              <p
                className="col-span-full py-3 text-center text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Tidak ada warna yang cocok
              </p>
            )}
            {searchResults.map((r) => {
              const textCol = bestTextOn(r.rgb);
              return (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => onSearchSelect(r.rgb)}
                  className="group relative h-14 overflow-hidden rounded-lg border transition hover:scale-105"
                  style={{ backgroundColor: r.hex, borderColor: "var(--border)" }}
                  title={r.name}
                >
                  <span
                    className="absolute inset-x-0 bottom-0 px-1.5 pb-1 pt-4 text-left text-[10px] font-medium leading-tight"
                    style={{
                      color: textCol,
                      background:
                        textCol === "#FFFFFF"
                          ? "linear-gradient(to top, rgba(0,0,0,0.5), transparent)"
                          : "linear-gradient(to top, rgba(255,255,255,0.5), transparent)",
                    }}
                  >
                    {r.name}
                  </span>
                </button>
              );
            })}
          </div>
          {!query && (
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              {searchResults.length} warna tersedia — ketik untuk filter
            </p>
          )}
        </div>
      )}

      {/* ── HSL sliders ── */}
      <Slider
        label="Hue"
        value={hsl.h}
        min={0}
        max={360}
        suffix="°"
        trackStyle={trackStyle(
          "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
        )}
        onChange={(v) => updateHsl({ h: v })}
      />
      <Slider
        label="Saturation"
        value={hsl.s}
        min={0}
        max={100}
        suffix="%"
        trackStyle={trackStyle(
          `linear-gradient(to right, hsl(${hsl.h}, 0%, ${hsl.l}%), hsl(${hsl.h}, 100%, ${hsl.l}%))`,
        )}
        onChange={(v) => updateHsl({ s: v })}
      />
      <Slider
        label="Lightness"
        value={hsl.l}
        min={0}
        max={100}
        suffix="%"
        trackStyle={trackStyle(
          `linear-gradient(to right, #000, hsl(${hsl.h}, ${hsl.s}%, 50%), #fff)`,
        )}
        onChange={(v) => updateHsl({ l: v })}
      />

      {/* ── RGB fields ── */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <NumberField label="R" value={rgb.r} onChange={(r) => onRgbChange({ ...rgb, r })} />
        <NumberField label="G" value={rgb.g} onChange={(g) => onRgbChange({ ...rgb, g })} />
        <NumberField label="B" value={rgb.b} onChange={(b) => onRgbChange({ ...rgb, b })} />
      </div>

      {/* ── Alpha ── */}
      {showAlpha && onAlphaChange && (
        <Slider
          label="Alpha"
          value={Math.round(alpha * 100)}
          min={0}
          max={100}
          suffix="%"
          trackStyle={trackStyle(
            `linear-gradient(to right, rgba(${rgb.r},${rgb.g},${rgb.b},0), rgba(${rgb.r},${rgb.g},${rgb.b},1))`,
          )}
          onChange={(v) => onAlphaChange(v / 100)}
        />
      )}

      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
        HSV: {hsv.h}°&nbsp;{hsv.s}%&nbsp;{hsv.v}%
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal sub-components
// ---------------------------------------------------------------------------
function Slider({
  label,
  value,
  min,
  max,
  suffix,
  trackStyle,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  trackStyle: React.CSSProperties;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="font-medium" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
        <span className="font-mono" style={{ color: "var(--text-secondary)" }}>
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ marginTop: "4px" }}
      />
      <div className="mt-1" style={trackStyle} />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const fieldId = useId();
  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-1 block text-[10px] font-medium uppercase"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </label>
      <input
        id={fieldId}
        type="number"
        min={0}
        max={255}
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!Number.isNaN(v)) onChange(Math.max(0, Math.min(255, v)));
        }}
        className="w-full rounded-lg border px-2 py-1.5 text-sm outline-none"
        style={{
          borderColor: "var(--input-border)",
          backgroundColor: "var(--input-bg)",
          color: "var(--input-text)",
        }}
      />
    </div>
  );
}
