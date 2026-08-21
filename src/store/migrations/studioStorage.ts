import { sanitizePersistedStudioState } from "../persistence/sanitizeStudioState";

export const LEGACY_STUDIO_STORAGE_KEY = "cikp-studio";
export const ALUSNA_STUDIO_STORAGE_KEY = "alusna-studio";
export const ALUSNA_STUDIO_STORAGE_VERSION = 1;
export const MAX_STUDIO_STORAGE_LENGTH = 12 * 1024 * 1024;

type PersistedEnvelope = {
  state: Record<string, unknown>;
  version?: number;
};

export type StudioStorageMigrationPlan =
  | { action: "keep-target" }
  | { action: "write-target"; value: string }
  | { action: "none"; reason: "target-invalid" | "legacy-missing" | "legacy-invalid" };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function parseEnvelope(raw: string | null): PersistedEnvelope | null {
  if (!raw || raw.length > MAX_STUDIO_STORAGE_LENGTH) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || !isRecord(parsed.state)) return null;
    return {
      state: parsed.state,
      ...(typeof parsed.version === "number" ? { version: parsed.version } : {}),
    };
  } catch {
    return null;
  }
}

function hasKnownPersistedField(state: Record<string, unknown>): boolean {
  return ["theme", "savedColors", "paletteLibrary", "savedBrandKits", "uploadedFonts"].some(
    (field) => Object.prototype.hasOwnProperty.call(state, field),
  );
}

export function planStudioStorageMigration(
  targetRaw: string | null,
  legacyRaw: string | null,
): StudioStorageMigrationPlan {
  if (targetRaw !== null) {
    const target = parseEnvelope(targetRaw);
    return target?.version === ALUSNA_STUDIO_STORAGE_VERSION
      ? { action: "keep-target" }
      : { action: "none", reason: "target-invalid" };
  }

  if (legacyRaw === null) return { action: "none", reason: "legacy-missing" };

  const legacy = parseEnvelope(legacyRaw);
  if (!legacy || !hasKnownPersistedField(legacy.state)) {
    return { action: "none", reason: "legacy-invalid" };
  }

  const sanitized = sanitizePersistedStudioState(legacy.state);
  if (Object.keys(sanitized).length === 0) {
    return { action: "none", reason: "legacy-invalid" };
  }

  return {
    action: "write-target",
    value: JSON.stringify({
      state: sanitized,
      version: ALUSNA_STUDIO_STORAGE_VERSION,
    }),
  };
}
