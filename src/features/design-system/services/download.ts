import { type DesignSystem } from "../model/designSystem";
import { EXPORT_FILE_META, exportDesignSystem, type ExportFormat } from "./serializers";
import { downloadTextFile } from "../../../shared/services/download";

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
  downloadTextFile(file.content, file.filename, file.mime);
}
