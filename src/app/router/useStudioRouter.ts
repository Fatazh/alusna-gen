import { useEffect, useState } from "react";
import { hexToRgb } from "../../features/color/domain";
import { useStudio } from "../../store/studio";
import { resolveInitialPage, updateBrowserPath } from "./browserNavigation";
import {
  DEFAULT_TOOL_PAGE,
  findPageForModule,
  findSeoPage,
  isToolPage,
  type ColorTab,
  type HomePage,
  type TopModule,
  type TrustPage,
} from "./routes";

const SAFE_FONT_PATTERN = /^[a-zA-Z0-9\s\-_]+$/;

export function useStudioRouter() {
  const initialPage = resolveInitialPage(window.location.pathname, window.location.search);
  const initialToolPage = isToolPage(initialPage) ? initialPage : DEFAULT_TOOL_PAGE;
  const [colorTab, setColorTab] = useState<ColorTab>(initialToolPage.colorTab ?? "pattern");
  const [topTab, setTopTab] = useState<TopModule>(initialToolPage.topTab);
  const [contentPage, setContentPage] = useState<HomePage | TrustPage | null>(
    isToolPage(initialPage) ? null : initialPage,
  );

  const setActiveModule = useStudio((state) => state.setActiveModule);
  const setSelectedColor = useStudio((state) => state.setSelectedColor);
  const pushColorHistory = useStudio((state) => state.pushColorHistory);
  const setActiveFontFamily = useStudio((state) => state.setActiveFontFamily);

  const currentPage = contentPage ?? findPageForModule(topTab, colorTab);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const color = params.get("c");
    const font = params.get("f");
    const parsedColor = color ? hexToRgb(color) : null;

    if (parsedColor) {
      setSelectedColor(parsedColor);
      pushColorHistory(parsedColor);
    }
    if (font && SAFE_FONT_PATTERN.test(font) && font.length <= 100) setActiveFontFamily(font);

    if (window.location.pathname !== currentPage.path || params.has("m")) {
      updateBrowserPath(currentPage.path, true);
    }
  }, [currentPage.path, pushColorHistory, setActiveFontFamily, setSelectedColor]);

  useEffect(() => {
    const onPopState = () => {
      const page = findSeoPage(window.location.pathname);
      if (!isToolPage(page)) {
        setContentPage(page);
        return;
      }
      setContentPage(null);
      setTopTab(page.topTab);
      if (page.colorTab) setColorTab(page.colorTab);
      if (page.topTab === "color" || page.topTab === "font") setActiveModule(page.topTab);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [setActiveModule]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      )
        return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const shortcut: Partial<Record<string, TopModule>> = {
        c: "color",
        f: "font",
        d: "design",
        b: "brand",
      };
      const tab = shortcut[event.key.toLowerCase()];
      if (!tab) return;

      setContentPage(null);
      setTopTab(tab);
      if (tab === "color" || tab === "font") setActiveModule(tab);
      updateBrowserPath(findPageForModule(tab, colorTab).path);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [colorTab, setActiveModule]);

  const switchTopTab = (tab: TopModule) => {
    setContentPage(null);
    setTopTab(tab);
    if (tab === "color" || tab === "font") setActiveModule(tab);
    updateBrowserPath(findPageForModule(tab, colorTab).path);
  };

  const switchColorTab = (tab: ColorTab) => {
    setContentPage(null);
    setColorTab(tab);
    setTopTab("color");
    setActiveModule("color");
    updateBrowserPath(findPageForModule("color", tab).path);
  };

  const navigateToPath = (path: string) => {
    const page = findSeoPage(path);
    if (isToolPage(page)) {
      setContentPage(null);
      setTopTab(page.topTab);
      if (page.colorTab) setColorTab(page.colorTab);
    } else {
      setContentPage(page);
    }
    updateBrowserPath(page.path);
  };

  return { colorTab, topTab, currentPage, switchTopTab, switchColorTab, navigateToPath };
}
