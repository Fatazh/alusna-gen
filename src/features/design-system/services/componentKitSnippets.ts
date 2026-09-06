import type { DesignSystem } from "../model/designSystem";

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
  const radius = system.radius.find((item) => item.name === "md")?.value ?? "0.5rem";
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
  border-radius: ${radius};
}`;
    }
    if (tab === "feedback") {
      return `.${cssName}-alert {
  background: ${color("info")};
  color: ${color("on-info")};
  border-radius: ${radius};
}`;
    }
    if (tab === "overlays") {
      return `.${cssName}-dialog {
  background: ${color("surface")};
  color: ${color("text-primary")};
  border: 1px solid ${color("border")};
}

.${cssName}-toast {
  background: ${color("success")};
  color: ${color("on-success")};
}`;
    }
    return `.${cssName}-button {
  background: ${buttonBackground};
  color: ${buttonForeground};
  min-height: ${COMPONENT_KIT_SIZE_VALUES[size].height};
  padding: ${COMPONENT_KIT_SIZE_VALUES[size].padding};
}`;
  }

  if (format === "tailwind") {
    if (tab === "forms") {
      return `<input className="w-full rounded-[${radius}] border px-3 py-2 text-sm" style={{ backgroundColor: "${color("surface")}", borderColor: "${color("border")}", color: "${color("text-primary")}" }} />`;
    }
    if (tab === "feedback") {
      return `<div role="status" className="rounded-[${radius}] border px-3 py-2 text-sm" style={{ backgroundColor: "${color("info")}", color: "${color("on-info")}" }}>Draft saved</div>`;
    }
    if (tab === "overlays") {
      return `<div role="dialog" className="rounded-[${radius}] border p-5 shadow-xl" style={{ backgroundColor: "${color("surface")}", color: "${color("text-primary")}", borderColor: "${color("border")}" }}>Dialog content</div>`;
    }
    return `<button className="inline-flex min-h-[${COMPONENT_KIT_SIZE_VALUES[size].height}] items-center rounded-[${radius}] px-[${COMPONENT_KIT_SIZE_VALUES[size].padding.split(" ")[1]}] text-sm font-semibold" style={{ backgroundColor: "${buttonBackground}", color: "${buttonForeground}" }}>Primary action</button>`;
  }

  if (tab === "forms") {
    return `export function ${reactName}Input() {
  return <input style={{ backgroundColor: "${color("surface")}", borderColor: "${color("border")}", color: "${color("text-primary")}", borderRadius: "${radius}" }} />;
}`;
  }
  if (tab === "feedback") {
    return `export function ${reactName}Alert() {
  return <div role="status" style={{ backgroundColor: "${color("info")}", color: "${color("on-info")}", borderRadius: "${radius}" }}>Draft saved</div>;
}`;
  }
  if (tab === "overlays") {
    return `export function ${reactName}Dialog() {
  return <div role="dialog" aria-modal="true" style={{ backgroundColor: "${color("surface")}", color: "${color("text-primary")}", borderColor: "${color("border")}" }}>Dialog content</div>;
}`;
  }
  return `export function ${reactName}Button() {
  return <button style={{ backgroundColor: "${buttonBackground}", color: "${buttonForeground}", minHeight: "${COMPONENT_KIT_SIZE_VALUES[size].height}", padding: "${COMPONENT_KIT_SIZE_VALUES[size].padding}", borderRadius: "${radius}" }}>Primary action</button>;
}`;
}
