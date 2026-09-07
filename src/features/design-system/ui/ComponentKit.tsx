import { useState, type CSSProperties } from "react";
import { Card, CardBody, CardHeader } from "../../../shared/ui/Card";
import { CopyButton } from "../../../shared/ui/CopyButton";
import { useLocale } from "../../../shared/i18n";
import { useToast } from "../../../shared/ui/toastContext";
import { getDesignSystemColor, type DesignSystem } from "../model/designSystem";
import { getComponentKitRadii } from "../model/componentKitRadius";
import { getComponentKitSpacing } from "../model/componentKitSpacing";
import {
  buildComponentKitSnippet,
  getComponentKitButtonMetrics,
  type ComponentKitButtonVariant,
  type ComponentKitControlSize,
  type ComponentKitHandoffFormat,
  type ComponentKitTab,
} from "../services/componentKitSnippets";

type OverlayTab = "overview" | "tokens";

const KIT_TABS: Array<{ id: ComponentKitTab; idLabel: string; enLabel: string }> = [
  { id: "actions", idLabel: "Aksi", enLabel: "Actions" },
  { id: "forms", idLabel: "Form", enLabel: "Forms" },
  { id: "feedback", idLabel: "Feedback", enLabel: "Feedback" },
  { id: "overlays", idLabel: "Overlay", enLabel: "Overlays" },
];

const HANDOFF_FORMATS: Array<{ id: ComponentKitHandoffFormat; label: string }> = [
  { id: "css", label: "CSS" },
  { id: "tailwind", label: "Tailwind" },
  { id: "react", label: "React" },
];

