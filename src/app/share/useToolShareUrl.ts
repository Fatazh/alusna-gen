import { useStudio } from "../../store/studio";
import { type MetadataPage } from "../router/routes";
import {
  buildToolShareState,
  encodeToolShareState,
  MAX_SHARE_URL_LENGTH,
  type ToolShareState,
} from "../../shared/lib/toolShareState";

function collectShareState(page: MetadataPage): ToolShareState {
  const studio = useStudio.getState();
  const isTool = page.kind === "tool";
  const wantsColor = isTool && page.topTab === "color";
  const wantsFont = isTool && (page.topTab === "font" || wantsColor);
  // Share the kit being edited (published live by BrandKitModule); fall back
  // to the newest saved kit only for users who saved and never returned.
  const wantsBrand = isTool && page.topTab === "brand";
  const editedKit = studio.activeBrandKitShareState;
  const latestKit = studio.savedBrandKits[studio.savedBrandKits.length - 1];
  const source = editedKit ?? latestKit;
  const brandKit =
    wantsBrand && source
      ? {
          brandName: source.brandName,
          tagline: source.tagline,
          primaryColor: source.primaryColor,
          secondaryColor: source.secondaryColor,
          accentColor: source.accentColor,
          backgroundColor: source.backgroundColor,
          textColor: source.textColor,
          headlineFont: source.headlineFont,
          bodyFont: source.bodyFont,
          monoFont: source.monoFont,
          tone: source.tone,
        }
      : undefined;

  return buildToolShareState({
    selectedColor: wantsColor ? studio.selectedColor : undefined,
    activeFontFamily: wantsFont ? studio.activeFontFamily : undefined,
    paletteColors: wantsColor ? studio.savedColors.map((saved) => saved.rgb) : undefined,
    brandKit,
  });
}

export function useToolShareUrl(page: MetadataPage): string {
  // Subscriptions make the component re-render whenever shared inputs change;
  // the URL is then recomputed from fresh store state on every render.
  useStudio((s) => s.selectedColor);
  useStudio((s) => s.activeFontFamily);
  useStudio((s) => s.savedColors);
  useStudio((s) => s.savedBrandKits);
  useStudio((s) => s.activeBrandKitShareState);

  const shared = collectShareState(page);
  const params = encodeToolShareState(shared);
  let search = params.toString();

  // Drop the color list if the URL would become unshareably long.
  if (search.length > MAX_SHARE_URL_LENGTH && shared.p) {
    const fallback = encodeToolShareState({ ...shared, p: undefined });
    search = fallback.toString();
  }

  const base = `${window.location.origin}${window.location.pathname}`;
  return search ? `${base}?${search}` : base;
}
