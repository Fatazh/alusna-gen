import { useState, useMemo } from "react";
import {
  harmony,
  rgbToHex,
  type HarmonyType,
  type RGB,
  contrastRatio,
  bestTextOn,
} from "../../lib/color";
import { getColorName } from "../../lib/colorNames";
import {
  getSmartPairings,
  ROLE_META,
  type ColorPair,
} from "../../lib/colorMatch";
import { useStudio } from "../../store/studio";
import { Card, CardBody, CardHeader } from "../../components/Card";
import { Swatch, ColorDetail } from "../../components/Swatch";
import { ColorPicker } from "../../components/ColorPicker";
import { cn } from "../../lib/cn";
import { useToast } from "../../components/Toast";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const HARMONIES: { id: HarmonyType; label: string; desc: string }[] = [
  { id: "complementary", label: "Complementary", desc: "Berlawanan 180°" },
  { id: "analogous", label: "Analogous", desc: "Berdekatan ±30°" },
  { id: "triadic", label: "Triadic", desc: "Segitiga 120°" },
  { id: "tetradic", label: "Tetradic", desc: "Persegi 90°" },
  { id: "splitComplementary", label: "Split Comp.", desc: "Split 150°/210°" },
  { id: "monochromatic", label: "Monochromatic", desc: "Variasi lightness" },
];

