import { describe, expect, it } from "vitest";
import {
  ALUSNA_STUDIO_STORAGE_VERSION,
  MAX_STUDIO_STORAGE_LENGTH,
  planStudioStorageMigration,
} from "./studioStorage";

const validLegacy = JSON.stringify({
  state: {
    theme: "light",
    savedColors: [{ id: "color-1", name: "  Primary  ", rgb: { r: 20, g: 40, b: 60 } }],
    ignoredInternalValue: "drop-me",
  },
  version: 0,
});

describe("planStudioStorageMigration", () => {
  it("migrates and sanitizes recognized legacy state", () => {
    const plan = planStudioStorageMigration(null, validLegacy);

    expect(plan.action).toBe("write-target");
    if (plan.action !== "write-target") throw new Error("Expected a target write");

    const migrated = JSON.parse(plan.value);
    expect(migrated.version).toBe(ALUSNA_STUDIO_STORAGE_VERSION);
    expect(migrated.state).toEqual({
      theme: "light",
      savedColors: [{ id: "color-1", name: "Primary", rgb: { r: 20, g: 40, b: 60 } }],
    });
  });

  it("does nothing when legacy data is missing", () => {
    expect(planStudioStorageMigration(null, null)).toEqual({
      action: "none",
      reason: "legacy-missing",
    });
  });

  it.each(["not-json", "{}", '{"state":"invalid"}'])(
    "rejects corrupt legacy data: %s",
    (legacy) => {
      expect(planStudioStorageMigration(null, legacy)).toEqual({
        action: "none",
        reason: "legacy-invalid",
      });
    },
  );

  it("rejects oversized legacy data before parsing", () => {
    const oversized = "x".repeat(MAX_STUDIO_STORAGE_LENGTH + 1);
    expect(planStudioStorageMigration(null, oversized)).toEqual({
      action: "none",
      reason: "legacy-invalid",
    });
  });

  it("keeps a valid target instead of overwriting it with legacy data", () => {
    const target = JSON.stringify({
      state: { theme: "dark" },
      version: ALUSNA_STUDIO_STORAGE_VERSION,
    });

    expect(planStudioStorageMigration(target, validLegacy)).toEqual({ action: "keep-target" });
  });

  it("does not overwrite a present but unparseable target", () => {
    expect(planStudioStorageMigration("corrupt", validLegacy)).toEqual({
      action: "none",
      reason: "target-invalid",
    });
  });

  it("adopts recognizable state from a newer-version target instead of discarding it", () => {
    const v2 = JSON.stringify({
      state: {
        theme: "dark",
        savedColors: [{ id: "c1", name: "Ink", rgb: { r: 1, g: 2, b: 3 } }],
        futureField: { unknown: true },
      },
      version: 2,
    });
    const plan = planStudioStorageMigration(v2, null);
    expect(plan.action).toBe("write-target");
    if (plan.action !== "write-target") throw new Error("Expected a target write");
    const migrated = JSON.parse(plan.value);
    expect(migrated.version).toBe(ALUSNA_STUDIO_STORAGE_VERSION);
    expect(migrated.state).toEqual({
      theme: "dark",
      savedColors: [{ id: "c1", name: "Ink", rgb: { r: 1, g: 2, b: 3 } }],
    });
  });

  it("adopts unversioned-but-valid target state as well", () => {
    const noVersion = JSON.stringify({ state: { theme: "dark" } });
    const plan = planStudioStorageMigration(noVersion, null);
    expect(plan.action).toBe("write-target");
  });

  it("still rejects version-mismatched targets with no recognizable state", () => {
    const emptyV2 = JSON.stringify({ state: { activeModule: "color" }, version: 2 });
    expect(planStudioStorageMigration(emptyV2, null)).toEqual({
      action: "none",
      reason: "target-invalid",
    });
  });

  it("keeps migration idempotent after adopting a mismatched target", () => {
    const v2 = JSON.stringify({ state: { theme: "dark" }, version: 2 });
    const first = planStudioStorageMigration(v2, null);
    if (first.action !== "write-target") throw new Error("Expected a target write");
    expect(planStudioStorageMigration(first.value, null)).toEqual({ action: "keep-target" });
  });

  it("is idempotent after applying the generated target value", () => {
    const first = planStudioStorageMigration(null, validLegacy);
    if (first.action !== "write-target") throw new Error("Expected a target write");

    expect(planStudioStorageMigration(first.value, validLegacy)).toEqual({
      action: "keep-target",
    });
  });
});
