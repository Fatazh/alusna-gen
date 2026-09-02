import { type DesignSystem } from "../model/designSystem";
import { EXPORT_FILE_META, exportDesignSystem, type ExportFormat } from "./serializers";

export type DesignSystemExportFile = {
  filename: string;
  mime: string;
  content: string;
};

export function createDesignSystemExportFile(
  system: DesignSystem,
  format: ExportFormat,
): DesignSystemExportFile {
  const metadata = EXPORT_FILE_META[format];
  const modeSuffix = system.mode === "light" ? "" : `-${system.mode}`;
  return {
    filename: `${system.name}${modeSuffix}.${metadata.extension}`,
    mime: metadata.mime,
    content: exportDesignSystem(system, format),
  };
}

export function downloadDesignSystemExport(system: DesignSystem, format: ExportFormat): void {
  const file = createDesignSystemExportFile(system, format);
  const url = URL.createObjectURL(new Blob([file.content], { type: `${file.mime};charset=utf-8` }));
  const link = document.createElement("a");
  link.href = url;
  link.download = file.filename;
  link.click();
  URL.revokeObjectURL(url);
}
