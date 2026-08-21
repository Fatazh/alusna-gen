import { rgbToHex } from "../../color";
import { type DesignSystem } from "../model/designSystem";

// ---------------------------------------------------------------------------
// Export formats
// ---------------------------------------------------------------------------

export function toCssVariables(ds: DesignSystem): string {
  const lines: string[] = [":root {", "  /* ── Colors ── */"];
  ds.colors.forEach((c) => {
    const varName = `--${ds.name}-${c.role.toLowerCase().replace(/\s+/g, "-")}`;
    lines.push(`  ${varName}: ${c.hex};`);
  });
  lines.push("");
  lines.push("  /* ── Shade scale ── */");
  ds.shades.forEach((s) => {
    lines.push(`  --${ds.name}-${s.step}: ${rgbToHex(s.rgb)};`);
  });
  lines.push("");
  lines.push("  /* ── Typography ── */");
  ds.typography.forEach((t) => {
    const prefix = `--${ds.name}-text-${t.name.toLowerCase().replace(/\s+/g, "-")}`;
    lines.push(`  ${prefix}-size: ${t.size};`);
    lines.push(`  ${prefix}-line-height: ${t.lineHeight};`);
    lines.push(`  ${prefix}-weight: ${t.fontWeight};`);
  });
  lines.push("");
  lines.push("  /* ── Spacing ── */");
  ds.spacing.forEach((s) => {
    lines.push(`  --${ds.name}-space-${s.name}: ${s.value};`);
  });
  lines.push("");
  lines.push("  /* ── Border Radius ── */");
  ds.radius.forEach((r) => {
    lines.push(`  --${ds.name}-radius-${r.name}: ${r.value};`);
  });
  lines.push("");
  lines.push("  /* ── Shadows ── */");
  ds.shadows.forEach((s) => {
    lines.push(`  --${ds.name}-shadow-${s.name}: ${s.css};`);
  });
  lines.push("}");
  return lines.join("\n");
}

export function toTailwindConfig(ds: DesignSystem): string {
  const colorObj: Record<string, string> = {};
  ds.colors.forEach((c) => {
    const key = c.role.toLowerCase().replace(/\s+/g, "-");
    colorObj[key] = c.hex;
  });

  const shadeObj: Record<string, string> = {};
  ds.shades.forEach((s) => {
    shadeObj[s.step] = rgbToHex(s.rgb);
  });

  const spacingObj: Record<string, string> = {};
  ds.spacing.forEach((s) => {
    spacingObj[s.name] = s.value;
  });

  const radiusObj: Record<string, string> = {};
  ds.radius.forEach((r) => {
    radiusObj[r.name] = r.value;
  });

  const config = {
    theme: {
      extend: {
        colors: {
          [ds.name]: colorObj,
          [`${ds.name}-shade`]: shadeObj,
        },
        spacing: spacingObj,
        borderRadius: radiusObj,
        boxShadow: Object.fromEntries(ds.shadows.map((s) => [s.name, s.css])),
      },
    },
  };

  return `// tailwind.config.js\nexport default ${JSON.stringify(config, null, 2)};`;
}

export function toJsonTokens(ds: DesignSystem): string {
  const tokens: Record<string, unknown> = {
    [ds.name]: {
      color: Object.fromEntries(
        ds.colors.map((c) => [
          c.role.toLowerCase().replace(/\s+/g, "-"),
          { $type: "color", $value: c.hex, $description: c.usage },
        ]),
      ),
      shade: Object.fromEntries(
        ds.shades.map((s) => [String(s.step), { $type: "color", $value: rgbToHex(s.rgb) }]),
      ),
      typography: Object.fromEntries(
        ds.typography.map((t) => [
          t.name.toLowerCase().replace(/\s+/g, "-"),
          {
            $type: "typography",
            $value: {
              fontSize: t.size,
              lineHeight: t.lineHeight,
              fontWeight: t.fontWeight,
            },
            $description: t.usage,
          },
        ]),
      ),
      spacing: Object.fromEntries(
        ds.spacing.map((s) => [
          s.name,
          { $type: "dimension", $value: s.value, $description: s.usage },
        ]),
      ),
      radius: Object.fromEntries(
        ds.radius.map((r) => [
          r.name,
          { $type: "dimension", $value: r.value, $description: r.usage },
        ]),
      ),
      shadow: Object.fromEntries(
        ds.shadows.map((s) => [s.name, { $type: "shadow", $value: s.css, $description: s.usage }]),
      ),
    },
  };
  return JSON.stringify(tokens, null, 2);
}

