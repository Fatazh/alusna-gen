import { useState, useMemo } from "react";
import { useStudio } from "../../store/studio";
import { rgbToHex } from "../../lib/color";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { CopyButton } from "../../components/CopyButton";
import {
  generateDesignSystem,
  exportDesignSystem,
  sanitizeTokenName,
  type DesignSystem,
  type ExportFormat,
} from "../../lib/designSystem";

const EXPORT_FORMATS: { id: ExportFormat; label: string; icon: string }[] = [
  { id: "css", label: "CSS Variables", icon: "🎨" },
  { id: "tailwind", label: "Tailwind Config", icon: "🌊" },
  { id: "json", label: "Design Tokens (JSON)", icon: "📦" },
  { id: "react-native", label: "React Native Theme", icon: "📱" },
  { id: "scss", label: "SCSS Variables", icon: "💎" },
];

export function DesignSystemModule() {
  const selectedColor = useStudio((s) => s.selectedColor);
  const [dsName, setDsName] = useState("brand");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("css");
  const [expandedSection, setExpandedSection] = useState<string | null>("colors");

  const ds: DesignSystem = useMemo(
    () => generateDesignSystem(selectedColor, dsName),
    [selectedColor, dsName],
  );

  const exportedCode = useMemo(() => exportDesignSystem(ds, exportFormat), [ds, exportFormat]);

  const toggleSection = (s: string) => setExpandedSection((prev) => (prev === s ? null : s));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card>
        <CardHeader
          title="Design System Generator"
          subtitle="Generate a complete design system from your base color"
          action={
            <div className="flex items-center gap-2">
              <label className="text-xs" style={{ color: "var(--text-muted)" }}>
                Prefix:
              </label>
              <input
                type="text"
                value={dsName}
                onChange={(e) => setDsName(sanitizeTokenName(e.target.value) || "brand")}
                className="w-28 rounded-lg border px-2.5 py-1.5 text-xs outline-none"
                style={{
                  borderColor: "var(--input-border)",
                  backgroundColor: "var(--input-bg)",
                  color: "var(--input-text)",
                }}
                placeholder="brand"
              />
            </div>
          }
        />
        <CardBody>
          {/* Live Preview Strip */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
              style={{ backgroundColor: rgbToHex(selectedColor) }}
            >
              {dsName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {ds.name} — Design System
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {ds.colors.length} colors · {ds.shades.length} shades · {ds.typography.length} type
                styles · {ds.spacing.length} spacing · {ds.radius.length} radii ·{" "}
                {ds.shadows.length} shadows
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left: Preview panels */}
        <div className="space-y-4 xl:col-span-2">
          {/* Colors */}
          <CollapsibleSection
            title="🎨 Color Roles"
            subtitle={`${ds.colors.length} semantic colors`}
            isOpen={expandedSection === "colors"}
            onToggle={() => toggleSection("colors")}
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {ds.colors.map((c) => (
                <div
                  key={c.role}
                  className="group rounded-xl border overflow-hidden transition"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="h-16 w-full" style={{ backgroundColor: c.hex }} />
                  <div className="px-3 py-2">
                    <div
                      className="text-[11px] font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {c.role}
                    </div>
                    <div className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {c.hex}
                    </div>
                    <div
                      className="mt-1 text-[10px] leading-tight opacity-0 group-hover:opacity-100 transition"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {c.usage}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Shade Scale */}
          <CollapsibleSection
            title="🌈 Shade Scale"
            subtitle={`${ds.shades.length} steps (50–950)`}
            isOpen={expandedSection === "shades"}
            onToggle={() => toggleSection("shades")}
          >
            <div className="flex gap-1 rounded-xl overflow-hidden">
              {ds.shades.map((s) => {
                const hex = rgbToHex(s.rgb);
                return (
                  <div key={s.step} className="group relative flex-1">
                    <div
                      className="h-20 w-full transition-transform group-hover:scale-110 group-hover:z-10"
                      style={{ backgroundColor: hex }}
                    />
                    <div className="mt-1 text-center">
                      <div
                        className="text-[10px] font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {s.step}
                      </div>
                      <div className="text-[9px] font-mono" style={{ color: "var(--text-muted)" }}>
                        {hex}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CollapsibleSection>

          {/* Typography */}
          <CollapsibleSection
            title="📝 Typography Scale"
            subtitle={`${ds.typography.length} type styles`}
            isOpen={expandedSection === "typography"}
            onToggle={() => toggleSection("typography")}
          >
            <div className="space-y-2">
              {ds.typography.map((t) => (
                <div
                  key={t.name}
                  className="flex items-baseline gap-4 rounded-lg border px-4 py-3 transition"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="w-24 shrink-0">
                    <div
                      className="text-[11px] font-semibold"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {t.name}
                    </div>
                    <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {t.size} / {t.lineHeight}
                    </div>
                  </div>
                  <div
                    className="flex-1 truncate"
                    style={{
                      fontSize: `min(${t.size}, 2.5rem)`,
                      lineHeight: t.lineHeight,
                      fontWeight: t.fontWeight,
                      color: "var(--text-primary)",
                    }}
                  >
                    The quick brown fox
                  </div>
                  <div
                    className="text-[10px] hidden sm:block"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t.usage}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Spacing */}
          <CollapsibleSection
            title="📏 Spacing Scale"
            subtitle={`${ds.spacing.length} spacing tokens`}
            isOpen={expandedSection === "spacing"}
            onToggle={() => toggleSection("spacing")}
          >
            <div className="flex items-end gap-2 flex-wrap">
              {ds.spacing.map((s) => (
                <div key={s.name} className="group flex flex-col items-center">
                  <div
                    className="rounded bg-indigo-500/60 transition group-hover:bg-indigo-400"
                    style={{ width: Math.max(s.px, 4), height: Math.max(s.px, 4) }}
                  />
                  <div className="mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {s.name}
                  </div>
                  <div className="text-[9px] font-mono" style={{ color: "var(--text-muted)" }}>
                    {s.px}px
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Radius */}
          <CollapsibleSection
            title="⭕ Border Radius"
            subtitle={`${ds.radius.length} radius tokens`}
            isOpen={expandedSection === "radius"}
            onToggle={() => toggleSection("radius")}
          >
            <div className="flex items-end gap-3 flex-wrap">
              {ds.radius.map((r) => (
                <div key={r.name} className="group flex flex-col items-center">
                  <div
                    className="h-12 w-12 border-2 border-indigo-500/60 transition group-hover:border-indigo-400"
                    style={{ borderRadius: r.value }}
                  />
                  <div className="mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {r.name}
                  </div>
                  <div className="text-[9px] font-mono" style={{ color: "var(--text-muted)" }}>
                    {r.value}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Shadows */}
          <CollapsibleSection
            title="🌑 Shadows"
            subtitle={`${ds.shadows.length} shadow tokens`}
            isOpen={expandedSection === "shadows"}
            onToggle={() => toggleSection("shadows")}
          >
            <div className="flex gap-4 flex-wrap">
              {ds.shadows.map((s) => (
                <div key={s.name} className="flex flex-col items-center">
                  <div
                    className="h-16 w-24 rounded-xl"
                    style={{ backgroundColor: "var(--surface)", boxShadow: s.css }}
                  />
                  <div className="mt-2 text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {s.name}
                  </div>
                  <div
                    className="text-[9px] max-w-[120px] text-center"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s.usage}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </div>

        {/* Right: Export panel */}
        <div className="space-y-4">
          <Card className="sticky top-20">
            <CardHeader title="Export Design System" subtitle="Copy the generated tokens" />
            <CardBody className="space-y-4">
              {/* Format selector */}
              <div className="space-y-2">
                <div
                  className="text-[11px] font-medium uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Format
                </div>
                <div className="space-y-1">
                  {EXPORT_FORMATS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setExportFormat(f.id)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition"
                      style={
                        exportFormat === f.id
                          ? {
                              backgroundColor: "rgba(99,102,241,0.15)",
                              color: "#6366f1",
                              borderColor: "rgba(99,102,241,0.3)",
                              border: "1px solid rgba(99,102,241,0.3)",
                            }
                          : {
                              borderColor: "var(--border)",
                              color: "var(--text-secondary)",
                              border: "1px solid var(--border)",
                            }
                      }
                    >
                      <span>{f.icon}</span>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code preview */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="text-[11px] font-medium uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Preview
                  </div>
                  <CopyButton value={exportedCode} label="Copy code" />
                </div>
                <pre
                  className="max-h-96 overflow-auto rounded-xl border p-4 text-[11px] leading-relaxed"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--surface)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <code>{exportedCode}</code>
                </pre>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Collapsible section component
// ---------------------------------------------------------------------------

function CollapsibleSection({
  title,
  subtitle,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  subtitle: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition"
      >
        <div>
          <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {title}
          </div>
          <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {subtitle}
          </div>
        </div>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          style={{ color: "var(--text-muted)" }}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {isOpen && <CardBody className="pt-0">{children}</CardBody>}
    </Card>
  );
}
