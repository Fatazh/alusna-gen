import type { DesignSystem } from "./designSystem";

// Keep layout measurements in the generated kit tied to the same spacing scale as the export.
export function getComponentKitSpacing(system: DesignSystem) {
  const value = (name: string) => {
    const token = system.spacing.find((item) => item.name === name);
    if (!token) throw new Error(`Unknown design-system spacing token: ${name}`);
    return token.value;
  };

  return {
    previewPadding: value("4"),
    sectionGap: value("4"),
    controlGap: value("2"),
    inlineGap: value("1.5"),
    fieldPaddingX: value("3"),
    fieldPaddingY: value("2"),
    badgePaddingX: value("2"),
    badgePaddingY: value("1"),
    tabPaddingX: value("3"),
    tabPaddingY: value("2"),
    buttonPaddingX: {
      sm: value("2"),
      md: value("3"),
      lg: value("4"),
    },
    buttonPaddingY: {
      sm: value("1"),
      md: value("2"),
      lg: value("3"),
    },
  };
}
