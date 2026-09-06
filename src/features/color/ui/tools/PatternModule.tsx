import { useMemo, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { LockSimple } from "@phosphor-icons/react/LockSimple";
import { LockSimpleOpen } from "@phosphor-icons/react/LockSimpleOpen";
import { Plus } from "@phosphor-icons/react/Plus";
import { Sparkle } from "@phosphor-icons/react/Sparkle";
import { PALETTES, bestTextOn, hexToRgb, rgbToHex, type RGB } from "../../model/color";
import { getColorName } from "../../model/colorNames";
import { useStudio } from "../../../../store/studio";
import { CopyButton } from "../../../../shared/ui/CopyButton";
import { ColorDetail } from "../Swatch";
import { useLocale } from "../../../../shared/i18n";

const WORKSPACE_PALETTES = [
  { name: "ALUSNA", colors: ["#1E40AF", "#D81B60", "#F2B705", "#F2F4F7", "#111111"] },
  ...PALETTES,
];

export function PatternModule() {
  const { text } = useLocale();
  const setSelectedColor = useStudio((s) => s.setSelectedColor);
  const setSelectedAlpha = useStudio((s) => s.setSelectedAlpha);
  const selectedColor = useStudio((s) => s.selectedColor);
  const selectedAlpha = useStudio((s) => s.selectedAlpha);
  const savedColors = useStudio((s) => s.savedColors);
  const saveColor = useStudio((s) => s.saveColor);
  const pushColorHistory = useStudio((s) => s.pushColorHistory);

  const [activePalette, setActivePalette] = useState(WORKSPACE_PALETTES[0].name);
  const [displayColors, setDisplayColors] = useState<string[]>([...WORKSPACE_PALETTES[0].colors]);
  const [locked, setLocked] = useState<Set<number>>(() => new Set());

  const paletteRgbs = useMemo(
    () => displayColors.map((hex) => hexToRgb(hex)).filter(Boolean) as RGB[],
    [displayColors],
  );

  const applyPalette = (name: string) => {
    const next =
      WORKSPACE_PALETTES.find((palette) => palette.name === name) ?? WORKSPACE_PALETTES[0];
    setActivePalette(next.name);
    setDisplayColors((current) =>
      next.colors.map((color, index) => (locked.has(index) ? current[index] : color)),
    );
  };

  const generatePalette = () => {
    const candidates = WORKSPACE_PALETTES.filter((palette) => palette.name !== activePalette);
    const next = candidates[Math.floor(Math.random() * candidates.length)] ?? WORKSPACE_PALETTES[0];
    applyPalette(next.name);
  };

  const selectColor = (rgb: RGB) => {
    setSelectedColor(rgb);
    setSelectedAlpha(1);
    pushColorHistory(rgb);
  };

  const toggleLock = (index: number) => {
    setLocked((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const exportCss = () =>
    `:root {\n${displayColors.map((color, index) => `  --color-${index + 1}: ${color};`).join("\n")}\n}`;

  const exportJson = () => JSON.stringify({ name: activePalette, colors: displayColors }, null, 2);

  const exportTailwind = () => {
    const values = displayColors
      .map((color, index) => `        "${activePalette.toLowerCase()}-${index + 1}": "${color}",`)
      .join("\n");
    return `// tailwind.config.js\nexport default {\n  theme: {\n    extend: {\n      colors: {\n${values}\n      },\n    },\n  },\n};`;
  };

  const downloadPng = () => {
    const width = 1000;
    const height = 280;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return;
    const swatchWidth = width / displayColors.length;
    displayColors.forEach((hex, index) => {
      context.fillStyle = hex;
      context.fillRect(index * swatchWidth, 0, swatchWidth, height);
      const rgb = hexToRgb(hex);
      context.fillStyle = rgb ? bestTextOn(rgb) : "#111111";
      context.font = "500 18px IBM Plex Mono, monospace";
      context.fillText(hex, index * swatchWidth + 18, height - 24);
    });
    const link = document.createElement("a");
    link.download = `${activePalette}-palette.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <section
      aria-label="Workspace Color Palette Generator"
      className="overflow-hidden rounded-2xl border shadow-[var(--shadow-soft)]"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--card-bg)" }}
    >
      <header
        className="flex flex-wrap items-end justify-between gap-3 border-b px-5 py-4 sm:px-6"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <p
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: "var(--accent)" }}
          >
            {text("Ruang kerja warna", "Color workbench")}
          </p>
          <h2
            className="mt-1 text-lg font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {text("Eksplorasi palet yang siap dirujuk", "Explore a palette you can reference")}
          </h2>
        </div>
        <span className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
          {activePalette} · {displayColors.length} {text("warna", "colors")}
        </span>
      </header>
      <div className="grid lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside
          className="border-b p-5 sm:p-6 lg:border-b-0 lg:border-r"
          style={{ borderColor: "var(--border)" }}
        >
          <p
            className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: "var(--text-muted)" }}
          >
            {text("Metode palet", "Palette method")}
          </p>
          <div
            className="mt-4 max-h-[330px] divide-y overflow-y-auto pr-2"
            style={{ borderColor: "var(--border)" }}
          >
            {WORKSPACE_PALETTES.map((palette) => {
              const active = palette.name === activePalette;
              return (
                <button
                  key={palette.name}
                  type="button"
                  onClick={() => applyPalette(palette.name)}
                  className="flex w-full items-center gap-3 py-3 text-left transition"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border"
                    style={{ borderColor: active ? "var(--accent)" : "var(--border)" }}
                  >
                    <span className="flex -space-x-1">
                      {palette.colors.slice(0, 3).map((color) => (
                        <span
                          key={color}
                          className="h-2.5 w-2.5 rounded-full border border-white/70"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <strong
                      className="block truncate text-xs"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {palette.name}
                    </strong>
                    <span
                      className="mt-0.5 block text-[10px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {palette.colors.length} {text("warna terkurasi", "curated colors")}
                    </span>
                  </span>
                  <span
                    className="h-4 w-4 rounded-full border p-[3px]"
                    style={{ borderColor: active ? "var(--accent)" : "var(--input-border)" }}
                  >
                    {active && (
                      <span
                        className="block h-full w-full rounded-full"
                        style={{ backgroundColor: "var(--accent)" }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 border-t pt-5" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: "var(--text-secondary)" }}>
                {text("Jumlah warna", "Color count")}
              </span>
              <span className="font-mono font-medium" style={{ color: "var(--text-primary)" }}>
                {displayColors.length}
              </span>
            </div>
            <button
              type="button"
              onClick={generatePalette}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-xs font-bold transition"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-contrast)" }}
            >
              <Sparkle size={16} weight="fill" aria-hidden="true" />
              {text("Buat palet", "Generate palette")}
            </button>
            <p
              className="mt-3 text-center text-[10px] leading-4"
              style={{ color: "var(--text-muted)" }}
            >
              {text("Warna yang dikunci tetap dipertahankan.", "Locked colors are preserved.")}
            </p>
          </div>
        </aside>

        <div className="min-w-0 p-4 sm:p-6">
          <div
            className="grid overflow-hidden rounded-lg border sm:grid-cols-5"
            style={{ borderColor: "var(--border)" }}
          >
            {paletteRgbs.map((rgb, index) => {
              const hex = rgbToHex(rgb);
              const info = getColorName(rgb);
              const selected = hex === rgbToHex(selectedColor);
              const textColor = bestTextOn(rgb);
              return (
                <article
                  key={`${hex}-${index}`}
                  className="group min-w-0 border-b last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <button
                    type="button"
                    onClick={() => selectColor(rgb)}
                    className="relative block h-44 w-full text-left transition sm:h-64 lg:h-[330px]"
                    style={{
                      backgroundColor: hex,
                      boxShadow: selected ? "inset 0 0 0 3px var(--accent)" : undefined,
                    }}
                    aria-label={`${text("Pilih", "Choose")} ${info.label} ${hex}`}
                  >
                    <span
                      className="absolute left-4 top-4 font-mono text-[10px] font-semibold"
                      style={{ color: textColor }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="absolute bottom-4 left-4 font-mono text-xs font-semibold"
                      style={{ color: textColor }}
                    >
                      {hex}
                    </span>
                  </button>
                  <div className="p-4">
                    <strong
                      className="block truncate text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {info.name}
                    </strong>
                    <p
                      className="mt-1 truncate font-mono text-[10px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      RGB {rgb.r}, {rgb.g}, {rgb.b}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleLock(index)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border transition"
                        style={{
                          borderColor: locked.has(index) ? "var(--accent)" : "var(--border)",
                          color: locked.has(index) ? "var(--accent)" : "var(--text-secondary)",
                        }}
                        aria-label={
                          locked.has(index)
                            ? `${text("Buka kunci", "Unlock")} ${hex}`
                            : `${text("Kunci", "Lock")} ${hex}`
                        }
                      >
                        {locked.has(index) ? (
                          <LockSimple size={15} weight="fill" />
                        ) : (
                          <LockSimpleOpen size={15} />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => saveColor(rgb, info.label)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border transition"
                        style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                        aria-label={`${text("Simpan", "Save")} ${hex}`}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div
            className="mt-6 grid gap-5 border-t pt-6 xl:grid-cols-[minmax(0,1fr)_340px]"
            style={{ borderColor: "var(--border)" }}
          >
            <section aria-labelledby="saved-colors-title">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h3
                    id="saved-colors-title"
                    className="text-base font-bold tracking-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {text("Warna tersimpan", "Saved colors")}
                  </h3>
                  <p className="mt-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {text(
                      "Klik warna untuk memuatnya ke inspector.",
                      "Choose a color to load it into the inspector.",
                    )}
                  </p>
                </div>
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-semibold"
                  style={{ color: "var(--accent)" }}
                >
                  {savedColors.length} {text("tersimpan", "saved")} <ArrowRight size={13} />
                </span>
              </div>
              <div
                className="mt-4 flex min-h-20 overflow-hidden rounded-md border"
                style={{ borderColor: "var(--border)" }}
              >
                {savedColors.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => selectColor(color.rgb)}
                    className="group relative min-w-16 flex-1"
                    style={{ backgroundColor: rgbToHex(color.rgb) }}
                    aria-label={`${text("Pilih warna tersimpan", "Choose saved color")} ${color.name}`}
                  >
                    <span className="absolute inset-x-0 bottom-0 truncate bg-black/45 px-2 py-1 font-mono text-[9px] text-white opacity-0 transition group-hover:opacity-100 group-focus:opacity-100">
                      {rgbToHex(color.rgb)}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <CopyButton value={exportCss()} label="CSS" className="border px-3 py-2" />
                <CopyButton value={exportJson()} label="JSON" className="border px-3 py-2" />
                <CopyButton
                  value={exportTailwind()}
                  label="Tailwind"
                  className="border px-3 py-2"
                />
                <button
                  type="button"
                  onClick={downloadPng}
                  className="rounded-md border px-3 py-2 text-xs font-semibold transition"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                >
                  PNG
                </button>
              </div>
            </section>

            <section
              aria-labelledby="active-color-title"
              className="border-t pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0"
              style={{ borderColor: "var(--border)" }}
            >
              <h3
                id="active-color-title"
                className="text-base font-bold tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {text("Inspector warna aktif", "Active color inspector")}
              </h3>
              <div className="mt-4">
                <ColorDetail rgb={selectedColor} alpha={selectedAlpha} showAlpha />
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
