import { useMemo, useState } from "react";
import { rgbToHex, type RGB } from "../../model/color";
import { getColorName } from "../../model/colorNames";
import { useStudio } from "../../../../store/studio";
import { Card, CardBody, CardHeader } from "../../../../shared/ui/Card";
import { CopyButton } from "../../../../shared/ui/CopyButton";
import {
  generateShades,
  sanitizeShadeName,
  shadesToCssVars,
  shadesToTailwind,
  type Shade,
} from "../../model/shades";
import { useToast } from "../../../../shared/ui/toastContext";
import { useLocale } from "../../../../shared/i18n";

export function ShadeModule() {
  const { text } = useLocale();
  const selectedColor = useStudio((s) => s.selectedColor);
  const setSelectedColor = useStudio((s) => s.setSelectedColor);
  const pushColorHistory = useStudio((s) => s.pushColorHistory);
  const saveColor = useStudio((s) => s.saveColor);
  const { show } = useToast();

  const [name, setName] = useState("brand");
  const [format, setFormat] = useState<"vars" | "tailwind">("vars");

  const shades: Shade[] = useMemo(() => generateShades(selectedColor), [selectedColor]);

  const exportText = useMemo(
    () =>
      format === "vars"
        ? shadesToCssVars(name || "brand", shades)
        : shadesToTailwind(name || "brand", shades),
    [format, name, shades],
  );

  const pick = (rgb: RGB) => {
    setSelectedColor(rgb);
    pushColorHistory(rgb);
  };

  const copyHex = async (hex: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(hex);
      show(text(`✓ ${hex} berhasil disalin!`, `✓ ${hex} copied!`));
    } catch {
      // fail silently
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Card>
          <CardHeader
            title={text("Generator Shade", "Shade Generator")}
            subtitle={text(
              "Dari 1 warna, hasilkan skala 50–950 seperti Tailwind",
              "Generate a Tailwind-like 50–950 scale from one color",
            )}
          />
          <CardBody className="space-y-5">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {text(
                "Skala diambil dari warna aktif (hue & saturation dipertahankan, lightness bervariasi). Klik HEX untuk menyalin.",
                "The scale is derived from the active color while preserving hue and saturation. Click a HEX code to copy it.",
              )}
            </p>
            <div className="space-y-1">
              {shades
                .slice()
                .reverse()
                .map((sh) => {
                  const hex = rgbToHex(sh.rgb);
                  const dark = sh.step >= 500;
                  return (
                    <div
                      key={sh.step}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 transition hover:ring-1 hover:ring-white/30"
                      style={{ backgroundColor: hex }}
                    >
                      <button
                        type="button"
                        onClick={() => pick(sh.rgb)}
                        className="flex flex-1 items-center gap-3 text-left"
                        aria-label={`${text("Pilih shade", "Choose shade")} ${sh.step}`}
                      >
                        <span
                          className={
                            "w-12 font-mono text-xs " + (dark ? "text-white" : "text-zinc-900")
                          }
                        >
                          {sh.step}
                        </span>
                        <span
                          className={
                            "ml-auto text-[11px] " + (dark ? "text-white/60" : "text-zinc-900/50")
                          }
                        >
                          {getColorName(sh.rgb).label}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => copyHex(hex, e)}
                        className={
                          "cursor-pointer font-mono text-xs transition hover:underline " +
                          (dark
                            ? "text-white/80 hover:text-white"
                            : "text-zinc-900/70 hover:text-zinc-900")
                        }
                        aria-label={`${text("Salin", "Copy")} ${hex}`}
                        title={text("Klik untuk salin HEX", "Click to copy HEX")}
                      >
                        {hex}
                      </button>
                    </div>
                  );
                })}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader title={text("Ekspor Skala", "Export scale")} />
        <CardBody className="space-y-4">
          <div>
            <label className="mb-1 block text-[11px]" style={{ color: "var(--text-muted)" }}>
              {text("Nama palet", "Palette name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) =>
                // Only alphanumerics, dash & underscore are allowed: the name
                // is embedded into exported CSS variable names.
                setName(sanitizeShadeName(e.target.value))
              }
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: "var(--input-border)",
                backgroundColor: "var(--input-bg)",
                color: "var(--input-text)",
              }}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormat("vars")}
              className={
                "flex-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition " +
                (format === "vars"
                  ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"
                  : "text-zinc-500 dark:text-zinc-400")
              }
            >
              CSS Variables
            </button>
            <button
              type="button"
              onClick={() => setFormat("tailwind")}
              className={
                "flex-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition " +
                (format === "tailwind"
                  ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"
                  : "text-zinc-500 dark:text-zinc-400")
              }
            >
              Tailwind
            </button>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: "var(--chip-bg)" }}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {text("Kode", "Code")}
              </span>
              <CopyButton value={exportText} label={text("Salin", "Copy")} />
            </div>
            <pre
              className="max-h-64 overflow-x-auto whitespace-pre-wrap text-[11px]"
              style={{ color: "var(--text-secondary)" }}
            >
              {exportText}
            </pre>
          </div>
          <button
            type="button"
            onClick={() => shades.forEach((sh) => saveColor(sh.rgb, `${name} ${sh.step}`))}
            className="w-full rounded-lg bg-indigo-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-indigo-400"
          >
            {text("Simpan skala ke palet", "Save scale to palette")}
          </button>
        </CardBody>
      </Card>
    </div>
  );
}
