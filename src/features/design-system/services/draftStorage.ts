import { sanitizeTokenName, type ThemeMode } from "../model/designSystem";
import type { ExportFormat } from "./serializers";
import type { RGB } from "../../color";

export const DESIGN_SYSTEM_DRAFT_KEY = "alusna-design-system-draft-v1";

export type DesignSystemDraft = {
  name: string;
  mode: ThemeMode;
  spacingBase: number;
  radiusBase: number;
  exportFormat: ExportFormat;
  baseColor?: RGB;
};

const MODES = new Set<ThemeMode>(["light", "dark", "high-contrast"]);
const EXPORT_FORMATS = new Set<ExportFormat>(["css", "tailwind", "json", "react-native", "scss"]);

function getSessionStorage(storage?: Storage): Storage | null {
  if (storage) return storage;
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function boundedNumber(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function sanitizedRgb(value: unknown): RGB | undefined {
  if (!value || typeof value !== "object") return undefined;
  const channels = value as Record<string, unknown>;
  const channel = (input: unknown) =>
    typeof input === "number" && Number.isFinite(input)
      ? Math.min(255, Math.max(0, Math.round(input)))
      : null;
  const r = channel(channels.r);
  const g = channel(channels.g);
  const b = channel(channels.b);
  return r === null || g === null || b === null ? undefined : { r, g, b };
}

export function readDesignSystemDraft(storage?: Storage): DesignSystemDraft | null {
  const target = getSessionStorage(storage);
  if (!target) return null;
  try {
    const raw = target.getItem(DESIGN_SYSTEM_DRAFT_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const draft = value as Record<string, unknown>;
    const mode = MODES.has(draft.mode as ThemeMode) ? (draft.mode as ThemeMode) : "light";
    const exportFormat = EXPORT_FORMATS.has(draft.exportFormat as ExportFormat)
      ? (draft.exportFormat as ExportFormat)
      : "css";
    const baseColor = sanitizedRgb(draft.baseColor);
    return {
      name: sanitizeTokenName(typeof draft.name === "string" ? draft.name : "brand") || "brand",
      mode,
      spacingBase: boundedNumber(draft.spacingBase, 2, 8, 4),
      radiusBase: boundedNumber(draft.radiusBase, 0, 24, 8),
      exportFormat,
      ...(baseColor ? { baseColor } : {}),
    };
  } catch {
    return null;
  }
}

export function writeDesignSystemDraft(draft: DesignSystemDraft, storage?: Storage): void {
  const target = getSessionStorage(storage);
  if (!target) return;
  try {
    const baseColor = sanitizedRgb(draft.baseColor);
    target.setItem(
      DESIGN_SYSTEM_DRAFT_KEY,
      JSON.stringify({
        name: sanitizeTokenName(draft.name) || "brand",
        mode: MODES.has(draft.mode) ? draft.mode : "light",
        spacingBase: boundedNumber(draft.spacingBase, 2, 8, 4),
        radiusBase: boundedNumber(draft.radiusBase, 0, 24, 8),
        exportFormat: EXPORT_FORMATS.has(draft.exportFormat) ? draft.exportFormat : "css",
        ...(baseColor ? { baseColor } : {}),
      }),
    );
  } catch {
    // Session storage is optional; the editor remains fully usable when blocked.
  }
}

export function clearDesignSystemDraft(storage?: Storage): void {
  const target = getSessionStorage(storage);
  if (!target) return;
  try {
    target.removeItem(DESIGN_SYSTEM_DRAFT_KEY);
  } catch {
    // Ignore storage failures; clearing a draft is best effort.
  }
}
