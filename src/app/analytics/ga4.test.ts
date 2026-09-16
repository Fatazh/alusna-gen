import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resolveGa4MeasurementId } from "./ga4Config";
import { APP_EVENTS } from "../../shared/config/brand";
import type * as Ga4Module from "./ga4";
import type * as ConsentModule from "./consent";

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

type GtagArgs = [string, string?, Record<string, unknown>?];

function gtagCalls(): GtagArgs[] {
  return (window.dataLayer ?? []) as GtagArgs[];
}

function pageViewEvent(path: string): CustomEvent<{
  name: "page_view";
  pagePath: string;
  pageKind: "tool";
}> {
  return new CustomEvent(APP_EVENTS.analytics, {
    detail: { name: "page_view", pagePath: path, pageKind: "tool" },
  });
}

describe("resolveGa4MeasurementId", () => {
  it("accepts well-formed G- measurement IDs and trims them", () => {
    expect(resolveGa4MeasurementId("G-ABCDEF1234")).toBe("G-ABCDEF1234");
    expect(resolveGa4MeasurementId("  g-abcdef1234  ")).toBe("g-abcdef1234");
  });

  it("rejects placeholders and malformed IDs so the script never loads", () => {
    expect(resolveGa4MeasurementId(undefined)).toBeNull();
    expect(resolveGa4MeasurementId("")).toBeNull();
    expect(resolveGa4MeasurementId("G-")).toBeNull();
    expect(resolveGa4MeasurementId("G-1")).toBeNull();
    expect(resolveGa4MeasurementId("XXXX-XXXXXX")).toBeNull();
    expect(resolveGa4MeasurementId("G-ABCDE 1234")).toBeNull();
  });
});

describe("GA4 gating", () => {
  let ga4: typeof Ga4Module;
  let consent: typeof ConsentModule;

  beforeEach(async () => {
    // ga4.ts keeps a module-level "initialized" flag; reset modules so every
    // scenario boots from a clean slate.
    vi.resetModules();
    const localStorage = new MemoryStorage();
    const documentStub = {
      querySelector: () => null,
      createElement: () => ({}) as HTMLScriptElement,
      head: { appendChild: () => undefined },
    };
    vi.stubGlobal("window", {
      dataLayer: [] as unknown[],
      localStorage,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      document: documentStub,
    });
    vi.stubGlobal("document", documentStub);
    ga4 = await import("./ga4");
    consent = await import("./consent");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("treats GA4 as unconfigured without a valid measurement ID", () => {
    vi.stubEnv("VITE_GA4_ID", "placeholder");
    vi.stubEnv("VITE_ANALYTICS_ENABLED", "true");

    expect(ga4.isGa4Configured()).toBe(false);
    ga4.initGa4();
    expect(gtagCalls()).toEqual([]);
  });

  it("never boots GA4 while the master switch is off, even with consent granted", () => {
    vi.stubEnv("VITE_GA4_ID", "G-ABCDEF1234");
    vi.stubEnv("VITE_ANALYTICS_ENABLED", "false");
    consent.writeAnalyticsConsent("granted");

    expect(ga4.isGa4Configured()).toBe(true);
    ga4.initGa4();
    expect(gtagCalls()).toEqual([]);
  });

  it("never boots GA4 without a consent grant, even when fully configured", () => {
    vi.stubEnv("VITE_GA4_ID", "G-ABCDEF1234");
    vi.stubEnv("VITE_ANALYTICS_ENABLED", "true");

    ga4.initGa4();
    expect(gtagCalls()).toEqual([]);

    consent.writeAnalyticsConsent("denied");
    ga4.initGa4();
    expect(gtagCalls()).toEqual([]);
  });

  it("declares denied Consent Mode v2 signals before any configuration", () => {
    vi.stubEnv("VITE_GA4_ID", "G-ABCDEF1234");
    vi.stubEnv("VITE_ANALYTICS_ENABLED", "true");
    consent.writeAnalyticsConsent("granted");

    ga4.initGa4();

    expect(gtagCalls()[0]).toEqual([
      "consent",
      "default",
      {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      },
    ]);
    expect(gtagCalls()[2]?.[0]).toBe("config");
  });

  it("forwards consented internal page views and nothing else", () => {
    vi.stubEnv("VITE_GA4_ID", "G-ABCDEF1234");
    vi.stubEnv("VITE_ANALYTICS_ENABLED", "true");
    consent.writeAnalyticsConsent("granted");

    const disconnect = ga4.connectGa4Forwarder();
    const listener = vi
      .mocked(window.addEventListener)
      .mock.calls.find(([eventName]) => eventName === APP_EVENTS.analytics)?.[1] as
      EventListener | undefined;
    expect(listener).toBeTypeOf("function");

    listener?.(pageViewEvent("/contrast-checker"));
    const pageView = gtagCalls().find(([name]) => name === "event");
    expect(pageView).toEqual([
      "event",
      "page_view",
      {
        page_path: "/contrast-checker",
        page_title: "ALUSNA — tool",
        send_page_view: false,
      },
    ]);

    disconnect();
    expect(
      vi
        .mocked(window.removeEventListener)
        .mock.calls.some(([eventName]) => eventName === APP_EVENTS.analytics),
    ).toBe(true);
  });

  it("drops internal page views until consent is granted, and after consent is cleared", () => {
    vi.stubEnv("VITE_GA4_ID", "G-ABCDEF1234");
    vi.stubEnv("VITE_ANALYTICS_ENABLED", "true");

    const disconnect = ga4.connectGa4Forwarder();
    const listener = vi
      .mocked(window.addEventListener)
      .mock.calls.find(([eventName]) => eventName === APP_EVENTS.analytics)?.[1] as EventListener;
    const eventCalls = () => gtagCalls().filter(([name]) => name === "event");

    listener?.(pageViewEvent("/color-mixer"));
    expect(eventCalls()).toEqual([]);

    // Simulate the banner decision: only recordAnalyticsConsent notifies the
    // forwarder, which boots GA4 for the rest of the session.
    consent.recordAnalyticsConsent("granted");
    listener?.(pageViewEvent("/color-mixer"));
    expect(eventCalls()).toHaveLength(1);

    consent.clearAnalyticsConsent();
    listener?.(pageViewEvent("/color-mixer"));
    expect(eventCalls()).toHaveLength(1);

    disconnect();
  });
});