type View = "smart" | "classic";

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function MatchingModule() {
  const selectedColor = useStudio((s) => s.selectedColor);
  const setSelectedColor = useStudio((s) => s.setSelectedColor);
  const pushColorHistory = useStudio((s) => s.pushColorHistory);
  const selectedAlpha = useStudio((s) => s.selectedAlpha);
  const setSelectedAlpha = useStudio((s) => s.setSelectedAlpha);
  const saveColor = useStudio((s) => s.saveColor);

  const [view, setView] = useState<View>("smart");
  const [harmonyType, setHarmonyType] = useState<HarmonyType>("complementary");

  const selectWithHistory = (rgb: RGB) => {
    setSelectedColor(rgb);
    pushColorHistory(rgb);
  };

  const smartPairs = useMemo(
    () => getSmartPairings(selectedColor),
    [selectedColor],
  );
  const harmonyColors = useMemo(
    () => harmony(selectedColor, harmonyType),
    [selectedColor, harmonyType],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      {/* ── Left column ── */}
      <div className="space-y-6">
        {/* View switcher */}
        <div className="flex items-center gap-2">
          <ViewTab active={view === "smart"} onClick={() => setView("smart")}>
            Rekomendasi Cerdas
          </ViewTab>
          <ViewTab
            active={view === "classic"}
            onClick={() => setView("classic")}
          >
            Harmoni Klasik
          </ViewTab>
        </div>

        {/* ── SMART VIEW ── */}
        {view === "smart" && (
          <SmartView
            primary={selectedColor}
            pairs={smartPairs}
            onSelect={selectWithHistory}
            onSave={(rgb) => saveColor(rgb, getColorName(rgb).label)}
          />
        )}

        {/* ── CLASSIC VIEW ── */}
        {view === "classic" && (
          <ClassicView
            primary={selectedColor}
            harmonyType={harmonyType}
            colors={harmonyColors}
            onTypeChange={setHarmonyType}
            onSelect={selectWithHistory}
            onSave={(rgb) => saveColor(rgb, getColorName(rgb).label)}
          />
        )}

        {/* Color picker (shared by both views) */}
        <Card>
          <CardHeader
            title="Warna Primer"
            subtitle="Pilih atau ketik nama warna"
          />
          <CardBody>
            <ColorPicker
              rgb={selectedColor}
              alpha={selectedAlpha}
              onRgbChange={setSelectedColor}
              onAlphaChange={setSelectedAlpha}
              showAlpha
            />
          </CardBody>
        </Card>
      </div>

      {/* ── Right column — detail panel ── */}
      <Card className="h-fit">
        <CardHeader title="Detail Warna Aktif" />
        <CardBody className="space-y-4">
          <Swatch rgb={selectedColor} size="lg" showCode={false} />
          <ColorDetail rgb={selectedColor} alpha={selectedAlpha} showAlpha />
          <button
            type="button"
            onClick={() =>
              saveColor(selectedColor, getColorName(selectedColor).label)
            }
            className="w-full rounded-lg bg-indigo-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-indigo-400"
          >
            Simpan ke palet
          </button>
        </CardBody>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SmartView — ranked pairing suggestions
// ---------------------------------------------------------------------------
function SmartView({
  primary,
  pairs,
  onSelect,
  onSave,
}: {
  primary: RGB;
  pairs: ColorPair[];
  onSelect: (rgb: RGB) => void;
  onSave: (rgb: RGB) => void;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Matching Color — Rekomendasi Cerdas"
          subtitle="Pasangan disusun dari dominan → pendukung → cadangan"
        />
        <CardBody className="space-y-5">
          {/* Ranked grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {pairs.map((pair) => (
              <PairCard
                key={pair.rank}
                pair={pair}
                onSelect={onSelect}
                onSave={onSave}
              />
            ))}
          </div>

          {/* Live preview mockup */}
          <PalettePreview primary={primary} pairs={pairs} />
        </CardBody>
      </Card>
    </div>
  );
}

// Individual pair card
function PairCard({
  pair,
  onSelect,
  onSave,
}: {
  pair: ColorPair;
  onSelect: (rgb: RGB) => void;
  onSave: (rgb: RGB) => void;
}) {
  const meta = ROLE_META[pair.role];
  const hex = rgbToHex(pair.rgb);
  const textCol = bestTextOn(pair.rgb);
  const colorInfo = getColorName(pair.rgb);
  const { show } = useToast();

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
    <div className="group flex items-stretch gap-0 overflow-hidden rounded-xl border transition" style={{ borderColor: "var(--border)" }}>
      {/* Color swatch strip */}
      <div
        className="relative w-20 shrink-0 transition hover:w-24"
        style={{ backgroundColor: hex }}
      >
        <button
          type="button"
          onClick={() => onSelect(pair.rgb)}
          className="absolute inset-0"
          aria-label={`Pilih ${colorInfo.label}`}
          title={`Pilih ${colorInfo.label}`}
        />
        <button
          type="button"
          onClick={copyHex}
          className="absolute bottom-2 left-2 right-2 cursor-pointer text-left font-mono text-[9px] leading-tight transition hover:underline"
          style={{ color: textCol }}
          aria-label={`Salin ${hex}`}
          title="Klik untuk salin HEX"
        >
          {hex}
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between gap-1 px-3 py-2.5" style={{ backgroundColor: "var(--chip-bg)" }}>
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold",
              meta.bg,
              meta.color,
            )}
          >
            {meta.label}
          </span>
          <button
            type="button"
            onClick={() => onSave(pair.rgb)}
            className="text-[10px] transition"
            style={{ color: "var(--text-muted)" }}
            title="Simpan ke palet"
          >
            + simpan
          </button>
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
            {colorInfo.label}
          </p>
          <p className="mt-0.5 text-[10px] leading-tight" style={{ color: "var(--text-muted)" }}>
            {pair.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// Mini UI preview showing the palette in action
function PalettePreview({
  primary,
  pairs,
}: {
  primary: RGB;
  pairs: ColorPair[];
}) {
  const dominan = pairs.find((p) => p.role === "dominan")?.rgb ?? primary;
  const aksen = pairs.find((p) => p.role === "aksen")?.rgb ?? primary;
  const netral = pairs.find((p) => p.role === "netral")?.rgb ?? primary;
  const teks = pairs.find((p) => p.role === "teks")?.rgb ?? primary;

  const bgHex = rgbToHex(netral);
  const primaryHex = rgbToHex(primary);
  const dominanHex = rgbToHex(dominan);
  const aksenHex = rgbToHex(aksen);
  const teksHex = rgbToHex(teks);

  const contrast = contrastRatio(primary, teks);
  const rating =
    contrast >= 7
      ? "AAA"
      : contrast >= 4.5
        ? "AA"
        : contrast >= 3
          ? "AA Large"
          : "Fail";

  return (
    <div>
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        Preview Penggunaan
      </p>
      <div
        className="rounded-2xl border p-5 space-y-4"
        style={{ backgroundColor: bgHex, borderColor: "var(--border)" }}
      >
        {/* Heading */}
        <div>
          <p
            className="text-xl font-bold leading-tight"
            style={{ color: dominanHex }}
          >
            Judul Halaman
          </p>
          <p className="mt-1 text-sm" style={{ color: teksHex }}>
            Ini adalah contoh teks paragraf menggunakan palet yang telah
            dipilih.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg px-4 py-1.5 text-sm font-semibold"
            style={{
              backgroundColor: primaryHex,
              color: rgbToHex(
                bestTextOn(primary) === "#FFFFFF"
                  ? { r: 255, g: 255, b: 255 }
                  : { r: 18, g: 18, b: 18 },
              ),
            }}
          >
            Tombol Primer
          </button>
          <button
            type="button"
            className="rounded-lg px-4 py-1.5 text-sm font-semibold"
            style={{
              backgroundColor: aksenHex,
              color: rgbToHex(
                bestTextOn(aksen) === "#FFFFFF"
                  ? { r: 255, g: 255, b: 255 }
                  : { r: 18, g: 18, b: 18 },
              ),
            }}
          >
            Tombol Aksen
          </button>
        </div>

        {/* Contrast info bar */}
        <div
          className="rounded-lg px-3 py-2"
          style={{ backgroundColor: primaryHex }}
        >
          <p className="text-[11px]" style={{ color: teksHex }}>
            Kontras teks pada primary: {contrast.toFixed(2)} ·{" "}
            <span className="font-semibold">{rating}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ClassicView — existing harmony types (now fixed for achromatic)
// ---------------------------------------------------------------------------
function ClassicView({
  primary,
  harmonyType,
  colors,
  onTypeChange,
  onSelect,
  onSave,
}: {
  primary: RGB;
  harmonyType: HarmonyType;
  colors: RGB[];
  onTypeChange: (t: HarmonyType) => void;
  onSelect: (rgb: RGB) => void;
  onSave: (rgb: RGB) => void;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Matching Color — Harmoni Klasik"
          subtitle="Pilih tipe relasi lalu klik warna untuk memakainya"
        />
        <CardBody className="space-y-5">
          {/* Harmony type selector */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {HARMONIES.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => onTypeChange(h.id)}
                className="rounded-lg border px-3 py-2 text-left transition"
                style={{
                  borderColor: harmonyType === h.id ? "rgba(99,102,241,0.5)" : "var(--border)",
                  backgroundColor: harmonyType === h.id ? "rgba(99,102,241,0.15)" : "transparent",
                }}
              >
                <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                  {h.label}
                </div>
                <div className="mt-0.5 text-[10px]" style={{ color: "var(--text-muted)" }}>{h.desc}</div>
              </button>
            ))}
          </div>

          {/* Color swatches */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {colors.map((rgb, i) => (
              <Swatch
                key={`${harmonyType}-${i}`}
                rgb={rgb}
                selected={rgbToHex(rgb) === rgbToHex(primary)}
                onClick={() => onSelect(rgb)}
                onAdd={() => onSave(rgb)}
              />
            ))}
          </div>

          {/* Contrast preview */}
          <ClassicContrastPreview colors={colors} />
        </CardBody>
      </Card>
    </div>
  );
}

function ClassicContrastPreview({ colors }: { colors: RGB[] }) {
  if (colors.length < 2) return null;
  const bg = colors[0];
  const fg = colors[1];
  const ratio = contrastRatio(bg, fg);
  const rating =
    ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA Large" : "Fail";

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: rgbToHex(bg) }}>
      <p className="text-base font-semibold" style={{ color: rgbToHex(fg) }}>
        Contoh teks dengan padanan warna
      </p>
      <p className="mt-1 text-xs" style={{ color: rgbToHex(fg) }}>
        Kontras: {ratio.toFixed(2)} · {rating}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared micro component
// ---------------------------------------------------------------------------
function ViewTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border px-4 py-2 text-sm font-semibold transition"
      style={{
        borderColor: active ? "rgba(99,102,241,0.5)" : "var(--border)",
        backgroundColor: active ? "rgba(99,102,241,0.15)" : "transparent",
        color: active ? "#6366f1" : "var(--text-secondary)",
      }}
    >
      {children}
    </button>
  );
}
