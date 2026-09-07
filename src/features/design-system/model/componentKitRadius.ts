import type { DesignSystem } from "./designSystem";

// Preview and handoff share these roles; control size does not change corner radius.
export function getComponentKitRadii(system: DesignSystem) {
  const value = (name: string) => {
    const token = system.radius.find((item) => item.name === name);
    if (!token) throw new Error(`Unknown design-system radius token: ${name}`);
    return token.value;
  };

  return {
    button: value("md"),
    field: value("sm"),
    badge: value("sm"),
    panel: value("lg"),
    alert: value("lg"),
    dialog: value("xl"),
    pill: value("full"),
  };
}
