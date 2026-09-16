import { beforeEach, describe, expect, it, vi } from "vitest";
import { ALUSNA_STUDIO_STORAGE_KEY, LEGACY_STUDIO_STORAGE_KEY } from "../migrations/studioStorage";
import { createAsyncStudioStateStorage } from "./studioStateStorageAsync";
import { idbGet, idbSet } from "./idb";

const idbStore = vi.hoisted(() => new Map<string, string>());

vi.mock("./idb", () => ({
  STUDIO_IDB_KEY: "state",
  idbGet: vi.fn((key: string) => Promise.resolve(idbStore.get(key) ?? null)),
  idbSet: vi.fn((key: string, value: string) => {
    idbStore.set(key, value);
    return Promise.resolve();
  }),
  idbDel: vi.fn((key: string) => {
    idbStore.delete(key);
    return Promise.resolve();
  }),
}));

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

const legacyCikpValue = JSON.stringify({ state: { theme: "light" }, version: 0 });
const syncAlusnaValue = JSON.stringify({ state: { theme: "dark" }, version: 1 });

describe("createAsyncStudioStateStorage", () => {
  beforeEach(() => idbStore.clear());

  it("imports sanitized legacy CIKP data into IndexedDB and keeps the rollback copy", async () => {
    const storage = new MemoryStorage();
    storage.setItem(LEGACY_STUDIO_STORAGE_KEY, legacyCikpValue);
    const adapter = createAsyncStudioStateStorage(storage);

    const migrated = await adapter.getItem(ALUSNA_STUDIO_STORAGE_KEY);

    expect(JSON.parse(String(migrated))).toEqual({ state: { theme: "light" }, version: 1 });
    expect(idbStore.get("state")).toBe(migrated);
    expect(storage.getItem(LEGACY_STUDIO_STORAGE_KEY)).toBe(legacyCikpValue);
  });

  it("imports a valid synchronous ALUSNA target into IndexedDB on first run", async () => {
    const storage = new MemoryStorage();
    storage.setItem(ALUSNA_STUDIO_STORAGE_KEY, syncAlusnaValue);
    const adapter = createAsyncStudioStateStorage(storage);

    const imported = await adapter.getItem(ALUSNA_STUDIO_STORAGE_KEY);

    expect(imported).toBe(syncAlusnaValue);
    expect(idbStore.get("state")).toBe(syncAlusnaValue);
  });

  it("serves subsequent reads from IndexedDB without re-importing", async () => {
    const storage = new MemoryStorage();
    storage.setItem(ALUSNA_STUDIO_STORAGE_KEY, syncAlusnaValue);
    const adapter = createAsyncStudioStateStorage(storage);
    await adapter.getItem(ALUSNA_STUDIO_STORAGE_KEY);

    idbStore.set("state", JSON.stringify({ state: { theme: "light" }, version: 1 }));
    expect(await adapter.getItem(ALUSNA_STUDIO_STORAGE_KEY)).toBe(
      JSON.stringify({ state: { theme: "light" }, version: 1 }),
    );
  });

  it("fails closed when the synchronous target is corrupt", async () => {
    const storage = new MemoryStorage();
    storage.setItem(ALUSNA_STUDIO_STORAGE_KEY, "corrupt");
    const adapter = createAsyncStudioStateStorage(storage);

    expect(await adapter.getItem(ALUSNA_STUDIO_STORAGE_KEY)).toBeNull();
    expect(idbStore.has("state")).toBe(false);
  });

  it("falls back to the synchronous copy when IndexedDB is unavailable", async () => {
    const storage = new MemoryStorage();
    storage.setItem(ALUSNA_STUDIO_STORAGE_KEY, syncAlusnaValue);
    vi.mocked(idbGet).mockRejectedValueOnce(new Error("IndexedDB unavailable"));
    const adapter = createAsyncStudioStateStorage(storage);

    expect(await adapter.getItem(ALUSNA_STUDIO_STORAGE_KEY)).toBe(syncAlusnaValue);
  });

  it("reports write failures once and keeps the app usable", async () => {
    const storage = new MemoryStorage();
    const onStorageError = vi.fn();
    const adapter = createAsyncStudioStateStorage(storage, onStorageError);
    vi.mocked(idbSet).mockRejectedValueOnce(new Error("quota"));

    await adapter.setItem(ALUSNA_STUDIO_STORAGE_KEY, syncAlusnaValue);
    await adapter.setItem(ALUSNA_STUDIO_STORAGE_KEY, syncAlusnaValue);

    expect(onStorageError).toHaveBeenCalledTimes(1);
  });

  it("passes non-studio keys through to the synchronous storage", async () => {
    const storage = new MemoryStorage();
    const adapter = createAsyncStudioStateStorage(storage);

    await adapter.setItem("other-key", "value");
    expect(storage.getItem("other-key")).toBe("value");
    expect(await adapter.getItem("other-key")).toBe("value");
    await adapter.removeItem("other-key");
    expect(storage.getItem("other-key")).toBeNull();
  });
});