export function ComponentKit({ system }: { system: DesignSystem }) {
  const { text } = useLocale();
  const { show } = useToast();
  const [tab, setTab] = useState<ComponentKitTab>("actions");
  const [handoffFormat, setHandoffFormat] = useState<ComponentKitHandoffFormat>("css");
  const [overlayTab, setOverlayTab] = useState<OverlayTab>("overview");
  const [variant, setVariant] = useState<ComponentKitButtonVariant>("primary");
  const [size, setSize] = useState<ComponentKitControlSize>("md");
  const [inputValue, setInputValue] = useState("ALUSNA Studio");
  const [checked, setChecked] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const color = (token: string) => getDesignSystemColor(system, token).hex;
  const radii = getComponentKitRadii(system);
  const spacing = getComponentKitSpacing(system);
  const buttonStyle = (buttonVariant: ComponentKitButtonVariant): CSSProperties => {
    if (buttonVariant === "secondary") {
      return {
        backgroundColor: color("secondary"),
        borderColor: color("secondary"),
        color: color("on-secondary"),
      };
    }
    if (buttonVariant === "ghost") {
      return {
        backgroundColor: color("surface"),
        borderColor: color("border"),
        color: color("text-primary"),
      };
    }
    return {
      backgroundColor: color("primary"),
      borderColor: color("primary"),
      color: color("on-primary"),
    };
  };
  const sizeStyle = getComponentKitButtonMetrics(system, size);
  const snippet = buildComponentKitSnippet(system, tab, variant, size, color, handoffFormat);

  return (
    <Card>
      <CardHeader
        title="Component Kit"
        subtitle={text(
          "Uji komponen nyata dengan token yang sama sebelum handoff.",
          "Test real components with the same tokens before handoff.",
        )}
      />
      <CardBody>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "var(--accent)" }}
            >
              {text("Playground komponen", "Component playground")}
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              {text(
                "Setiap state memakai semantic token dari sistem ini.",
                "Every state uses semantic tokens from this system.",
              )}
            </p>
          </div>
          <div
            className="flex border"
            role="toolbar"
            aria-label={text("Kategori komponen", "Component categories")}
            style={{
              borderColor: "var(--border)",
              borderRadius: radii.panel,
              padding: spacing.inlineGap,
              gap: spacing.inlineGap,
            }}
          >
            {KIT_TABS.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={tab === option.id}
                onClick={() => setTab(option.id)}
                className="text-xs font-medium transition active:translate-y-px"
                style={
                  tab === option.id
                    ? {
                        backgroundColor: "var(--chip-active-bg)",
                        color: "var(--text-primary)",
                        borderRadius: radii.button,
                        padding: `${spacing.buttonPaddingY.sm} ${spacing.buttonPaddingX.sm}`,
                      }
                    : {
                        color: "var(--text-muted)",
                        borderRadius: radii.button,
                        padding: `${spacing.buttonPaddingY.sm} ${spacing.buttonPaddingX.sm}`,
                      }
                }
              >
                {text(option.idLabel, option.enLabel)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(15rem,0.6fr)]">
          <div
            data-design-system-preview
            className="min-w-0 border"
            style={{
              borderRadius: radii.panel,
              padding: spacing.previewPadding,
              backgroundColor: color("background"),
              borderColor: color("border"),
              color: color("text-primary"),
              fontFamily: `${system.fontFamily}, sans-serif`,
            }}
          >
            <div
              className="flex items-center justify-between"
              style={{ marginBottom: spacing.sectionGap, gap: spacing.controlGap }}
            >
              <div>
                <p className="text-sm font-semibold" style={{ color: color("text-primary") }}>
                  {text("Preview live", "Live preview")}
                </p>
                <p className="text-[11px]" style={{ color: color("text-secondary") }}>
                  {system.name} · {system.mode} · {text("Spacing", "Spacing")} {system.spacingBase}
                  px · {text("Radius", "Radius")} {system.radiusBase}px
                </p>
              </div>
              <span
                className="rounded-full px-2.5 py-1 font-mono text-[10px]"
                style={{
                  backgroundColor: color("surface-variant"),
                  color: color("text-secondary"),
                }}
              >
                {text("token aktif", "active tokens")}
              </span>
            </div>

            {tab === "actions" && (
              <div style={{ display: "grid", rowGap: spacing.sectionGap }}>
                <div className="flex flex-wrap items-center" style={{ gap: spacing.controlGap }}>
                  {(["primary", "secondary", "ghost"] as ComponentKitButtonVariant[]).map(
                    (item) => (
                      <button
                        key={item}
                        type="button"
                        aria-pressed={variant === item}
                        onClick={() => setVariant(item)}
                        className="rounded-md border text-[11px] font-medium capitalize"
                        style={
                          variant === item
                            ? {
                                borderColor: color("primary"),
                                color: color("primary"),
                                padding: `${spacing.buttonPaddingY.sm} ${spacing.buttonPaddingX.sm}`,
                              }
                            : {
                                borderColor: color("border"),
                                color: color("text-secondary"),
                                padding: `${spacing.buttonPaddingY.sm} ${spacing.buttonPaddingX.sm}`,
                              }
                        }
                      >
                        {item}
                      </button>
                    ),
                  )}
                  <div
                    role="group"
                    aria-label={text("Ukuran tombol", "Button size")}
                    className="flex flex-wrap items-center"
                    style={{ gap: spacing.controlGap }}
                  >
                    <span className="text-[11px]" style={{ color: color("text-secondary") }}>
                      {text("Ukuran tombol", "Button size")}
                    </span>
                    {(["sm", "md", "lg"] as ComponentKitControlSize[]).map((item) => (
                      <button
                        key={item}
                        type="button"
                        aria-pressed={size === item}
                        onClick={() => setSize(item)}
                        className="rounded-md border text-[11px] font-medium uppercase"
                        style={
                          size === item
                            ? {
                                borderColor: color("primary"),
                                color: color("primary"),
                                padding: `${spacing.buttonPaddingY.sm} ${spacing.buttonPaddingX.sm}`,
                              }
                            : {
                                borderColor: color("border"),
                                color: color("text-secondary"),
                                padding: `${spacing.buttonPaddingY.sm} ${spacing.buttonPaddingX.sm}`,
                              }
                        }
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center" style={{ gap: spacing.controlGap }}>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center border font-semibold transition active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{
                      ...buttonStyle(variant),
                      borderRadius: radii.button,
                      height: sizeStyle.height,
                      padding: sizeStyle.padding,
                      outlineColor: color("primary"),
                    }}
                  >
                    {text("Aksi utama", "Primary action")}
                  </button>
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center justify-center border font-semibold opacity-50"
                    style={{
                      ...buttonStyle("ghost"),
                      height: sizeStyle.height,
                      padding: sizeStyle.padding,
                      borderRadius: radii.button,
                    }}
                  >
                    {text("Nonaktif", "Disabled")}
                  </button>
                  <span
                    className="text-[11px] font-semibold"
                    style={{
                      backgroundColor: color("secondary"),
                      color: color("on-secondary"),
                      borderRadius: radii.badge,
                      padding: `${spacing.badgePaddingY} ${spacing.badgePaddingX}`,
                    }}
                  >
                    {text("Baru", "New")}
                  </span>
                </div>
              </div>
            )}

            {tab === "forms" && (
              <div className="max-w-lg" style={{ display: "grid", rowGap: spacing.sectionGap }}>
                <label
                  className="block text-xs font-medium"
                  style={{ color: color("text-primary") }}
                >
                  {text("Nama proyek", "Project name")}
                  <input
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    className="w-full border text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-1"
                    style={{
                      borderRadius: radii.field,
                      marginTop: spacing.inlineGap,
                      padding: `${spacing.fieldPaddingY} ${spacing.fieldPaddingX}`,
                      backgroundColor: color("surface"),
                      borderColor: color("border"),
                      color: color("text-primary"),
                      outlineColor: color("primary"),
                    }}
                  />
                </label>
                <label
                  className="block text-xs font-medium"
                  style={{ color: color("text-primary") }}
                >
                  {text("Mode tampilan", "Display mode")}
                  <select
                    className="w-full border text-sm outline-none"
                    defaultValue="system"
                    style={{
                      borderRadius: radii.field,
                      marginTop: spacing.inlineGap,
                      padding: `${spacing.fieldPaddingY} ${spacing.fieldPaddingX}`,
                      backgroundColor: color("surface"),
                      borderColor: color("border"),
                      color: color("text-primary"),
                    }}
                  >
                    <option value="system">System preference</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </label>
                <div className="flex flex-wrap" style={{ gap: spacing.sectionGap }}>
                  <label
                    className="inline-flex items-center text-xs"
                    style={{ color: color("text-secondary"), gap: spacing.controlGap }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => setChecked(event.target.checked)}
                    />
                    {text("Aktifkan notifikasi", "Enable notifications")}
                  </label>
                  <button
                    type="button"
                    aria-pressed={enabled}
                    onClick={() => setEnabled((value) => !value)}
                    className="inline-flex items-center text-xs"
                    style={{ color: color("text-secondary"), gap: spacing.controlGap }}
                  >
                    <span
                      className="relative h-5 w-9 transition"
                      style={{
                        backgroundColor: enabled ? color("primary") : color("border"),
                        borderRadius: radii.pill,
                      }}
                    >
                      <span
                        className="absolute top-0.5 h-4 w-4 transition-transform"
                        style={{
                          borderRadius: radii.pill,
                          backgroundColor: color("on-primary"),
                          transform: enabled ? "translateX(1.1rem)" : "translateX(0.1rem)",
                        }}
                      />
                    </span>
                    {text("Sinkronkan", "Sync")}
                  </button>
                </div>
              </div>
            )}

            {tab === "feedback" && (
              <div style={{ display: "grid", rowGap: spacing.sectionGap }}>
                <div
                  className="border text-sm"
                  style={{
                    borderRadius: radii.alert,
                    padding: `${spacing.fieldPaddingY} ${spacing.fieldPaddingX}`,
                    backgroundColor: color("info"),
                    borderColor: color("info"),
                    color: color("on-info"),
                  }}
                  role="status"
                >
                  <p className="font-semibold">{text("Draft tersimpan", "Draft saved")}</p>
                  <p className="text-xs opacity-85" style={{ marginTop: spacing.inlineGap }}>
                    {text(
                      "Semua perubahan tetap lokal di browser.",
                      "All changes remain local in your browser.",
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap items-center" style={{ gap: spacing.controlGap }}>
                  <span
                    className="text-[11px] font-semibold"
                    style={{
                      backgroundColor: color("success"),
                      color: color("on-success"),
                      borderRadius: radii.badge,
                      padding: `${spacing.badgePaddingY} ${spacing.badgePaddingX}`,
                    }}
                  >
                    {text("Berhasil", "Success")}
                  </span>
                  <span
                    className="text-[11px] font-semibold"
                    style={{
                      backgroundColor: color("warning"),
                      color: color("on-warning"),
                      borderRadius: radii.badge,
                      padding: `${spacing.badgePaddingY} ${spacing.badgePaddingX}`,
                    }}
                  >
                    {text("Perhatian", "Warning")}
                  </span>
                  <span
                    className="text-[11px] font-semibold"
                    style={{
                      backgroundColor: color("error"),
                      color: color("on-error"),
                      borderRadius: radii.badge,
                      padding: `${spacing.badgePaddingY} ${spacing.badgePaddingX}`,
                    }}
                  >
                    {text("Error", "Error")}
                  </span>
                </div>
                <p
                  className="border text-xs"
                  role="alert"
                  style={{
                    borderColor: color("error"),
                    color: color("error"),
                    borderRadius: radii.alert,
                    padding: `${spacing.fieldPaddingY} ${spacing.fieldPaddingX}`,
                  }}
                >
                  {text(
                    "Contoh pesan error inline untuk field yang belum lengkap.",
                    "Example inline error for an incomplete field.",
                  )}
                </p>
              </div>
            )}

            {tab === "overlays" && (
              <div style={{ display: "grid", rowGap: spacing.sectionGap }}>
                <div
                  className="flex border-b"
                  role="tablist"
                  aria-label={text("Contoh tabs", "Tabs example")}
                  style={{ borderColor: color("border"), gap: spacing.inlineGap }}
                >
                  {(
                    [
                      ["overview", text("Ringkasan", "Overview")],
                      ["tokens", text("Token", "Tokens")],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      id={`component-kit-tab-${id}`}
                      aria-selected={overlayTab === id}
                      aria-controls={`component-kit-panel-${id}`}
                      tabIndex={overlayTab === id ? 0 : -1}
                      onClick={() => setOverlayTab(id)}
                      onKeyDown={(event) => {
                        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                        event.preventDefault();
                        const nextTab = event.key === "ArrowRight" ? "tokens" : "overview";
                        setOverlayTab(nextTab);
                        document.getElementById(`component-kit-tab-${nextTab}`)?.focus();
                      }}
                      className="border-b-2 text-xs font-medium"
                      style={
                        overlayTab === id
                          ? {
                              borderColor: color("primary"),
                              color: color("primary"),
                              padding: `${spacing.tabPaddingY} ${spacing.tabPaddingX}`,
                            }
                          : {
                              borderColor: "transparent",
                              color: "var(--text-muted)",
                              padding: `${spacing.tabPaddingY} ${spacing.tabPaddingX}`,
                            }
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div
                  id={`component-kit-panel-${overlayTab}`}
                  role="tabpanel"
                  aria-labelledby={`component-kit-tab-${overlayTab}`}
                  tabIndex={0}
                  className="border"
                  style={{
                    borderColor: color("border"),
                    backgroundColor: color("surface"),
                    borderRadius: radii.panel,
                    padding: spacing.previewPadding,
                  }}
                >
                  {overlayTab === "overview" ? (
                    <>
                      <p className="text-sm font-semibold" style={{ color: color("text-primary") }}>
                        {text("Alur kerja terpusat", "Focused workflow")}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: color("text-secondary"), marginTop: spacing.inlineGap }}
                      >
                        {text(
                          "Tabs menjaga konteks, dialog meminta keputusan, dan toast memberi konfirmasi singkat.",
                          "Tabs preserve context, dialogs request decisions, and toasts confirm short actions.",
                        )}
                      </p>
                    </>
                  ) : (
                    <div
                      className="text-xs"
                      style={{
                        color: color("text-secondary"),
                        display: "grid",
                        rowGap: spacing.inlineGap,
                      }}
                    >
                      <p className="font-mono">tab.active → primary</p>
                      <p className="font-mono">dialog.surface → surface</p>
                      <p className="font-mono">toast.success → success</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap" style={{ gap: spacing.controlGap }}>
                  <button
                    type="button"
                    onClick={() => setDialogOpen(true)}
                    className="border text-xs font-semibold"
                    style={{
                      borderRadius: radii.button,
                      padding: `${spacing.buttonPaddingY.sm} ${spacing.buttonPaddingX.sm}`,
                      backgroundColor: color("primary"),
                      borderColor: color("primary"),
                      color: color("on-primary"),
                    }}
                  >
                    {text("Buka dialog", "Open dialog")}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      show(text("Toast berhasil ditampilkan", "Toast shown successfully"))
                    }
                    className="border text-xs font-semibold"
                    style={{
                      borderRadius: radii.button,
                      padding: `${spacing.buttonPaddingY.sm} ${spacing.buttonPaddingX.sm}`,
                      backgroundColor: color("surface"),
                      borderColor: color("border"),
                      color: color("text-primary"),
                    }}
                  >
                    {text("Tampilkan toast", "Show toast")}
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside
            className="min-w-0 border"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface-soft)",
              borderRadius: radii.panel,
              padding: spacing.previewPadding,
            }}
          >
            <div
              className="flex items-center justify-between"
              style={{ marginBottom: spacing.sectionGap, gap: spacing.controlGap }}
            >
              <div>
                <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                  {text("Token & handoff", "Tokens & handoff")}
                </p>
                <p
                  className="text-[10px]"
                  style={{ color: "var(--text-muted)", marginTop: spacing.inlineGap }}
                >
                  {text("Siap dipakai developer", "Ready for developer handoff")}
                </p>
              </div>
              <CopyButton value={snippet} label={text("Salin kode", "Copy code")} />
            </div>
            <div
              className="border-b"
              style={{ borderColor: "var(--border)", paddingBottom: spacing.sectionGap }}
            >
              {[
                ["primary", color("primary")],
                ["on-primary", color("on-primary")],
                ["surface", color("surface")],
                ["border", color("border")],
              ].map(([token, value]) => (
                <div
                  key={token}
                  className="flex items-center justify-between text-[10px]"
                  style={{
                    gap: spacing.controlGap,
                    marginTop: token === "primary" ? undefined : spacing.inlineGap,
                  }}
                >
                  <span className="font-mono" style={{ color: "var(--text-muted)" }}>
                    {token}
                  </span>
                  <span
                    className="flex items-center font-mono"
                    style={{ color: "var(--text-secondary)", gap: spacing.inlineGap }}
                  >
                    <span
                      className="h-3 w-3 rounded-sm border"
                      style={{ backgroundColor: value, borderColor: "var(--border)" }}
                    />
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="flex flex-wrap"
              role="toolbar"
              aria-label={text("Format handoff", "Handoff format")}
              style={{ marginTop: spacing.sectionGap, gap: spacing.inlineGap }}
            >
              {HANDOFF_FORMATS.map((format) => (
                <button
                  key={format.id}
                  type="button"
                  aria-pressed={handoffFormat === format.id}
                  onClick={() => setHandoffFormat(format.id)}
                  className="rounded-md border text-[10px] font-medium"
                  style={
                    handoffFormat === format.id
                      ? {
                          borderColor: color("primary"),
                          color: color("primary"),
                          padding: `${spacing.badgePaddingY} ${spacing.badgePaddingX}`,
                        }
                      : {
                          borderColor: color("border"),
                          color: color("text-secondary"),
                          padding: `${spacing.badgePaddingY} ${spacing.badgePaddingX}`,
                        }
                  }
                >
                  {format.label}
                </button>
              ))}
            </div>
            <pre
              data-component-kit-handoff
              className="max-h-48 overflow-auto whitespace-pre-wrap border text-[10px] leading-relaxed"
              style={{
                backgroundColor: color("surface"),
                borderColor: color("border"),
                color: color("text-secondary"),
                borderRadius: radii.field,
                marginTop: spacing.sectionGap,
                padding: spacing.fieldPaddingX,
              }}
            >
              {snippet}
            </pre>
          </aside>
        </div>
      </CardBody>
      {dialogOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onKeyDown={(event) => {
            if (event.key === "Escape") setDialogOpen(false);
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDialogOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="component-kit-dialog-title"
            aria-describedby="component-kit-dialog-description"
            className="w-full max-w-md border shadow-2xl"
            style={{
              backgroundColor: color("surface"),
              borderColor: color("border"),
              borderRadius: radii.dialog,
              padding: spacing.previewPadding,
            }}
          >
            <h4
              id="component-kit-dialog-title"
              className="text-base font-semibold"
              style={{ color: color("text-primary") }}
            >
              {text("Konfirmasi perubahan", "Confirm changes")}
            </h4>
            <p
              id="component-kit-dialog-description"
              className="text-sm"
              style={{ color: color("text-secondary"), marginTop: spacing.inlineGap }}
            >
              {text(
                "Dialog menjaga fokus pengguna pada keputusan penting.",
                "A dialog keeps the user focused on an important decision.",
              )}
            </p>
            <div
              className="flex justify-end"
              style={{ marginTop: spacing.sectionGap, gap: spacing.controlGap }}
            >
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="border text-xs font-semibold"
                style={{
                  borderColor: color("border"),
                  color: color("text-primary"),
                  borderRadius: radii.button,
                  padding: `${spacing.buttonPaddingY.sm} ${spacing.buttonPaddingX.sm}`,
                }}
              >
                {text("Batal", "Cancel")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDialogOpen(false);
                  show(text("Perubahan diterapkan", "Changes applied"));
                }}
                className="border text-xs font-semibold"
                style={{
                  borderRadius: radii.button,
                  padding: `${spacing.buttonPaddingY.sm} ${spacing.buttonPaddingX.sm}`,
                  backgroundColor: color("primary"),
                  borderColor: color("primary"),
                  color: color("on-primary"),
                }}
              >
                {text("Terapkan", "Apply")}
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
