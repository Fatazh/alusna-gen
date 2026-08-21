import { APP_EVENTS } from "../../shared/config/brand";
import { type SeoPage } from "../router/routes";

export type AnalyticsEvent = {
  name: "page_view";
  pageKind: SeoPage["kind"];
  pagePath: string;
};

export function isAnalyticsEnabled(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === "true";
}

export function createPageViewEvent(page: SeoPage): AnalyticsEvent {
  return {
    name: "page_view",
    pageKind: page.kind,
    pagePath: page.path,
  };
}

export function emitAnalyticsEvent(event: AnalyticsEvent): void {
  if (!isAnalyticsEnabled(import.meta.env.VITE_ANALYTICS_ENABLED)) return;

  window.dispatchEvent(
    new CustomEvent<AnalyticsEvent>(APP_EVENTS.analytics, {
      detail: event,
    }),
  );
}
