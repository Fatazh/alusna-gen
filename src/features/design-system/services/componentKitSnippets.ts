import type { DesignSystem } from "../model/designSystem";
import { getComponentKitRadii } from "../model/componentKitRadius";
import { getComponentKitSpacing } from "../model/componentKitSpacing";

export type ComponentKitTab = "actions" | "forms" | "feedback" | "overlays";
export type ComponentKitButtonVariant = "primary" | "secondary" | "ghost";
export type ComponentKitControlSize = "sm" | "md" | "lg";
export type ComponentKitHandoffFormat = "css" | "tailwind" | "react";

export const COMPONENT_KIT_SIZE_VALUES: Record<
  ComponentKitControlSize,
  { label: string; height: string; padding: string }
> = {
  sm: { label: "Small", height: "2rem", padding: "0 0.75rem" },
  md: { label: "Medium", height: "2.5rem", padding: "0 1rem" },
  lg: { label: "Large", height: "3rem", padding: "0 1.25rem" },
};

export function getComponentKitButtonMetrics(system: DesignSystem, size: ComponentKitControlSize) {
  const spacing = getComponentKitSpacing(system);
  return {
    ...COMPONENT_KIT_SIZE_VALUES[size],
    padding: `${spacing.buttonPaddingY[size]} ${spacing.buttonPaddingX[size]}`,
  };
}

export function buildComponentKitSnippet(
  system: DesignSystem,
  tab: ComponentKitTab,
  variant: ComponentKitButtonVariant,
  size: ComponentKitControlSize,
  color: (token: string) => string,
  format: ComponentKitHandoffFormat,
): string {
  const name = system.name || "brand";
  const cssName = /^[a-zA-Z_]/.test(name) ? name : `brand-${name}`;
  const reactName = (() => {
    const normalized = name.replace(/[^a-zA-Z0-9_$]/g, "");
    return /^[a-zA-Z_$]/.test(normalized) ? normalized : `Brand${normalized}`;
  })();
  const radii = getComponentKitRadii(system);
  const spacing = getComponentKitSpacing(system);
  const metrics = getComponentKitButtonMetrics(system, size);
  const radius =
    tab === "forms"
      ? radii.field
      : tab === "feedback"
        ? radii.alert
        : tab === "overlays"
          ? radii.dialog
          : radii.button;
  const buttonBackground = color(
    variant === "secondary" ? "secondary" : variant === "ghost" ? "surface" : "primary",
  );
  const buttonForeground = color(
    variant === "secondary" ? "on-secondary" : variant === "ghost" ? "text-primary" : "on-primary",
  );

  if (format === "css") {
    if (tab === "forms") {
      return `.${cssName}-input {
  background: ${color("surface")};
  border: 1px solid ${color("border")};
  color: ${color("text-primary")};
  padding: ${spacing.fieldPaddingY} ${spacing.fieldPaddingX};
  border-radius: ${radius};
}`;
    }
    if (tab === "feedback") {
      return `.${cssName}-alert {
  background: ${color("info")};
  color: ${color("on-info")};
  padding: ${spacing.fieldPaddingY} ${spacing.fieldPaddingX};
  border-radius: ${radius};
}`;
    }
    if (tab === "overlays") {
      return `.${cssName}-dialog {
  background: ${color("surface")};
  color: ${color("text-primary")};
  border: 1px solid ${color("border")};
  padding: ${spacing.previewPadding};
  border-radius: ${radius};
}

.${cssName}-toast {
  background: ${color("success")};
  color: ${color("on-success")};
  border-radius: ${radii.pill};
}`;
    }
    return `.${cssName}-button {
  background: ${buttonBackground};
  color: ${buttonForeground};
  min-height: ${metrics.height};
  padding: ${metrics.padding};
  border-radius: ${radius};
}`;
  }

  if (format === "tailwind") {
    if (tab === "forms") {
      return `<input className="w-full rounded-[${radius}] border px-[${spacing.fieldPaddingX}] py-[${spacing.fieldPaddingY}] text-sm" style={{ backgroundColor: "${color("surface")}", borderColor: "${color("border")}", color: "${color("text-primary")}" }} />`;
    }
    if (tab === "feedback") {
      return `<div role="status" className="rounded-[${radius}] border px-[${spacing.fieldPaddingX}] py-[${spacing.fieldPaddingY}] text-sm" style={{ backgroundColor: "${color("info")}", color: "${color("on-info")}" }}>Draft saved</div>`;
    }
    if (tab === "overlays") {
      return `<div role="dialog" className="rounded-[${radius}] border p-[${spacing.previewPadding}] shadow-xl" style={{ backgroundColor: "${color("surface")}", color: "${color("text-primary")}", borderColor: "${color("border")}" }}>Dialog content</div>`;
    }
    return `<button className="inline-flex min-h-[${metrics.height}] items-center rounded-[${radius}] px-[${metrics.padding.split(" ")[1]}] py-[${metrics.padding.split(" ")[0]}] text-sm font-semibold" style={{ backgroundColor: "${buttonBackground}", color: "${buttonForeground}" }}>Primary action</button>`;
  }

  if (tab === "forms") {
    return `export function ${reactName}Input() {
  return <input style={{ backgroundColor: "${color("surface")}", borderColor: "${color("border")}", color: "${color("text-primary")}", padding: "${spacing.fieldPaddingY} ${spacing.fieldPaddingX}", borderRadius: "${radius}" }} />;
}`;
  }
  if (tab === "feedback") {
    return `export function ${reactName}Alert() {
  return <div role="status" style={{ backgroundColor: "${color("info")}", color: "${color("on-info")}", padding: "${spacing.fieldPaddingY} ${spacing.fieldPaddingX}", borderRadius: "${radius}" }}>Draft saved</div>;
}`;
  }
  if (tab === "overlays") {
    return `export function ${reactName}Dialog() {
  return <div role="dialog" aria-modal="true" style={{ backgroundColor: "${color("surface")}", color: "${color("text-primary")}", borderColor: "${color("border")}", padding: "${spacing.previewPadding}", borderRadius: "${radius}" }}>Dialog content</div>;
}`;
  }
  return `export function ${reactName}Button() {
  return <button style={{ backgroundColor: "${buttonBackground}", color: "${buttonForeground}", minHeight: "${metrics.height}", padding: "${metrics.padding}", borderRadius: "${radius}" }}>Primary action</button>;
}`;
}
