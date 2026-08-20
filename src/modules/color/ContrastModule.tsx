import { useMemo, useState } from "react";
import {
  rgbToHex,
  contrastRatio,
  hexToRgb,
  type RGB,
} from "../../lib/color";
import { useStudio } from "../../store/studio";
import { Card, CardBody, CardHeader } from "../../components/Card";
import { CopyButton } from "../../components/CopyButton";
import { cn } from "../../lib/cn";

type WCAGLevel = "AA" | "AAA" | "AALarge" | "Fail";

function getWCAGLevel(ratio: number): WCAGLevel {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AALarge";
  return "Fail";
}

const LEVEL_META: Record<WCAGLevel, { label: string; color: string; bg: string }> = {
  AAA: { label: "AAA", color: "text-emerald-600 dark:text-emerald-300", bg: "bg-emerald-500/15" },
  AA: { label: "AA", color: "text-green-600 dark:text-green-300", bg: "bg-green-500/15" },
  AALarge: { label: "AA Large", color: "text-amber-600 dark:text-amber-300", bg: "bg-amber-500/15" },
  Fail: { label: "Fail", color: "text-rose-600 dark:text-rose-300", bg: "bg-rose-500/15" },
};

const PRESETS: { label: string; fg: RGB; bg: RGB }[] = [
  { label: "Hitam di Putih", fg: { r: 0, g: 0, b: 0 }, bg: { r: 255, g: 255, b: 255 } },
  { label: "Putih di Hitam", fg: { r: 255, g: 255, b: 255 }, bg: { r: 0, g: 0, b: 0 } },
  { label: "Biru di Putih", fg: { r: 37, g: 99, b: 235 }, bg: { r: 255, g: 255, b: 255 } },
  { label: "Kuning di Hitam", fg: { r: 234, g: 179, b: 8 }, bg: { r: 0, g: 0, b: 0 } },
];

