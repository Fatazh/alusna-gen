import { useMemo, useState } from "react";
import { rgbToHex, contrastRatio, type RGB } from "../../model/color";
import {
  simulateColorBlindness,
  COLOR_BLIND_TYPES,
  type ColorBlindType,
} from "../../model/colorBlind";
import { getColorName } from "../../model/colorNames";
import { useStudio } from "../../../../store/studio";
import { Card, CardBody, CardHeader } from "../../../../shared/ui/Card";
import { useLocale } from "../../../../shared/i18n";
import { Swatch } from "../Swatch";

export function AccessibilityModule() {
  const { text } = useLocale();
  const selectedColor = useStudio((s) => s.selectedColor);
  const savedColors = useStudio((s) => s.savedColors);

  const [type, setType] = useState<ColorBlindType>("deuteranopia");

  const paletteRgbs: RGB[] = useMemo(
    () => [selectedColor, ...savedColors.map((c) => c.rgb)],
    [selectedColor, savedColors],
  );

  const sim = (rgb: RGB) => simulateColorBlindness(rgb, type);

  const rating = (ratio: number) =>
    ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA Large" : "Fail";

  // How distinguishable are the palette colors under the deficiency?
  const worstContrast = useMemo(() => {
    let worst = Infinity;
    for (let i = 0; i < paletteRgbs.length; i++) {
      for (let j = i + 1; j < paletteRgbs.length; j++) {
        const ratio = contrastRatio(
          simulateColorBlindness(paletteRgbs[i], type),
          simulateColorBlindness(paletteRgbs[j], type),
        );
        if (ratio < worst) worst = ratio;
      }
    }
    return Number.isFinite(worst) ? worst : 21;
  }, [paletteRgbs, type]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Card>
          <CardHeader
            title={text("Simulasi Buta Warna", "Color Blindness Simulator")}
            subtitle={text(
              "Lihat palet seperti yang dilihat berbagai tipe penglihatan",
              "Preview your palette across several color-vision conditions",
            )}
          />
          <CardBody className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {COLOR_BLIND_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition " +
                    (type === t.id
                      ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"
                      : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200")
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Original vs simulated */}
            <div className="grid grid-cols-2 gap-3">
              <p
                className="col-span-full text-[11px] font-medium uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Asli
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {paletteRgbs.map((rgb, i) => (
                  <Swatch key={`orig-${rgbToHex(rgb)}-${i}`} rgb={rgb} size="sm" showCode={false} />
                ))}
              </div>
              <p
                className="col-span-full mt-2 text-[11px] font-medium uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                {COLOR_BLIND_TYPES.find((t) => t.id === type)?.label}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {paletteRgbs.map((rgb, i) => (
                  <Swatch
                    key={`sim-${rgbToHex(rgb)}-${i}`}
                    rgb={sim(rgb)}
                    size="sm"
                    showCode={false}
                  />
                ))}
              </div>
            </div>

            {/* Mock UI under simulation */}
            <div>
              <p
                className="mb-2 text-[11px] font-medium uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Preview UI
              </p>
              <div
                className="rounded-2xl border p-5"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: rgbToHex(sim(selectedColor)),
                }}
              >
                <p
                  className="text-xl font-bold"
                  style={{ color: rgbToHex(sim({ r: 255, g: 255, b: 255 })) }}
                >
                  {getColorName(selectedColor).label}
                </p>
                <p
                  className="mt-1 text-sm"
                  style={{ color: rgbToHex(sim({ r: 240, g: 240, b: 240 })) }}
                >
                  {text(
                    "Contoh teks pada latar warna terpilih.",
                    "Sample text on the selected color background.",
                  )}
                </p>
                <div
                  className="mt-4 rounded-lg px-4 py-1.5 text-sm font-semibold"
                  style={{
                    backgroundColor: rgbToHex(sim({ r: 255, g: 255, b: 255 })),
                    color: rgbToHex(sim(selectedColor)),
                  }}
                >
                  Tombol
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader title={text("Keterbacaan", "Distinguishability")} />
        <CardBody className="space-y-3">
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {text(
              "Kontras terendah antar-warna palet di bawah simulasi:",
              "Lowest contrast between palette colors under this simulation:",
            )}
          </p>
          <div
            className="flex items-center justify-between rounded-lg px-3 py-2"
            style={{ backgroundColor: "var(--chip-bg)" }}
          >
            <span
              className="font-mono text-sm"
              style={{ color: worstContrast >= 3 ? "#34D399" : "#FB7185" }}
            >
              {worstContrast.toFixed(2)}
            </span>
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {rating(worstContrast)}
            </span>
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {text(
              "Semakin rendah, semakin sulit membedakan warna bagi tipe penglihatan tersebut.",
              "Lower values indicate that the colors are harder to distinguish for this vision type.",
            )}
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
