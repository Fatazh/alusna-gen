import { useMemo, useRef, useState } from "react";
import { Warning } from "@phosphor-icons/react/Warning";
import { ArrowClockwise } from "@phosphor-icons/react/ArrowClockwise";
import { ArrowCounterClockwise } from "@phosphor-icons/react/ArrowCounterClockwise";
import { mixColors, rgbToHex, hexToRgb, type MixMode, type RGB } from "../../model/color";
import { getColorName } from "../../model/colorNames";
import { useStudio } from "../../../../store/studio";
import { Card, CardBody, CardHeader } from "../../../../shared/ui/Card";
import { Swatch, ColorDetail } from "../Swatch";
import { CopyButton } from "../../../../shared/ui/CopyButton";

type Slot = { id: number; hex: string; weight: number };

const MODES: { id: MixMode; label: string; desc: string }[] = [
  { id: "average", label: "Average", desc: "Rata-rata sederhana" },
  { id: "weighted", label: "Weighted", desc: "Berbobot sesuai weight" },
  { id: "additive", label: "Additive", desc: "Cahaya (RGB +)" },
  { id: "subtractive", label: "Subtractive", desc: "Tinta/Cat (CMYK)" },
];

export function ExperimentModule() {
  const setSelectedColor = useStudio((s) => s.setSelectedColor);
  const pushColorHistory = useStudio((s) => s.pushColorHistory);
  const selectedAlpha = useStudio((s) => s.selectedAlpha);
  const saveColor = useStudio((s) => s.saveColor);

  // Monotonically increasing ID counter — safe against rapid clicks.
  const nextId = useRef(3);

  const [slots, setSlots] = useState<Slot[]>([
    { id: 1, hex: "#FF6B6B", weight: 1 },
    { id: 2, hex: "#4ECDC4", weight: 1 },
  ]);
  const [mode, setMode] = useState<MixMode>("average");
  const [past, setPast] = useState<Slot[][]>([]);
  const [future, setFuture] = useState<Slot[][]>([]);

  const pushHistory = (next: Slot[]) => {
    setPast((p) => [...p, slots].slice(-50));
    setFuture([]);
    setSlots(next);
  };
  const undo = () => {
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    setFuture((f) => [slots, ...f]);
    setSlots(prev);
    setPast(past.slice(0, -1));
  };
  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setPast((p) => [...p, slots]);
    setSlots(next);
    setFuture(future.slice(1));
  };

  const result = useMemo(() => {
    const inputs = slots
      .map((s) => {
        const rgb = hexToRgb(s.hex);
        return rgb ? { color: rgb, weight: s.weight } : null;
      })
      .filter(Boolean) as { color: RGB; weight: number }[];
    return mixColors(inputs, mode);
  }, [slots, mode]);

  const updateSlot = (id: number, partial: Partial<Slot>) => {
    pushHistory(slots.map((s) => (s.id === id ? { ...s, ...partial } : s)));
  };
  const addSlot = () => {
    if (slots.length >= 6) return;
    const id = nextId.current++;
    pushHistory([...slots, { id, hex: "#FFFFFF", weight: 1 }]);
  };
  const removeSlot = (id: number) => {
    if (slots.length <= 1) return;
    pushHistory(slots.filter((s) => s.id !== id));
  };

  const hasCustomWeights = slots.some((s) => s.weight !== 1);

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
            title="Experiment Color"
            subtitle="Campurkan 2 atau lebih warna dan lihat hasilnya"
          />
          <CardBody className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={chipClass}
                  style={getChipStyle(mode === m.id)}
                  title={m.desc}
                >
                  {m.label}
                </button>
              ))}
              <div className="ml-auto flex gap-1.5">
                <button
                  type="button"
                  onClick={undo}
                  disabled={past.length === 0}
                  className="rounded-md border px-2.5 py-1 text-[11px] font-medium transition disabled:opacity-30"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                  title="Urungkan (undo)"
                >
                  <ArrowCounterClockwise size={13} className="mr-1 inline" aria-hidden="true" />
                  Undo
                </button>
                <button
                  type="button"
                  onClick={redo}
                  disabled={future.length === 0}
                  className="rounded-md border px-2.5 py-1 text-[11px] font-medium transition disabled:opacity-30"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                  title="Ulangi (redo)"
                >
                  <ArrowClockwise size={13} className="mr-1 inline" aria-hidden="true" />
                  Redo
                </button>
              </div>
            </div>

            {/* Warning: Average ignores weights */}
            {mode === "average" && hasCustomWeights && (
              <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 px-3 py-2.5">
                <Warning
                  size={16}
                  className="mt-0.5 shrink-0 text-amber-500 dark:text-amber-400"
                  aria-hidden="true"
                />
                <p className="text-[11px] text-amber-700 dark:text-amber-300/90">
                  Mode <span className="font-semibold">Average</span> menggunakan rata-rata sama
                  rata — bobot yang kamu atur diabaikan. Gunakan mode{" "}
                  <span className="font-semibold">Weighted</span> agar bobot berpengaruh.
                </p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="rounded-xl border p-3"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--chip-bg)" }}
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="color"
                      value={slot.hex}
                      onChange={(e) => updateSlot(slot.id, { hex: e.target.value })}
                      className="h-10 w-12 rounded-lg"
                    />
                    {slots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSlot(slot.id)}
                        className="text-xs hover:text-rose-400"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={slot.hex}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^#?[0-9a-fA-F]{0,6}$/.test(v)) {
                        updateSlot(slot.id, {
                          hex: v.startsWith("#") ? v : `#${v}`,
                        });
                      }
                    }}
                    className="mt-2 w-full rounded-md px-2 py-1 text-xs outline-none"
                    style={{ backgroundColor: "var(--input-bg)", color: "var(--input-text)" }}
                  />
                  <div className="mt-3">
                    <div
                      className="mb-1 flex items-center justify-between text-[10px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <span>Bobot</span>
                      <span className="font-mono">{slot.weight}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={5}
                      step={0.1}
                      value={slot.weight}
                      onChange={(e) => updateSlot(slot.id, { weight: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              ))}

              {slots.length < 6 && (
                <button
                  type="button"
                  onClick={addSlot}
                  className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed text-sm transition"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                >
                  + Tambah warna
                </button>
              )}
            </div>

            <div
              className="rounded-xl border p-5"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--chip-bg)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Hasil perpaduan
                  </p>
                  <p
                    className="mt-0.5 text-base font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {getColorName(result).label}
                  </p>
                  <p className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                    {rgbToHex(result)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <CopyButton value={rgbToHex(result)} label="Salin HEX" />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedColor(result);
                      pushColorHistory(result);
                    }}
                    className="rounded-md px-3 py-1 text-xs font-medium transition"
                    style={{
                      backgroundColor: "var(--chip-active-bg)",
                      color: "var(--text-primary)",
                    }}
                  >
                    Jadikan aktif
                  </button>
                </div>
              </div>
              <div className="mt-4 h-28 rounded-xl" style={{ backgroundColor: rgbToHex(result) }} />
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader title="Detail Hasil" />
        <CardBody className="space-y-4">
          <Swatch rgb={result} size="lg" showCode={false} />
          <ColorDetail rgb={result} alpha={selectedAlpha} showAlpha />
          <button
            type="button"
            onClick={() => saveColor(result, getColorName(result).label)}
            className="w-full rounded-lg bg-indigo-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-indigo-400"
          >
            Simpan ke palet
          </button>
        </CardBody>
      </Card>
    </div>
  );
}