export function ContrastModule() {
  const selectedColor = useStudio((s) => s.selectedColor);

  const [bgColor, setBgColor] = useState<RGB>({ r: 255, g: 255, b: 255 });
  const [fgColor, setFgColor] = useState<RGB>({ r: 0, g: 0, b: 0 });
  const ratio = useMemo(
    () => contrastRatio(fgColor, bgColor),
    [fgColor, bgColor]
  );

  const level = getWCAGLevel(ratio);
  const meta = LEVEL_META[level];

  const fgHex = rgbToHex(fgColor);
  const bgHex = rgbToHex(bgColor);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      {/* Left: Color pickers */}
      <div className="space-y-6">
        <Card>
          <CardHeader
            title="Color Contrast Checker"
            subtitle="Periksa kontras warna untuk WCAG 2.1 compliance"
          />
          <CardBody className="space-y-5">
            {/* Quick presets */}
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Preset Cepat
              </p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setFgColor(p.fg);
                      setBgColor(p.bg);
                    }}
                    className="flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition"
                    style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                  >
                    <span className="h-4 w-4 rounded" style={{ backgroundColor: rgbToHex(p.fg) }} />
                    <span>/</span>
                    <span className="h-4 w-4 rounded" style={{ backgroundColor: rgbToHex(p.bg) }} />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Use selected color as */}
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Gunakan Warna Aktif Sebagai
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFgColor(selectedColor);
                  }}
                  className="rounded-lg border px-4 py-2 text-sm font-medium transition"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                >
                  → ke Foreground
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBgColor(selectedColor);
                  }}
                  className="rounded-lg border px-4 py-2 text-sm font-medium transition"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                >
                  → ke Background
                </button>
              </div>
            </div>

            {/* Color inputs */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Foreground (Teks)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={fgHex}
                    onChange={(e) => {
                      const rgb = hexToRgb(e.target.value);
                      if (rgb) setFgColor(rgb);
                    }}
                    className="h-12 w-14 rounded-lg"
                  />
                  <input
                    type="text"
                    value={fgHex}
                    onChange={(e) => {
                      const rgb = hexToRgb(e.target.value);
                      if (rgb) setFgColor(rgb);
                    }}
                    className="flex-1 rounded-lg border px-3 py-2 font-mono text-sm outline-none"
                    style={{ borderColor: "var(--input-border)", backgroundColor: "var(--input-bg)", color: "var(--input-text)" }}
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Background
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgHex}
                    onChange={(e) => {
                      const rgb = hexToRgb(e.target.value);
                      if (rgb) setBgColor(rgb);
                    }}
                    className="h-12 w-14 rounded-lg"
                  />
                  <input
                    type="text"
                    value={bgHex}
                    onChange={(e) => {
                      const rgb = hexToRgb(e.target.value);
                      if (rgb) setBgColor(rgb);
                    }}
                    className="flex-1 rounded-lg border px-3 py-2 font-mono text-sm outline-none"
                    style={{ borderColor: "var(--input-border)", backgroundColor: "var(--input-bg)", color: "var(--input-text)" }}
                  />
                </div>
              </div>
            </div>

            {/* Live preview */}
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Preview
              </p>
              <div
                className="rounded-2xl border p-6 space-y-4"
                style={{ borderColor: "var(--border)", backgroundColor: bgHex }}
              >
                <p className="text-2xl font-bold" style={{ color: fgHex }}>
                  Heading Contoh
                </p>
                <p className="text-base" style={{ color: fgHex }}>
                  Ini adalah contoh paragraf teks dengan ukuran normal. Pastikan
                  kontras yang cukup untuk keterbacaan yang baik.
                </p>
                <p className="text-sm" style={{ color: fgHex }}>
                  Teks kecil (14px): Perhatikan kontras untuk ukuran ini.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="rounded-lg px-4 py-2 text-sm font-semibold"
                    style={{
                      backgroundColor: fgHex,
                      color: bgHex,
                    }}
                  >
                    Tombol Primer
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border-2 px-4 py-2 text-sm font-semibold"
                    style={{
                      borderColor: fgHex,
                      color: fgHex,
                      backgroundColor: "transparent",
                    }}
                  >
                    Tombol Outline
                  </button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Right: Results */}
      <div className="space-y-6">
        <Card className="h-fit">
          <CardHeader title="Hasil Pemeriksaan" />
          <CardBody className="space-y-4">
            {/* Contrast ratio */}
            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "var(--chip-bg)" }}>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Contrast Ratio</p>
              <p className="mt-1 text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
                {ratio.toFixed(2)}
                <span className="text-lg" style={{ color: "var(--text-muted)" }}>: 1</span>
              </p>
              <div className={cn("mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1", meta.bg)}>
                <span className={cn("text-sm font-semibold", meta.color)}>
                  {meta.label}
                </span>
              </div>
            </div>

            {/* WCAG levels */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                WCAG 2.1 Requirements
              </p>
              {[
                { label: "AA Normal Text", min: 4.5, desc: "Teks normal (< 18pt)" },
                { label: "AA Large Text", min: 3, desc: "Teks besar (≥ 18pt atau 14pt bold)" },
                { label: "AAA Normal Text", min: 7, desc: "Teks normal - Enhanced" },
                { label: "AAA Large Text", min: 4.5, desc: "Teks besar - Enhanced" },
              ].map((req) => {
                const pass = ratio >= req.min;
                return (
                  <div
                    key={req.label}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2",
                      pass ? "bg-emerald-500/10" : "bg-rose-500/10"
                    )}
                  >
                    <div>
                      <span className={cn("text-sm font-medium", pass ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300")}>
                        {req.label}
                      </span>
                      <span className="ml-2 text-[10px]" style={{ color: "var(--text-muted)" }}>{req.desc}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs" style={{ color: "var(--text-secondary)" }}>
                        {req.min}:1
                      </span>
                      <span className={cn("text-lg", pass ? "text-emerald-500" : "text-rose-500")}>
                        {pass ? "✓" : "✗"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Swap button */}
            <button
              type="button"
              onClick={() => {
                const tmp = fgColor;
                setFgColor(bgColor);
                setBgColor(tmp);
              }}
              className="w-full rounded-lg border px-3 py-2 text-xs font-medium transition"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              ↕ Tukar Foreground & Background
            </button>

            {/* Copy CSS */}
            <div className="rounded-xl p-3" style={{ backgroundColor: "var(--chip-bg)" }}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>CSS</span>
                <CopyButton value={`color: ${fgHex}; background-color: ${bgHex};`} label="Salin" />
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap text-[11px]" style={{ color: "var(--text-secondary)" }}>
                {`color: ${fgHex};\nbackground-color: ${bgHex};`}
              </pre>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
