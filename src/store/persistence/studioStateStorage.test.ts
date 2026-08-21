import { describe, expect, it, vi } from "vitest";
import { ALUSNA_STUDIO_STORAGE_KEY, LEGACY_STUDIO_STORAGE_KEY } from "../migrations/studioStorage";
import { createStudioStateStorage } from "./studioStateStorage";

class MemoryStorage {
  readonly values = new Map<string, string>();
  getItem(name: string) {
    return this.values.get(name) ?? null;
  }
  setItem(name: string, value: string) {
    this.values.set(name, value);
  }
  removeItem(name: string) {
    this.values.delete(name);
  }
}

const legacyValue = JSON.stringify({ state: { theme: "light" }, version: 0 });

describe("createStudioStateStorage", () => {
  it("copies sanitized legacy data to the target key and keeps the legacy key", () => {
    const storage = new MemoryStorage();
    storage.setItem(LEGACY_STUDIO_STORAGE_KEY, legacyValue);
    const adapter = createStudioStateStorage(storage);

    const migrated = adapter.getItem(ALUSNA_STUDIO_STORAGE_KEY);

    expect(migrated).toBe(storage.getItem(ALUSNA_STUDIO_STORAGE_KEY));
    expect(JSON.parse(String(migrated))).toEqual({ state: { theme: "light" }, version: 1 });
    expect(storage.getItem(LEGACY_STUDIO_STORAGE_KEY)).toBe(legacyValue);
  });

  it("keeps a valid target and does not overwrite it", () => {
    const storage = new MemoryStorage();
    const target = JSON.stringify({ state: { theme: "dark" }, version: 1 });
    storage.setItem(ALUSNA_STUDIO_STORAGE_KEY, target);
    storage.setItem(LEGACY_STUDIO_STORAGE_KEY, legacyValue);

    expect(createStudioStateStorage(storage).getItem(ALUSNA_STUDIO_STORAGE_KEY)).toBe(target);
  });

  it("fails closed when a present target is corrupt", () => {
    const storage = new MemoryStorage();
    storage.setItem(ALUSNA_STUDIO_STORAGE_KEY, "corrupt");
    storage.setItem(LEGACY_STUDIO_STORAGE_KEY, legacyValue);

    expect(createStudioStateStorage(storage).getItem(ALUSNA_STUDIO_STORAGE_KEY)).toBeNull();
    expect(storage.getItem(ALUSNA_STUDIO_STORAGE_KEY)).toBe("corrupt");
  });

  it("reports storage failures once and keeps the app usable", () => {
    const storage = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("denied");
      },
      removeItem: () => {
        throw new Error("denied");
      },
    };
    const onError = vi.fn();
    const adapter = createStudioStateStorage(storage, onError);

    expect(adapter.getItem(ALUSNA_STUDIO_STORAGE_KEY)).toBeNull();
    adapter.setItem(ALUSNA_STUDIO_STORAGE_KEY, "value");
    adapter.removeItem(ALUSNA_STUDIO_STORAGE_KEY);
    expect(onError).toHaveBeenCalledTimes(1);
  });
});
