import { useMemo, useState } from "react";
import { ArrowDown } from "@phosphor-icons/react/ArrowDown";
import { CheckCircle } from "@phosphor-icons/react/CheckCircle";
import { Sparkle } from "@phosphor-icons/react/Sparkle";
import { Swap } from "@phosphor-icons/react/Swap";
import { XCircle } from "@phosphor-icons/react/XCircle";
import {
  contrastRatio,
  hexToRgb,
  rgbToHex,
  suggestAccessibleColor,
  type RGB,
} from "@alusna/shared/color";
import { useStudio } from "../../../../store/studio";
import { Card, CardBody, CardHeader } from "../../../../shared/ui/Card";
import { CopyButton } from "../../../../shared/ui/CopyButton";
import { useLocale } from "../../../../shared/i18n";
import { cn } from "../../../../shared/lib/cn";

type WCAGLevel = "AA" | "AAA" | "AALarge" | "Fail";

function getWCAGLevel(ratio: number): WCAGLevel {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AALarge";
  return "Fail";
}

const LEVEL_META: Record<WCAGLevel, { label: string; color: string; bg: string }> = {
  AAA: { label: "AAA", color: "text-emerald-800 dark:text-emerald-300", bg: "bg-emerald-500/15" },
  AA: { label: "AA", color: "text-green-800 dark:text-green-300", bg: "bg-green-500/15" },
  AALarge: {
    label: "AA Large",
    color: "text-amber-900 dark:text-amber-300",
    bg: "bg-amber-500/15",
  },
  Fail: { label: "Fail", color: "text-rose-800 dark:text-rose-300", bg: "bg-rose-500/15" },
};

const PRESETS: { labelId: string; labelEn: string; fg: RGB; bg: RGB }[] = [
  {
    labelId: "Hitam di Putih",
    labelEn: "Black on White",
    fg: { r: 0, g: 0, b: 0 },
    bg: { r: 255, g: 255, b: 255 },
  },
  {
    labelId: "Putih di Hitam",
    labelEn: "White on Black",
    fg: { r: 255, g: 255, b: 255 },
    bg: { r: 0, g: 0, b: 0 },
  },
  {
    labelId: "Biru di Putih",
    labelEn: "Blue on White",
    fg: { r: 37, g: 99, b: 235 },
    bg: { r: 255, g: 255, b: 255 },
  },
  {
    labelId: "Kuning di Hitam",
    labelEn: "Yellow on Black",
    fg: { r: 234, g: 179, b: 8 },
    bg: { r: 0, g: 0, b: 0 },
  },
];

