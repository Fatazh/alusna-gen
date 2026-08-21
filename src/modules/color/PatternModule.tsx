import { useState } from "react";
import { PALETTES, hexToRgb, rgbToHex, type RGB } from "../../lib/color";
import { getColorName } from "../../lib/colorNames";
import { useStudio } from "../../store/studio";
import { Card, CardBody, CardHeader } from "../../shared/ui/Card";
import { Swatch, ColorDetail } from "../../components/Swatch";
import { CopyButton } from "../../shared/ui/CopyButton";

export function PatternModule() {
  const setSelectedColor = useStudio((s) => s.setSelectedColor);
  const setSelectedAlpha = useStudio((s) => s.setSelectedAlpha);
  const selectedColor = useStudio((s) => s.selectedColor);
  const selectedAlpha = useStudio((s) => s.selectedAlpha);
  const saveColor = useStudio((s) => s.saveColor);
  const pushColorHistory = useStudio((s) => s.pushColorHistory);

  const [activePalette, setActivePalette] = useState(PALETTES[0].name);
  const palette = PALETTES.find((p) => p.name === activePalette)!;
  const paletteRgbs: RGB[] = palette.colors.map((h) => hexToRgb(h)).filter(Boolean) as RGB[];

  const exportCss = () => {
    const css = `:root {\n${palette.colors
      .map((c, i) => `  --color-${i + 1}: ${c};`)
      .join("\n")}\n}`;
    return css;
  };

  const exportJson = () => JSON.stringify({ name: palette.name, colors: palette.colors }, null, 2);

  const exportTailwind = () => {
    const obj = palette.colors
      .map((c, i) => `        "${palette.name.toLowerCase()}-${i + 1}": "${c}",`)
      .join("\n");
    return `// tailwind.config.js\nexport default {\n  theme: {\n    extend: {\n      colors: {\n${obj}\n      },\n    },\n  },\n};`;
  };

  const downloadPng = () => {
    const w = 500;
    const h = 120;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const sw = w / palette.colors.length;
    palette.colors.forEach((hex, i) => {
      ctx.fillStyle = hex;
      ctx.fillRect(i * sw, 0, sw, h);
      ctx.fillStyle = "#000";
      ctx.font = "12px sans-serif";
      ctx.fillText(hex, i * sw + 6, h - 8);
    });
    const link = document.createElement("a");
    link.download = `${palette.name}-palette.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const chipClass = "rounded-full border px-3 py-1.5 text-xs font-medium transition";
  const getChipStyle = (active: boolean): React.CSSProperties =>
    active
      ? {
          borderColor: "rgba(99,102,241,0.5)",
          backgroundColor: "rgba(99,102,241,0.15)",
          color: "#6366f1",
        }
      : { borderColor: "var(--border)", color: "var(--text-secondary)" };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Card>
          <CardHeader
            title="Color Pattern"
            subtitle="Pilih palet kurasi sebagai inspirasi desain"
          />
          <CardBody className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {PALETTES.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setActivePalette(p.name)}
                  className={chipClass}
                  style={getChipStyle(activePalette === p.name)}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {paletteRgbs.map((rgb, i) => {
                const colorInfo = getColorName(rgb);
                return (
                  <div key={rgbToHex(rgb)} className="space-y-1">
                    <Swatch
                      rgb={rgb}
                      size="lg"
                      label={`${palette.name} ${i + 1}`}
                      selected={rgbToHex(rgb) === rgbToHex(selectedColor)}
                      onClick={() => {
                        setSelectedColor(rgb);
                        setSelectedAlpha(1);
                        pushColorHistory(rgb);
                      }}
                      onAdd={() => saveColor(rgb, colorInfo.label)}
                    />
                    <p
                      className="truncate text-center text-[10px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {colorInfo.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3"
              style={{ backgroundColor: "var(--chip-bg)" }}
            >
              <div>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Ekspor CSS variables
                </p>
                <code
                  className="mt-1 block max-w-full overflow-x-auto text-[11px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {palette.colors.join(" · ")}
                </code>
              </div>
              <CopyButton value={exportCss()} label="Salin CSS" />
              <CopyButton value={exportJson()} label="Salin JSON" />
              <CopyButton value={exportTailwind()} label="Salin Tailwind" />
              <button
                type="button"
                onClick={downloadPng}
                className="rounded-md px-2 py-1 text-xs font-medium transition"
                style={{ backgroundColor: "var(--chip-bg)", color: "var(--text-secondary)" }}
              >
                PNG
              </button>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader title="Detail Warna Aktif" subtitle="Kode warna yang sedang dipilih" />
        <CardBody className="space-y-4">
          <Swatch rgb={selectedColor} size="lg" showCode={false} />
          <ColorDetail rgb={selectedColor} alpha={selectedAlpha} showAlpha />
          <button
            type="button"
            onClick={() => saveColor(selectedColor)}
            className="w-full rounded-lg bg-indigo-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-indigo-400"
          >
            Simpan ke palet
          </button>
        </CardBody>
      </Card>
    </div>
  );
}
