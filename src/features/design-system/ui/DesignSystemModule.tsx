import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react/CaretDown";
import { CheckCircle } from "@phosphor-icons/react/CheckCircle";
import { DownloadSimple } from "@phosphor-icons/react/DownloadSimple";
import { WarningCircle } from "@phosphor-icons/react/WarningCircle";
import { useStudio } from "../../../store/studio";
import { ColorPicker, rgbToHex, type RGB } from "../../color";
import { Card, CardBody, CardHeader } from "../../../shared/ui/Card";
import { CopyButton } from "../../../shared/ui/CopyButton";
import { useLocale } from "../../../shared/i18n";
import { useToast } from "../../../shared/ui/toastContext";
import {
  generateDesignSystem,
  getDesignSystemColor,
  sanitizeTokenName,
  type ThemeMode,
} from "../model/designSystem";
import { downloadDesignSystemExport } from "../services/download";
import { exportDesignSystem, type ExportFormat } from "../services/serializers";
import { readDesignSystemDraft, writeDesignSystemDraft } from "../services/draftStorage";
import { ComponentKit } from "./ComponentKit";

const EXPORT_FORMATS: Array<{ id: ExportFormat; label: string }> = [
  { id: "css", label: "CSS Variables" },
  { id: "tailwind", label: "Tailwind v4 @theme" },
  { id: "json", label: "DTCG 2025.10 JSON" },
  { id: "react-native", label: "React Native Theme" },
  { id: "scss", label: "SCSS Variables" },
];

const MODE_OPTIONS: Array<{ id: ThemeMode; idLabel: string; enLabel: string }> = [
  { id: "light", idLabel: "Terang", enLabel: "Light" },
  { id: "dark", idLabel: "Gelap", enLabel: "Dark" },
  { id: "high-contrast", idLabel: "Kontras tinggi", enLabel: "High contrast" },
];

