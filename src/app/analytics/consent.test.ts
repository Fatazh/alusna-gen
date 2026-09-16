import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  hasStoredConsent,
  readAnalyticsConsent,
  recordAnalyticsConsent,
  subscribeToConsent,
  writeAnalyticsConsent,
} from "./consent";

class MemoryStorage {
  private readonly values = new Map<string, string>();
  getItem(name: string): string | null {
    return this.values.get(name) ?? null;
  }
  setItem(name: string, value: string): void {
    this.values.set(name, value);
  }
  removeItem(name: string): void {
    this.values.delete(name);
  }
}

function installWindow(storage: unknown): void {
  vi.stubGlobal("window", storage ? { localStorage: storage } : {});
}

describe("analytics consent store", () => {
  beforeEach(() => {
    installWindow(new MemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reports no decision before the visitor chooses", () => {
    expect(readAnalyticsConsent()).toBeNull();
    expect(hasStoredConsent()).toBe(false);
  });

  it("persists and reads an explicit decision", () => {
    expect(writeAnalyticsConsent("granted")).toBe(true);
    expect(readAnalyticsConsent()).toBe("granted");
    expect(hasStoredConsent()).toBe(true);

    expect(writeAnalyticsConsent("denied")).toBe(true);
    expect(readAnalyticsConsent()).toBe("denied");
  });

  it("fails closed on corrupted or unknown stored values", () => {
    window.localStorage.setItem("alusna:analytics-consent", "maybe");
    expect(readAnalyticsConsent()).toBeNull();
    expect(hasStoredConsent()).toBe(false);
  });

  it("fails closed when storage is unusable", () => {
    installWindow({
      localStorage: {
        getItem: () => null,
        setItem: () => {
          throw new Error("blocked");
        },
        removeItem: () => undefined,
      },
    });

    expect(readAnalyticsConsent()).toBeNull();
    expect(writeAnalyticsConsent("granted")).toBe(false);
    expect(hasStoredConsent()).toBe(false);
  });

  it("notifies subscribers exactly once per recorded decision", () => {
    const seen: string[] = [];
    const unsubscribe = subscribeToConsent((consent) => seen.push(consent));

    recordAnalyticsConsent("granted");
    recordAnalyticsConsent("denied");
    unsubscribe();
    recordAnalyticsConsent("granted");

    expect(seen).toEqual(["granted", "denied"]);
  });
});