export function ContrastModule() {
  const { text } = useLocale();
  const selectedColor = useStudio((s) => s.selectedColor);

  const [bgColor, setBgColor] = useState<RGB>({ r: 255, g: 255, b: 255 });
  const [fgColor, setFgColor] = useState<RGB>({ r: 0, g: 0, b: 0 });
  const ratio = useMemo(() => contrastRatio(fgColor, bgColor), [fgColor, bgColor]);

  const suggestedFg = useMemo(
    () => (ratio < 4.5 ? suggestAccessibleColor(fgColor, bgColor, 4.5) : null),
    [fgColor, bgColor, ratio],
  );
  const suggestedBg = useMemo(
    () => (ratio < 4.5 ? suggestAccessibleColor(bgColor, fgColor, 4.5) : null),
    [fgColor, bgColor, ratio],
  );
  const suggestedFgRatio = useMemo(
    () => (suggestedFg ? contrastRatio(suggestedFg, bgColor) : 0),
    [suggestedFg, bgColor],
  );
  const suggestedBgRatio = useMemo(
    () => (suggestedBg ? contrastRatio(fgColor, suggestedBg) : 0),
    [suggestedBg, fgColor],
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
            subtitle={text(
              "Periksa kontras warna untuk kepatuhan WCAG 2.1",
              "Check color contrast for WCAG 2.1 compliance",
            )}
          />
          <CardBody className="space-y-5">
            {/* Quick presets */}
            <div>
              <p
                className="mb-2 text-[11px] font-medium uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                {text("Preset Cepat", "Quick presets")}
              </p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.labelId}
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
                    <span>{text(p.labelId, p.labelEn)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Use selected color as */}
            <div>
              <p
                className="mb-2 text-[11px] font-medium uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                {text("Gunakan Warna Aktif Sebagai", "Use active color as")}
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
                  <ArrowDown size={13} className="mr-1 inline" aria-hidden="true" />
                  {text("ke Foreground", "to foreground")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBgColor(selectedColor);
                  }}
                  className="rounded-lg border px-4 py-2 text-sm font-medium transition"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                >
                  <ArrowDown size={13} className="mr-1 inline" aria-hidden="true" />
                  {text("ke Background", "to background")}
                </button>
              </div>
            </div>

            {/* Color inputs */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  className="mb-2 block text-[11px] font-medium uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  {text("Foreground (Teks)", "Foreground (Text)")}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    aria-label={text("Warna depan", "Foreground color")}
                    value={fgHex}
                    onChange={(e) => {
                      const rgb = hexToRgb(e.target.value);
                      if (rgb) setFgColor(rgb);
                    }}
                    className="h-12 w-14 rounded-lg"
                  />
                  <input
                    type="text"
                    aria-label={text("Kode HEX warna depan", "Foreground HEX code")}
                    value={fgHex}
                    onChange={(e) => {
                      const rgb = hexToRgb(e.target.value);
                      if (rgb) setFgColor(rgb);
                    }}
                    className="flex-1 rounded-lg border px-3 py-2 font-mono text-sm outline-none"
                    style={{
                      borderColor: "var(--input-border)",
                      backgroundColor: "var(--input-bg)",
                      color: "var(--input-text)",
                    }}
                  />
                </div>
              </div>
              <div>
                <label
                  className="mb-2 block text-[11px] font-medium uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Background
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    aria-label={text("Warna latar", "Background color")}
                    value={bgHex}
                    onChange={(e) => {
                      const rgb = hexToRgb(e.target.value);
                      if (rgb) setBgColor(rgb);
                    }}
                    className="h-12 w-14 rounded-lg"
                  />
                  <input
                    type="text"
                    aria-label={text("Kode HEX warna latar", "Background HEX code")}
                    value={bgHex}
                    onChange={(e) => {
                      const rgb = hexToRgb(e.target.value);
                      if (rgb) setBgColor(rgb);
                    }}
                    className="flex-1 rounded-lg border px-3 py-2 font-mono text-sm outline-none"
                    style={{
                      borderColor: "var(--input-border)",
                      backgroundColor: "var(--input-bg)",
                      color: "var(--input-text)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Live preview */}
            <div>
              <p
                className="mb-2 text-[11px] font-medium uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Preview
              </p>
              <div
                className="rounded-2xl border p-6 space-y-4"
                style={{ borderColor: "var(--border)", backgroundColor: bgHex }}
              >
                <p className="text-2xl font-bold" style={{ color: fgHex }}>
                  {text("Heading Contoh", "Sample heading")}
                </p>
                <p className="text-base" style={{ color: fgHex }}>
                  {text(
                    "Ini adalah contoh paragraf teks dengan ukuran normal. Pastikan kontras yang cukup untuk keterbacaan.",
                    "This is a normal-sized sample paragraph. Make sure the contrast is sufficient for readability.",
                  )}
                </p>
                <p className="text-sm" style={{ color: fgHex }}>
                  {text(
                    "Teks kecil (14px): Perhatikan kontras untuk ukuran ini.",
                    "Small text (14px): Check contrast at this size.",
                  )}
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
                    {text("Tombol Primer", "Primary button")}
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
                    {text("Tombol Outline", "Outline button")}
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
          <CardHeader title={text("Hasil Pemeriksaan", "Check results")} />
          <CardBody className="space-y-4">
            {/* Contrast ratio */}
            <div
              className="rounded-xl p-4 text-center"
              style={{ backgroundColor: "var(--chip-bg)" }}
            >
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                {text("Rasio Kontras", "Contrast ratio")}
              </p>
              <p className="mt-1 text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
                {ratio.toFixed(2)}
                <span className="text-lg" style={{ color: "var(--text-muted)" }}>
                  : 1
                </span>
              </p>
              <div
                className={cn(
                  "mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1",
                  meta.bg,
                )}
              >
                <span className={cn("text-sm font-semibold", meta.color)}>{meta.label}</span>
              </div>
            </div>

            {/* WCAG levels */}
            <div className="space-y-2">
              <p
                className="text-[11px] font-medium uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                {text("Persyaratan WCAG 2.1", "WCAG 2.1 requirements")}
              </p>
              {[
                {
                  labelId: "AA Normal Text",
                  labelEn: "AA Normal Text",
                  min: 4.5,
                  descId: "Teks normal (< 18pt)",
                  descEn: "Normal text (< 18pt)",
                },
                {
                  labelId: "AA Large Text",
                  labelEn: "AA Large Text",
                  min: 3,
                  descId: "Teks besar (≥ 18pt atau 14pt bold)",
                  descEn: "Large text (≥ 18pt or 14pt bold)",
                },
                {
                  labelId: "AAA Normal Text",
                  labelEn: "AAA Normal Text",
                  min: 7,
                  descId: "Teks normal - Enhanced",
                  descEn: "Normal text - Enhanced",
                },
                {
                  labelId: "AAA Large Text",
                  labelEn: "AAA Large Text",
                  min: 4.5,
                  descId: "Teks besar - Enhanced",
                  descEn: "Large text - Enhanced",
                },
              ].map((req) => {
                const pass = ratio >= req.min;
                return (
                  <div
                    key={req.labelId}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2",
                      pass ? "bg-emerald-500/10" : "bg-rose-500/10",
                    )}
                  >
                    <div>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          pass
                            ? "text-emerald-800 dark:text-emerald-300"
                            : "text-rose-800 dark:text-rose-300",
                        )}
                      >
                        {text(req.labelId, req.labelEn)}
                      </span>
                      <span className="ml-2 text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {text(req.descId, req.descEn)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {req.min}:1
                      </span>
                      {pass ? (
                        <CheckCircle
                          size={18}
                          className="text-emerald-800 dark:text-emerald-300"
                          aria-label={text("Lulus", "Pass")}
                        />
                      ) : (
                        <XCircle
                          size={18}
                          className="text-rose-800 dark:text-rose-300"
                          aria-label={text("Tidak lulus", "Fail")}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Smart Fix for WCAG AA */}
            {ratio < 4.5 && (suggestedFg || suggestedBg) && (
              <div
                className="rounded-xl border p-3.5 space-y-3"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--chip-bg)" }}
              >
                <div className="flex items-center gap-2">
                  <Sparkle size={16} className="text-amber-500 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                      {text("Saran Perbaikan WCAG AA (4.5:1)", "WCAG AA (4.5:1) Smart Fix")}
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {text(
                        "Sesuaikan lightness warna terdekat agar lulus standar keterbacaan.",
                        "Adjust nearest lightness to meet readability standards.",
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid gap-2">
                  {suggestedFg && (
                    <button
                      type="button"
                      onClick={() => setFgColor(suggestedFg)}
                      className="flex items-center justify-between rounded-lg border p-2.5 text-left transition hover:border-[var(--accent)]"
                      style={{ borderColor: "var(--border)", backgroundColor: "var(--card-bg)" }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-6 w-6 rounded border shrink-0"
                          style={{
                            backgroundColor: rgbToHex(suggestedFg),
                            borderColor: "var(--border)",
                          }}
                        />
                        <div>
                          <p
                            className="text-xs font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {text("Perbaiki Teks", "Fix text color")}
                          </p>
                          <p
                            className="font-mono text-[10px]"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {rgbToHex(suggestedFg)}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {suggestedFgRatio.toFixed(1)}:1
                      </span>
                    </button>
                  )}

                  {suggestedBg && (
                    <button
                      type="button"
                      onClick={() => setBgColor(suggestedBg)}
                      className="flex items-center justify-between rounded-lg border p-2.5 text-left transition hover:border-[var(--accent)]"
                      style={{ borderColor: "var(--border)", backgroundColor: "var(--card-bg)" }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-6 w-6 rounded border shrink-0"
                          style={{
                            backgroundColor: rgbToHex(suggestedBg),
                            borderColor: "var(--border)",
                          }}
                        />
                        <div>
                          <p
                            className="text-xs font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {text("Perbaiki Latar", "Fix background")}
                          </p>
                          <p
                            className="font-mono text-[10px]"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {rgbToHex(suggestedBg)}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {suggestedBgRatio.toFixed(1)}:1
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}

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
              <Swap size={15} className="mr-1 inline" aria-hidden="true" />
              {text("Tukar Foreground & Background", "Swap foreground & background")}
            </button>

            {/* Copy CSS */}
            <div className="rounded-xl p-3" style={{ backgroundColor: "var(--chip-bg)" }}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  CSS
                </span>
                <CopyButton value={`color: ${fgHex}; background-color: ${bgHex};`} />
              </div>
              <pre
                className="overflow-x-auto whitespace-pre-wrap text-[11px]"
                style={{ color: "var(--text-secondary)" }}
              >
                {`color: ${fgHex};\nbackground-color: ${bgHex};`}
              </pre>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
