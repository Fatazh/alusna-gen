import { useMemo, useRef } from "react";
import { ArrowClockwise } from "@phosphor-icons/react/ArrowClockwise";
import { ArrowCounterClockwise } from "@phosphor-icons/react/ArrowCounterClockwise";
import { hexToRgb } from "@alusna/shared/color";
import { getColorName } from "@alusna/shared/colorNames";
import { useStudio } from "../../../../store/studio";
import { Card, CardBody, CardHeader } from "../../../../shared/ui/Card";
import { CopyButton } from "../../../../shared/ui/CopyButton";
import { useLocale } from "../../../../shared/i18n";
import { useHistoryState } from "../../../../shared/lib/useHistoryState";
import { useUndoRedoShortcuts } from "../../../../shared/lib/useUndoRedoShortcuts";

type Stop = { id: number; hex: string; pos: number };
type GradientType = "linear" | "radial" | "conic";
type GradientSnapshot = { stops: Stop[]; type: GradientType; angle: number };

const TYPES: { id: GradientType; label: string }[] = [
  { id: "linear", label: "Linear" },
  { id: "radial", label: "Radial" },
  { id: "conic", label: "Conic" },
];

export function GradientModule() {
  const { text } = useLocale();
  const setSelectedColor = useStudio((s) => s.setSelectedColor);
  const pushColorHistory = useStudio((s) => s.pushColorHistory);
  const saveColor = useStudio((s) => s.saveColor);

  const nextId = useRef(2);
  const gradientHistory = useHistoryState<GradientSnapshot>(() => ({
    stops: [
      { id: 0, hex: "#6366F1", pos: 0 },
      { id: 1, hex: "#EC4899", pos: 100 },
    ],
    type: "linear",
    angle: 90,
  }));
  const snapshot = gradientHistory.value;
  const { stops, type, angle } = snapshot;

  useUndoRedoShortcuts({
    undo: gradientHistory.undo,
    redo: gradientHistory.redo,
    canUndo: gradientHistory.canUndo,
    canRedo: gradientHistory.canRedo,
    enabled: true,
  });

  const pushSnapshot = (partial: Partial<GradientSnapshot>) =>
    gradientHistory.push({ ...snapshot, ...partial });
  const setStops = (next: Stop[]) => pushSnapshot({ stops: next });
  const setType = (next: GradientType) => pushSnapshot({ type: next });

  // Slider drags fire change per pixel; coalesce each gesture into ONE undo
  // entry: push the pre-drag state once on pointer down, then replace present.
  const coalescing = useRef(false);
  const beginCoalesce = () => {
    coalescing.current = true;
    gradientHistory.push(snapshot);
  };
  const endCoalesce = () => {
    coalescing.current = false;
  };
  const moveCoalesced = (partial: Partial<GradientSnapshot>) => {
    if (coalescing.current) gradientHistory.replacePresent({ ...snapshot, ...partial });
    else pushSnapshot(partial);
  };

  const sortedStops = useMemo(() => [...stops].sort((a, b) => a.pos - b.pos), [stops]);

  const css = useMemo(() => {
    const list = sortedStops.map((s) => `${s.hex} ${s.pos}%`).join(", ");
    if (type === "linear") return `linear-gradient(${angle}deg, ${list})`;
    if (type === "radial") return `radial-gradient(circle, ${list})`;
    return `conic-gradient(from ${angle}deg, ${list})`;
  }, [sortedStops, type, angle]);

  const updateStop = (id: number, partial: Partial<Stop>) =>
    setStops(stops.map((s) => (s.id === id ? { ...s, ...partial } : s)));
  const addStop = () => {
    if (stops.length >= 8) return;
    const id = nextId.current++;
    const last = sortedStops[sortedStops.length - 1];
    setStops([...stops, { id, hex: "#FFFFFF", pos: last.pos }]);
  };
  const removeStop = (id: number) => {
    if (stops.length > 2) setStops(stops.filter((s) => s.id !== id));
  };

  const chipClass = "rounded-full border px-3 py-1.5 text-xs font-medium transition";
  const getChipStyle = (active: boolean): React.CSSProperties =>
    active
      ? {
          borderColor: "var(--accent)",
          backgroundColor: "var(--accent-soft)",
          color: "var(--accent)",
        }
      : { borderColor: "var(--border)", color: "var(--text-secondary)" };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Card>
          <CardHeader
            title={text("Generator Gradien", "Gradient Generator")}
            subtitle={text(
              "Susun stop warna lalu salin CSS-nya",
              "Arrange color stops and copy the CSS",
            )}
          />
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
              <div className="ml-auto flex gap-1.5">
                <button
                  type="button"
                  onClick={gradientHistory.undo}
                  disabled={!gradientHistory.canUndo}
                  className="rounded-md border px-2.5 py-1 text-[11px] font-medium transition disabled:opacity-30"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                  title={text("Urungkan (Ctrl+Z)", "Undo (Ctrl+Z)")}
                >
                  <ArrowCounterClockwise size={13} className="mr-1 inline" aria-hidden="true" />
                  Undo
                </button>
                <button
                  type="button"
                  onClick={gradientHistory.redo}
                  disabled={!gradientHistory.canRedo}
                  className="rounded-md border px-2.5 py-1 text-[11px] font-medium transition disabled:opacity-30"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                  title={text("Ulangi (Ctrl+Y)", "Redo (Ctrl+Y)")}
                >
                  <ArrowClockwise size={13} className="mr-1 inline" aria-hidden="true" />
                  Redo
                </button>
              </div>
              {type !== "radial" && (
                <div
                  className="flex items-center gap-2 rounded-full border px-3 py-1"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {text("Sudut", "Angle")}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={angle}
                    onPointerDown={beginCoalesce}
                    onPointerUp={endCoalesce}
                    onChange={(e) => moveCoalesced({ angle: Number(e.target.value) })}
                    className="w-24"
                    aria-label={text("Sudut gradien", "Gradient angle")}
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
              {stops.map((s, stopIndex) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 rounded-xl border p-3"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--chip-bg)" }}
                >
                  <input
                    type="color"
                    aria-label={`${text("Warna stop", "Stop color")} ${stopIndex + 1}`}
                    value={s.hex}
                    onChange={(e) => updateStop(s.id, { hex: e.target.value })}
                    className="h-10 w-12 rounded-lg"
                  />
                  <input
                    type="text"
                    aria-label={`${text("Kode HEX stop", "Stop HEX code")} ${stopIndex + 1}`}
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
                      onPointerDown={beginCoalesce}
                      onPointerUp={endCoalesce}
                      onChange={(e) =>
                        moveCoalesced({
                          stops: stops.map((stop) =>
                            stop.id === s.id ? { ...stop, pos: Number(e.target.value) } : stop,
                          ),
                        })
                      }
                      className="w-full"
                      aria-label={`${text("Posisi stop", "Stop position")} ${s.hex}`}
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
                      {text("Hapus", "Remove")}
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
                  + {text("Tambah stop", "Add stop")}
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
                <CopyButton value={css} label={text("Salin CSS", "Copy CSS")} />
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
        <CardHeader title={text("Stop Warna", "Color stops")} />
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
            className="w-full rounded-lg px-3 py-2 text-xs font-medium transition hover:brightness-110"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-contrast)" }}
          >
            {text("Simpan semua ke palet", "Save all to palette")}
          </button>
        </CardBody>
      </Card>
    </div>
  );
}
