import { useEffect } from "react";
import { type AnalyticsEvent, isAnalyticsEnabled } from "./analytics";
import { readAnalyticsConsent, subscribeToConsent, type AnalyticsConsent } from "./consent";
import { resolveGa4MeasurementId } from "./ga4Config";
import { APP_BRAND, APP_EVENTS } from "../../shared/config/brand";

const GA_SRC = "https://www.googletagmanager.com/gtag/js";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function measurementIdFromEnv(): string | null {
  return resolveGa4MeasurementId(import.meta.env.VITE_GA4_ID);
}

export function isGa4Configured(): boolean {
  return measurementIdFromEnv() !== null;
}

function injectGaScript(id: string): void {
  if (document.querySelector(`script[src="${GA_SRC}"]`)) return;
  const script = document.createElement("script");
  script.src = `${GA_SRC}?id=${encodeURIComponent(id)}`;
  script.async = true;
  document.head.appendChild(script);
}

let initialized = false;

/**
 * Boots GA4 when, and only when, all gates pass:
 *   1. A valid VITE_GA4_ID is baked into the build.
 *   2. VITE_ANALYTICS_ENABLED=true (the existing master switch).
 *   3. The visitor has granted consent via the banner.
 *
 * Calls before all gates pass are cheap no-ops, so it is safe to invoke on
 * mount and on every consent flip.
 */
export function initGa4(): void {
  if (initialized) return;
  if (!isGa4Configured()) return;
  if (!isAnalyticsEnabled(import.meta.env.VITE_ANALYTICS_ENABLED)) return;
  if (readAnalyticsConsent() !== "granted") return;

  const id = measurementIdFromEnv();
  if (!id) return;

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  }

  // Consent Mode v2: signals are declared BEFORE the script loads so no
  // measurement request goes out without an explicit consent state.
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", id, {
    anonymize_ip: true,
    // Traffic without a consent grant never reaches this code path, but
    // cookieless pings for edge cases (e.g. consent restored later) stay off.
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  injectGaScript(id);
  initialized = true;
}

/**
 * Forwards an internal page_view onto the GA4 dataLayer.
 * Consent was already checked by the forwarder below.
 */
function sendPageView(event: AnalyticsEvent): void {
  window.gtag?.("event", "page_view", {
    page_path: event.pagePath,
    page_title: `${APP_BRAND.name} — ${event.pageKind}`,
    // SPA page views: prevent GA from double-counting the initial load.
    send_page_view: false,
  });
}

/**
 * App-lifetime hook: boots GA4 (if fully enabled) and forwards consent and
 * internal page_view events for the whole session. All gates inside stay
 * cheap no-ops while analytics is unconfigured or consent is missing.
 */
export function useGa4Forwarder(): void {
  useEffect(() => connectGa4Forwarder(), []);
}

/**
 * Wires the internal analytics event bus to GA4. Returns a cleanup function
 * (unused in production wiring, but keeps the module testable).
 */
export function connectGa4Forwarder(): () => void {
  initGa4();

  const onConsent = (consent: AnalyticsConsent): void => {
    if (consent === "granted") {
      initGa4();
      window.gtag?.("consent", "update", { analytics_storage: "granted" });
    }
  };
  const unsubscribe = subscribeToConsent(onConsent);

  const onAnalyticsEvent = (customEvent: Event): void => {
    if (!isGa4Configured()) return;
    if (readAnalyticsConsent() !== "granted") return;
    if (!initialized) return;
    const detail = (customEvent as CustomEvent<AnalyticsEvent>).detail;
    if (!detail || detail.name !== "page_view") return;
    sendPageView(detail);
  };
  window.addEventListener(APP_EVENTS.analytics, onAnalyticsEvent);

  return () => {
    unsubscribe();
    window.removeEventListener(APP_EVENTS.analytics, onAnalyticsEvent);
  };
}
