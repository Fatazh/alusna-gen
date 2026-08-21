import { useEffect } from "react";
import { type SeoPage } from "../router/routes";
import { createPageViewEvent, emitAnalyticsEvent } from "./analytics";

export function usePageAnalytics(page: SeoPage): void {
  useEffect(() => {
    emitAnalyticsEvent(createPageViewEvent(page));
  }, [page]);
}
