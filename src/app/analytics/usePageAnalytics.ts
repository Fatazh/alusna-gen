import { useEffect } from "react";
import { type MetadataPage } from "../router/routes";
import { createPageViewEvent, emitAnalyticsEvent } from "./analytics";

export function usePageAnalytics(page: MetadataPage): void {
  useEffect(() => {
    emitAnalyticsEvent(createPageViewEvent(page));
  }, [page]);
}
