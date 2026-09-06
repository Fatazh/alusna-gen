import { describe, expect, it } from "vitest";
import {
  DESIGN_SYSTEM_DRAFT_KEY,
  clearDesignSystemDraft,
  readDesignSystemDraft,
  writeDesignSystemDraft,
  type DesignSystemDraft,
} from "./draftStorage";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() {
    return this.values.size;
  }
  clear() {
    this.values.clear();
  }
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe("Design System draft storage", () => {
  it("round-trips a sanitized session draft", () => {
    const storage = new MemoryStorage();
    const draft: DesignSystemDraft = {
      name: "product-ui",
      mode: "dark",
      spacingBase: 6,
      radiusBase: 12,
      exportFormat: "tailwind",
    };
    writeDesignSystemDraft(draft, storage);
    expect(storage.getItem(DESIGN_SYSTEM_DRAFT_KEY)).toBeTruthy();
    expect(readDesignSystemDraft(storage)).toEqual(draft);
  });

  it("clamps invalid values and fails closed on corrupt data", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      DESIGN_SYSTEM_DRAFT_KEY,
      JSON.stringify({ name: "../../evil", mode: "wat", spacingBase: 99, radiusBase: -2 }),
    );
    expect(readDesignSystemDraft(storage)).toMatchObject({
      name: "evil",
      mode: "light",
      spacingBase: 8,
      radiusBase: 0,
      exportFormat: "css",
    });
    storage.setItem(DESIGN_SYSTEM_DRAFT_KEY, "not-json");
    expect(readDesignSystemDraft(storage)).toBeNull();
  });

  it("can clear a draft without throwing", () => {
    const storage = new MemoryStorage();
    writeDesignSystemDraft(
      { name: "brand", mode: "light", spacingBase: 4, radiusBase: 8, exportFormat: "css" },
      storage,
    );
    clearDesignSystemDraft(storage);
    expect(readDesignSystemDraft(storage)).toBeNull();
  });
});
