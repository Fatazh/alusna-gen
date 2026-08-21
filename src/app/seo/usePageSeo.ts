import { useEffect } from "react";
import { type SeoPage } from "../router/routes";
import { applyPageMetadata } from "./pageMetadata";

export function usePageSeo(page: SeoPage): void {
  useEffect(() => {
    applyPageMetadata(page);
  }, [page]);
}
