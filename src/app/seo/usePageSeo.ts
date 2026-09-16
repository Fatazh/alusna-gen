import { useEffect } from "react";
import { type MetadataPage } from "../router/routes";
import { applyPageMetadata } from "./pageMetadata";

export function usePageSeo(page: MetadataPage): void {
  useEffect(() => {
    applyPageMetadata(page);
  }, [page]);
}
