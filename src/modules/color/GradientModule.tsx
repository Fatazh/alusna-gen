import { useMemo, useRef, useState } from "react";
import { hexToRgb } from "../../lib/color";
import { getColorName } from "../../lib/colorNames";
import { useStudio } from "../../store/studio";
import { Card, CardBody, CardHeader } from "../../shared/ui/Card";
import { CopyButton } from "../../shared/ui/CopyButton";

type Stop = { id: number; hex: string; pos: number };
type GradientType = "linear" | "radial" | "conic";

const TYPES: { id: GradientType; label: string }[] = [
  { id: "linear", label: "Linear" },
  { id: "radial", label: "Radial" },
  { id: "conic", label: "Conic" },
];

export function GradientModule() {
  const setSelectedColor = useStudio((s) => s.setSelectedColor);
  const pushColorHistory = useStudio((s) => s.pushColorHistory);
  const saveColor = useStudio((s) => s.saveColor);

  const nextId = useRef(2);
  const [stops, setStops] = useState<Stop[]>([
    { id: 0, hex: "#6366F1", pos: 0 },
    { id: 1, hex: "#EC4899", pos: 100 },
  ]);
  const [type, setType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(90);

  const sortedStops = useMemo(() => [...stops].sort((a, b) => a.pos - b.pos), [stops]);

  const css = useMemo(() => {
    const list = sortedStops.map((s) => `${s.hex} ${s.pos}%`).join(", ");
    if (type === "linear") return `linear-gradient(${angle}deg, ${list})`;
    if (type === "radial") return `radial-gradient(circle, ${list})`;
    return `conic-gradient(from ${angle}deg, ${list})`;
  }, [sortedStops, type, angle]);

  const updateStop = (id: number, partial: Partial<Stop>) =>
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, ...partial } : s)));
  const addStop = () => {
    if (stops.length >= 8) return;
    const id = nextId.current++;
    const last = sortedStops[sortedStops.length - 1];
    setStops((prev) => [...prev, { id, hex: "#FFFFFF", pos: last.pos }]);
  };
  const removeStop = (id: number) =>
    setStops((prev) => (prev.length > 2 ? prev.filter((s) => s.id !== id) : prev));

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
          <CardHeader title="Generator Gradien" subtitle="Susun stop warna lalu salin CSS-nya" />
          <CardBody className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={chipClass}
                  style={getChipStyle(type === t.id)}
                >
                  {t.label}
                </button>
              ))}
              {type !== "radial" && (
                <div
                  className="flex items-center gap-2 rounded-full border px-3 py-1"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    Sudut
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-24"
                  />
                  <span
                    className="font-mono text-[11px]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {angle}°
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {stops.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 rounded-xl border p-3"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--chip-bg)" }}
                >
                  <input
                    type="color"
                    value={s.hex}
                    onChange={(e) => updateStop(s.id, { hex: e.target.value })}
                    className="h-10 w-12 rounded-lg"
                  />
                  <input
                    type="text"
                    value={s.hex}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^#?[0-9a-fA-F]{0,6}$/.test(v))
                        updateStop(s.id, {
                          hex: v.startsWith("#") ? v : `#${v}`,
                        });
                    }}
                    className="w-28 rounded-md px-2 py-1 text-xs outline-none"
                    style={{ backgroundColor: "var(--input-bg)", color: "var(--input-text)" }}
                  />
                  <div className="flex flex-1 items-center gap-2">
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      pos
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={s.pos}
                      onChange={(e) => updateStop(s.id, { pos: Number(e.target.value) })}
                      className="w-full"
                    />
                    <span
                      className="w-10 text-right font-mono text-[11px]"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {s.pos}%
                    </span>
                  </div>
                  {stops.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeStop(s.id)}
                      className="text-xs hover:text-rose-400"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Hapus
                    </button>
                  )}
                </div>
              ))}
              {stops.length < 8 && (
                <button
                  type="button"
                  onClick={addStop}
                  className="flex w-full items-center justify-center rounded-xl border border-dashed py-2.5 text-sm transition"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                >
                  + Tambah stop
                </button>
              )}
            </div>

            {/* Live preview */}
            <div
              className="h-36 rounded-2xl border"
              style={{ borderColor: "var(--border)", backgroundImage: css }}
            />

            <div className="rounded-xl p-4" style={{ backgroundColor: "var(--chip-bg)" }}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  CSS
                </span>
                <CopyButton value={css} label="Salin CSS" />
              </div>
              <pre
                className="overflow-x-auto whitespace-pre-wrap text-[11px]"
                style={{ color: "var(--text-secondary)" }}
              >
                {css}
              </pre>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader title="Stop Warna" />
        <CardBody className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {sortedStops.map((s) => {
              const rgb = hexToRgb(s.hex);
              if (!rgb) return null;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedColor(rgb);
                    pushColorHistory(rgb);
                  }}
                  className="flex items-center gap-2 rounded-lg border p-2 text-left transition"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span
                    className="h-8 w-8 shrink-0 rounded-md"
                    style={{ backgroundColor: s.hex }}
                  />
                  <span className="min-w-0">
                    <span
                      className="block truncate text-xs"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {getColorName(rgb).label}
                    </span>
                    <span
                      className="block font-mono text-[10px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {s.hex}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              for (const s of sortedStops) {
                const rgb = hexToRgb(s.hex);
                if (rgb) saveColor(rgb, getColorName(rgb).label);
              }
            }}
            className="w-full rounded-lg bg-indigo-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-indigo-400"
          >
            Simpan semua ke palet
          </button>
        </CardBody>
      </Card>
    </div>
  );
}
