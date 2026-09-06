import { useState, type CSSProperties } from "react";
import { Card, CardBody, CardHeader } from "../../../shared/ui/Card";
import { CopyButton } from "../../../shared/ui/CopyButton";
import { useLocale } from "../../../shared/i18n";
import { getDesignSystemColor, type DesignSystem } from "../model/designSystem";

type KitTab = "actions" | "forms" | "feedback";
type ButtonVariant = "primary" | "secondary" | "ghost";
type ControlSize = "sm" | "md" | "lg";

const KIT_TABS: Array<{ id: KitTab; idLabel: string; enLabel: string }> = [
  { id: "actions", idLabel: "Aksi", enLabel: "Actions" },
  { id: "forms", idLabel: "Form", enLabel: "Forms" },
  { id: "feedback", idLabel: "Feedback", enLabel: "Feedback" },
];

const SIZE_VALUES: Record<ControlSize, { label: string; height: string; padding: string }> = {
  sm: { label: "Small", height: "2rem", padding: "0 0.75rem" },
  md: { label: "Medium", height: "2.5rem", padding: "0 1rem" },
  lg: { label: "Large", height: "3rem", padding: "0 1.25rem" },
};

export function ComponentKit({ system }: { system: DesignSystem }) {
  const { text } = useLocale();
  const [tab, setTab] = useState<KitTab>("actions");
  const [variant, setVariant] = useState<ButtonVariant>("primary");
  const [size, setSize] = useState<ControlSize>("md");
  const [inputValue, setInputValue] = useState("ALUSNA Studio");
  const [checked, setChecked] = useState(true);
  const [enabled, setEnabled] = useState(true);

  const color = (token: string) => getDesignSystemColor(system, token).hex;
  const radius = system.radius.find((item) => item.name === "md")?.value ?? "0.5rem";
  const buttonStyle = (buttonVariant: ButtonVariant): CSSProperties => {
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
  const sizeStyle = SIZE_VALUES[size];
  const snippet = buildSnippet(system, tab, variant, size, color);

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
            className="flex rounded-lg border p-1"
            role="toolbar"
            aria-label={text("Kategori komponen", "Component categories")}
            style={{ borderColor: "var(--border)" }}
          >
            {KIT_TABS.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={tab === option.id}
                onClick={() => setTab(option.id)}
                className="rounded-md px-3 py-1.5 text-xs font-medium transition active:translate-y-px"
                style={
                  tab === option.id
                    ? { backgroundColor: "var(--chip-active-bg)", color: "var(--text-primary)" }
                    : { color: "var(--text-muted)" }
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
            className="min-w-0 rounded-xl border p-4 sm:p-6"
            style={{
              backgroundColor: color("background"),
              borderColor: color("border"),
              color: color("text-primary"),
              fontFamily: `${system.fontFamily}, sans-serif`,
            }}
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold" style={{ color: color("text-primary") }}>
                  {text("Preview live", "Live preview")}
                </p>
                <p className="text-[11px]" style={{ color: color("text-secondary") }}>
                  {system.name} · {system.mode}
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
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  {(["primary", "secondary", "ghost"] as ButtonVariant[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={variant === item}
                      onClick={() => setVariant(item)}
                      className="rounded-md border px-2.5 py-1.5 text-[11px] font-medium capitalize"
                      style={
                        variant === item
                          ? { borderColor: color("primary"), color: color("primary") }
                          : { borderColor: color("border"), color: color("text-secondary") }
                      }
                    >
                      {item}
                    </button>
                  ))}
                  {(["sm", "md", "lg"] as ControlSize[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={size === item}
                      onClick={() => setSize(item)}
                      className="rounded-md border px-2.5 py-1.5 text-[11px] font-medium uppercase"
                      style={
                        size === item
                          ? { borderColor: color("primary"), color: color("primary") }
                          : { borderColor: color("border"), color: color("text-secondary") }
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg border font-semibold transition active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{
                      ...buttonStyle(variant),
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
                    className="inline-flex items-center justify-center rounded-lg border font-semibold opacity-50"
                    style={{
                      ...buttonStyle("ghost"),
                      height: sizeStyle.height,
                      padding: sizeStyle.padding,
                      borderRadius: radius,
                    }}
                  >
                    {text("Nonaktif", "Disabled")}
                  </button>
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ backgroundColor: color("secondary"), color: color("on-secondary") }}
                  >
                    {text("Baru", "New")}
                  </span>
                </div>
              </div>
            )}

            {tab === "forms" && (
              <div className="max-w-lg space-y-4">
                <label
                  className="block text-xs font-medium"
                  style={{ color: color("text-primary") }}
                >
                  {text("Nama proyek", "Project name")}
                  <input
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-1"
                    style={{
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
                    className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none"
                    defaultValue="system"
                    style={{
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
                <div className="flex flex-wrap gap-4">
                  <label
                    className="inline-flex items-center gap-2 text-xs"
                    style={{ color: color("text-secondary") }}
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
                    className="inline-flex items-center gap-2 text-xs"
                    style={{ color: color("text-secondary") }}
                  >
                    <span
                      className="relative h-5 w-9 rounded-full transition"
                      style={{ backgroundColor: enabled ? color("primary") : color("border") }}
                    >
                      <span
                        className="absolute top-0.5 h-4 w-4 rounded-full transition-transform"
                        style={{
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
              <div className="space-y-4">
                <div
                  className="rounded-lg border px-3 py-2.5 text-sm"
                  style={{
                    backgroundColor: color("info"),
                    borderColor: color("info"),
                    color: color("on-info"),
                  }}
                  role="status"
                >
                  <p className="font-semibold">{text("Draft tersimpan", "Draft saved")}</p>
                  <p className="mt-0.5 text-xs opacity-85">
                    {text(
                      "Semua perubahan tetap lokal di browser.",
                      "All changes remain local in your browser.",
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ backgroundColor: color("success"), color: color("on-success") }}
                  >
                    {text("Berhasil", "Success")}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ backgroundColor: color("warning"), color: color("on-warning") }}
                  >
                    {text("Perhatian", "Warning")}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ backgroundColor: color("error"), color: color("on-error") }}
                  >
                    {text("Error", "Error")}
                  </span>
                </div>
                <p
                  className="rounded-lg border px-3 py-2 text-xs"
                  role="alert"
                  style={{ borderColor: color("error"), color: color("error") }}
                >
                  {text(
                    "Contoh pesan error inline untuk field yang belum lengkap.",
                    "Example inline error for an incomplete field.",
                  )}
                </p>
              </div>
            )}
          </div>

          <aside
            className="min-w-0 rounded-xl border p-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-soft)" }}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                  {text("Token & handoff", "Tokens & handoff")}
                </p>
                <p className="mt-0.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
                  {text("Siap dipakai developer", "Ready for developer handoff")}
                </p>
              </div>
              <CopyButton value={snippet} label={text("Salin kode", "Copy code")} />
            </div>
            <div className="space-y-2 border-b pb-3" style={{ borderColor: "var(--border)" }}>
              {[
                ["primary", color("primary")],
                ["on-primary", color("on-primary")],
                ["surface", color("surface")],
                ["border", color("border")],
              ].map(([token, value]) => (
                <div key={token} className="flex items-center justify-between gap-2 text-[10px]">
                  <span className="font-mono" style={{ color: "var(--text-muted)" }}>
                    {token}
                  </span>
                  <span
                    className="flex items-center gap-1.5 font-mono"
                    style={{ color: "var(--text-secondary)" }}
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
            <pre
              className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg border p-3 text-[10px] leading-relaxed"
              style={{
                backgroundColor: color("surface"),
                borderColor: color("border"),
                color: color("text-secondary"),
              }}
            >
              {snippet}
            </pre>
          </aside>
        </div>
      </CardBody>
    </Card>
  );
}

function buildSnippet(
  system: DesignSystem,
  tab: KitTab,
  variant: ButtonVariant,
  size: ControlSize,
  color: (token: string) => string,
): string {
  const name = system.name || "brand";
  if (tab === "forms") {
    return `.${name}-input {
  background: ${color("surface")};
  border: 1px solid ${color("border")};
  color: ${color("text-primary")};
  border-radius: ${system.radius.find((item) => item.name === "md")?.value ?? "0.5rem"};
}`;
  }
  if (tab === "feedback") {
    return `.${name}-alert {
  background: ${color("info")};
  color: ${color("on-info")};
  border-radius: ${system.radius.find((item) => item.name === "md")?.value ?? "0.5rem"};
}`;
  }
  return `.${name}-button {
  background: ${color(variant === "secondary" ? "secondary" : variant === "ghost" ? "surface" : "primary")};
  color: ${color(variant === "secondary" ? "on-secondary" : variant === "ghost" ? "text-primary" : "on-primary")};
  min-height: ${SIZE_VALUES[size].height};
  padding: ${SIZE_VALUES[size].padding};
}`;
}