export function toReactNativeTheme(ds: DesignSystem): string {
  const colors: Record<string, string> = {};
  ds.colors.forEach((c) => {
    colors[c.role.toLowerCase().replace(/\s+/g, "_")] = c.hex;
  });

  const theme = {
    colors,
    typography: Object.fromEntries(
      ds.typography.map((t) => [
        t.name.toLowerCase().replace(/\s+/g, "_"),
        {
          fontSize: parseFloat(t.size) * 16,
          lineHeight: parseFloat(t.lineHeight) * parseFloat(t.size) * 16,
          fontWeight: String(t.fontWeight),
        },
      ]),
    ),
    spacing: Object.fromEntries(ds.spacing.map((s) => [s.name, s.px])),
    borderRadius: Object.fromEntries(
      ds.radius.map((r) => [r.name, r.value === "9999px" ? 9999 : parseFloat(r.value) * 16]),
    ),
  };

  return `// theme.ts\nimport { DefaultTheme } from 'styled-components';\n\nexport const theme = ${JSON.stringify(theme, null, 2)} as const;\n\nexport type AppTheme = typeof theme;`;
}

export function toScssVariables(ds: DesignSystem): string {
  const lines: string[] = ["// ── Design System SCSS Variables ──", ""];

  lines.push("// Colors");
  ds.colors.forEach((c) => {
    const varName = `$${ds.name}-${c.role.toLowerCase().replace(/\s+/g, "-")}`;
    lines.push(`${varName}: ${c.hex};`);
  });

  lines.push("");
  lines.push("// Shade scale");
  ds.shades.forEach((s) => {
    lines.push(`$${ds.name}-${s.step}: ${rgbToHex(s.rgb)};`);
  });

  lines.push("");
  lines.push("// Typography");
  ds.typography.forEach((t) => {
    const prefix = `$${ds.name}-text-${t.name.toLowerCase().replace(/\s+/g, "-")}`;
    lines.push(`${prefix}-size: ${t.size};`);
    lines.push(`${prefix}-line-height: ${t.lineHeight};`);
    lines.push(`${prefix}-weight: ${t.fontWeight};`);
  });

  lines.push("");
  lines.push("// Spacing");
  ds.spacing.forEach((s) => {
    lines.push(`$${ds.name}-space-${s.name}: ${s.value};`);
  });

  lines.push("");
  lines.push("// Border Radius");
  ds.radius.forEach((r) => {
    lines.push(`$${ds.name}-radius-${r.name}: ${r.value};`);
  });

  lines.push("");
  lines.push("// Shadows");
  ds.shadows.forEach((s) => {
    lines.push(`$${ds.name}-shadow-${s.name}: ${s.css};`);
  });

  return lines.join("\n");
}

export type ExportFormat = "css" | "tailwind" | "json" | "react-native" | "scss";

export function exportDesignSystem(ds: DesignSystem, format: ExportFormat): string {
  switch (format) {
    case "css":
      return toCssVariables(ds);
    case "tailwind":
      return toTailwindConfig(ds);
    case "json":
      return toJsonTokens(ds);
    case "react-native":
      return toReactNativeTheme(ds);
    case "scss":
      return toScssVariables(ds);
  }
}