export function DesignSystemModule() {
  const { text } = useLocale();
  const { show } = useToast();
  const selectedColor = useStudio((state) => state.selectedColor);
  const activeFontFamily = useStudio((state) => state.activeFontFamily);
  const [draft] = useState(readDesignSystemDraft);
  const [baseColor, setBaseColor] = useState<RGB>(() => draft?.baseColor ?? selectedColor);
  const [dsName, setDsName] = useState(draft?.name ?? "brand");
  const [mode, setMode] = useState<ThemeMode>(draft?.mode ?? "light");
  const [spacingBase, setSpacingBase] = useState(draft?.spacingBase ?? 4);
  const [radiusBase, setRadiusBase] = useState(draft?.radiusBase ?? 8);
  const [exportFormat, setExportFormat] = useState<ExportFormat>(draft?.exportFormat ?? "css");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const system = useMemo(
    () =>
      generateDesignSystem(baseColor, {
        name: dsName,
        mode,
        fontFamily: activeFontFamily,
        spacingBase,
        radiusBase,
      }),
    [activeFontFamily, baseColor, dsName, mode, radiusBase, spacingBase],
  );
  const exportedCode = useMemo(
    () => exportDesignSystem(system, exportFormat),
    [exportFormat, system],
  );
  const failedContrastChecks = system.contrastChecks.filter((check) => !check.aaNormal).length;

  useEffect(() => {
    writeDesignSystemDraft({
      name: dsName,
      mode,
      spacingBase,
      radiusBase,
      exportFormat,
      baseColor,
    });
  }, [baseColor, dsName, exportFormat, mode, radiusBase, spacingBase]);

  const toggleSection = (section: string) =>
    setExpandedSection((current) => (current === section ? null : section));
  const color = (token: string) => getDesignSystemColor(system, token).hex;
  const onDownload = () => {
    downloadDesignSystemExport(system, exportFormat);
    show(text("File token diunduh.", "Token file downloaded."));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Card>
        <CardHeader
          title={text("Generator Token & Tema", "Design Token & Theme Generator")}
          subtitle={text(
            "Bangun fondasi token siap pakai dari warna dan font aktif",
            "Build production-ready token foundations from the active color and font",
          )}
        />
        <CardBody className="space-y-5">
          <div
            className="flex flex-wrap items-end justify-between gap-3 border-b pb-4"
            style={{ borderColor: "var(--border)" }}
          >
            <div>
              <p
                className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
                style={{ color: "var(--accent)" }}
              >
                {text("Ruang kerja sistem", "System workbench")}
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                {text(
                  "Susun primitive, semantic, dan komponen dalam satu sumber keputusan.",
                  "Shape primitive, semantic, and component decisions in one source of truth.",
                )}
              </p>
            </div>
            <span className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
              {system.colors.length + system.shades.length} {text("token aktif", "active tokens")}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="space-y-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
              <span>{text("Prefix token", "Token prefix")}</span>
              <input
                type="text"
                value={dsName}
                onChange={(event) => setDsName(sanitizeTokenName(event.target.value) || "brand")}
                className="w-full rounded-lg border px-3 py-2 font-mono text-sm outline-none"
                style={{
                  borderColor: "var(--input-border)",
                  backgroundColor: "var(--input-bg)",
                  color: "var(--input-text)",
                }}
                placeholder="brand"
              />
            </label>

            <fieldset className="space-y-1.5">
              <legend className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {text("Mode tema", "Theme mode")}
              </legend>
              <div className="grid grid-cols-3 gap-1.5">
                {MODE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={mode === option.id}
                    onClick={() => setMode(option.id)}
                    className="min-h-10 rounded-lg border px-2 text-[11px] font-medium"
                    style={
                      mode === option.id
                        ? {
                            borderColor: "var(--action-bg)",
                            backgroundColor: "var(--chip-active-bg)",
                            color: "var(--text-primary)",
                          }
                        : { borderColor: "var(--border)", color: "var(--text-secondary)" }
                    }
                  >
                    {text(option.idLabel, option.enLabel)}
                  </button>
                ))}
              </div>
            </fieldset>

            <RangeControl
              id="spacing-base"
              label={text("Unit spacing", "Spacing unit")}
              value={spacingBase}
              min={2}
              max={8}
              suffix="px"
              onChange={setSpacingBase}
            />
            <RangeControl
              id="radius-base"
              label={text("Radius dasar", "Base radius")}
              value={radiusBase}
              min={0}
              max={24}
              suffix="px"
              onChange={setRadiusBase}
              description={text(
                "Mengubah kelengkungan sudut preview Component Kit.",
                "Changes the corner rounding in the Component Kit preview.",
              )}
              preview={
                <span
                  aria-hidden="true"
                  data-radius-control-preview
                  className="inline-block h-10 w-14 shrink-0 border-2"
                  style={{
                    borderRadius: `${system.radiusBase}px`,
                    borderColor: "var(--accent)",
                    backgroundColor: "var(--surface-soft)",
                  }}
                />
              }
            />
          </div>

          <div
            className="rounded-xl border p-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-soft)" }}
          >
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {text("Warna dasar sistem", "System base color")}
                </p>
                <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  {text(
                    "Pilih warna brand yang menjadi sumber token primary dan turunannya.",
                    "Choose the brand color that drives primary tokens and their derived scales.",
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBaseColor(selectedColor)}
                className="rounded-lg border px-3 py-2 text-xs font-medium transition"
                style={{ borderColor: "var(--input-border)", color: "var(--text-secondary)" }}
              >
                {text("Gunakan warna aktif", "Use active color")}
                <span className="ml-1 font-mono">{rgbToHex(selectedColor)}</span>
              </button>
            </div>
            <ColorPicker rgb={baseColor} onRgbChange={setBaseColor} />
          </div>

          <div
            className="flex flex-wrap items-center gap-3 border-t pt-4"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold"
              style={{ backgroundColor: rgbToHex(baseColor), color: color("on-primary") }}
            >
              {system.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {system.name} · {mode}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {system.colors.length} semantic · {system.shades.length} primitive ·{" "}
                {system.componentColors.length} component aliases · {activeFontFamily}
              </p>
              <p className="mt-1 text-[10px]" style={{ color: "var(--accent)" }}>
                {text("Draft tersimpan selama sesi ini", "Draft saved for this session")}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <ComponentKit system={system} />

          <Card>
            <CardHeader
              title={text("Pemeriksaan Kontras", "Contrast Validation")}
              subtitle={
                failedContrastChecks === 0
                  ? text("Semua pasangan utama lulus WCAG AA", "All primary pairs pass WCAG AA")
                  : text(
                      `${failedContrastChecks} pasangan perlu diperbaiki`,
                      `${failedContrastChecks} pairs need attention`,
                    )
              }
            />
            <CardBody>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {system.contrastChecks.map((check) => (
                  <div
                    key={check.label}
                    className="rounded-xl border p-3"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className="text-xs font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {check.label}
                        </p>
                        <p className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                          {check.foreground} / {check.background}
                        </p>
                      </div>
                      {check.aaNormal ? (
                        <CheckCircle
                          size={18}
                          weight="fill"
                          className="text-emerald-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <WarningCircle
                          size={18}
                          weight="fill"
                          className="text-amber-500"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div
                      className="mt-3 rounded-lg border px-3 py-2 text-sm font-semibold"
                      style={{
                        backgroundColor: check.background,
                        borderColor: check.foreground,
                        color: check.foreground,
                      }}
                    >
                      Aa · {check.ratio.toFixed(2)}:1
                    </div>
                    <p className="mt-2 text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {check.aaa
                        ? "AAA"
                        : check.aaNormal
                          ? "AA"
                          : check.aaLarge
                            ? "AA Large"
                            : "Fail"}
                    </p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <CollapsibleSection
            id="colors"
            title="Color Roles"
            subtitle={`${system.colors.length} semantic tokens`}
            isOpen={expandedSection === "colors"}
            onToggle={() => toggleSection("colors")}
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {system.colors.map((item) => (
                <div
                  key={item.token}
                  className="overflow-hidden rounded-xl border"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="h-16 w-full" style={{ backgroundColor: item.hex }} />
                  <div className="space-y-1 px-3 py-2">
                    <p
                      className="text-[11px] font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.role}
                    </p>
                    <p className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {item.token} · {item.hex}
                    </p>
                    <p className="text-[10px] leading-tight" style={{ color: "var(--text-muted)" }}>
                      {item.usage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            id="shades"
            title="Primitive Shade Scale"
            subtitle={`${system.shades.length} steps (50–950)`}
            isOpen={expandedSection === "shades"}
            onToggle={() => toggleSection("shades")}
          >
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-11">
              {system.shades.map((shade) => {
                const hex = rgbToHex(shade.rgb);
                return (
                  <div key={shade.step} className="min-w-0 text-center">
                    <div className="h-14 rounded-lg" style={{ backgroundColor: hex }} />
                    <p
                      className="mt-1 text-[10px] font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {shade.step}
                    </p>
                    <p
                      className="truncate font-mono text-[9px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {hex}
                    </p>
                  </div>
                );
              })}
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            id="typography"
            title="Typography Scale"
            subtitle={`${system.typography.length} styles · ${system.fontFamily}`}
            isOpen={expandedSection === "typography"}
            onToggle={() => toggleSection("typography")}
          >
            <div className="space-y-2">
              {system.typography.map((type) => (
                <div
                  key={type.name}
                  className="grid gap-2 rounded-lg border px-4 py-3 sm:grid-cols-[7rem_1fr_auto] sm:items-baseline"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div>
                    <p
                      className="text-[11px] font-semibold"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {type.name}
                    </p>
                    <p className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {type.size} / {type.lineHeight}
                    </p>
                  </div>
                  <p
                    className="truncate"
                    style={{
                      fontFamily: `${type.fontFamily}, sans-serif`,
                      fontSize: `min(${type.size}, 2.5rem)`,
                      lineHeight: type.lineHeight,
                      fontWeight: type.fontWeight,
                      letterSpacing: type.letterSpacing,
                      color: "var(--text-primary)",
                    }}
                  >
                    Better design starts here
                  </p>
                  <p className="hidden text-[10px] lg:block" style={{ color: "var(--text-muted)" }}>
                    {type.usage}
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            id="spacing"
            title="Spacing Scale"
            subtitle={`${system.spacing.length} tokens · ${spacingBase}px base`}
            isOpen={expandedSection === "spacing"}
            onToggle={() => toggleSection("spacing")}
          >
            <div className="flex flex-wrap items-end gap-3">
              {system.spacing.map((space) => (
                <div key={space.name} className="flex flex-col items-center">
                  <div
                    className="bg-[var(--accent)] opacity-60"
                    style={{ width: Math.max(space.px, 4), height: Math.max(space.px, 4) }}
                  />
                  <p className="mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {space.name}
                  </p>
                  <p className="font-mono text-[9px]" style={{ color: "var(--text-muted)" }}>
                    {space.px}px
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            id="radius"
            title="Border Radius"
            subtitle={`${system.radius.length} tokens · ${radiusBase}px base`}
            isOpen={expandedSection === "radius"}
            onToggle={() => toggleSection("radius")}
          >
            <div className="flex flex-wrap items-end gap-4">
              {system.radius.map((radius) => (
                <div key={radius.name} className="flex flex-col items-center">
                  <div
                    className="h-12 w-12 border-2"
                    style={{ borderRadius: radius.value, borderColor: "var(--accent)" }}
                  />
                  <p className="mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {radius.name}
                  </p>
                  <p className="font-mono text-[9px]" style={{ color: "var(--text-muted)" }}>
                    {radius.value}
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            id="shadows"
            title="Shadows"
            subtitle={`${system.shadows.length} structured shadow tokens`}
            isOpen={expandedSection === "shadows"}
            onToggle={() => toggleSection("shadows")}
          >
            <div className="flex flex-wrap gap-5">
              {system.shadows.map((shadow) => (
                <div key={shadow.name} className="flex flex-col items-center">
                  <div
                    className="h-16 w-24 rounded-xl"
                    style={{ backgroundColor: color("surface"), boxShadow: shadow.css }}
                  />
                  <p className="mt-2 text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {shadow.name} · {shadow.layers.length} layer
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </div>

        <div className="space-y-4">
          <Card className="sticky top-24">
            <CardHeader
              title={text("Export Token", "Export Tokens")}
              subtitle={text(
                "Salin atau unduh hasil siap pakai",
                "Copy or download production-ready output",
              )}
            />
            <CardBody className="space-y-4">
              <fieldset className="space-y-2">
                <legend
                  className="text-[11px] font-medium uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Format
                </legend>
                <div className="space-y-1">
                  {EXPORT_FORMATS.map((format) => (
                    <button
                      key={format.id}
                      type="button"
                      aria-pressed={exportFormat === format.id}
                      onClick={() => setExportFormat(format.id)}
                      className="flex min-h-10 w-full items-center rounded-lg border px-3 py-2 text-left text-xs font-medium"
                      style={
                        exportFormat === format.id
                          ? {
                              backgroundColor: "var(--chip-active-bg)",
                              color: "var(--text-primary)",
                              borderColor: "var(--action-bg)",
                            }
                          : { borderColor: "var(--border)", color: "var(--text-secondary)" }
                      }
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span
                    className="text-[11px] font-medium uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Preview
                  </span>
                  <div className="flex items-center gap-1">
                    <CopyButton value={exportedCode} label={text("Salin kode", "Copy code")} />
                    <button
                      type="button"
                      onClick={onDownload}
                      className="inline-flex min-h-8 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium hover:bg-black/5 dark:hover:bg-white/10"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <DownloadSimple size={14} aria-hidden="true" />
                      {text("Unduh", "Download")}
                    </button>
                  </div>
                </div>
                <pre
                  data-design-system-export-preview
                  className="max-h-[32rem] overflow-auto rounded-xl border p-4 text-[11px] leading-relaxed"
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

function RangeControl({
  id,
  label,
  value,
  min,
  max,
  suffix,
  onChange,
  description,
  preview,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (value: number) => void;
  description?: string;
  preview?: ReactNode;
}) {
  return (
    <label htmlFor={id} className="space-y-2 text-xs" style={{ color: "var(--text-secondary)" }}>
      <span className="flex items-center justify-between gap-2">
        {label}
        <span className="font-mono" style={{ color: "var(--text-primary)" }}>
          {value}
          {suffix}
        </span>
      </span>
      <span className="flex items-center gap-3">
        {preview}
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          aria-describedby={description ? `${id}-description` : undefined}
          onChange={(event) => onChange(Number(event.target.value))}
          className="min-w-0 w-full"
        />
      </span>
      {description && (
        <span
          id={`${id}-description`}
          className="block text-[11px]"
          style={{ color: "var(--text-muted)" }}
        >
          {description}
        </span>
      )}
    </label>
  );
}

function CollapsibleSection({
  id,
  title,
  subtitle,
  isOpen,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const panelId = `design-system-${id}-panel`;
  return (
    <Card>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex min-h-16 w-full items-center justify-between px-5 py-4 text-left transition hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
      >
        <span>
          <span className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {title}
          </span>
          <span className="block text-[11px]" style={{ color: "var(--text-muted)" }}>
            {subtitle}
          </span>
        </span>
        <CaretDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          style={{ color: "var(--text-muted)" }}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div id={panelId}>
          <CardBody className="pt-0">{children}</CardBody>
        </div>
      )}
    </Card>
  );
}
