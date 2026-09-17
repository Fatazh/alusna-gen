import { useEffect, useState } from "react";
import { hexToRgb } from "../../features/color/domain";
import { useStudio } from "../../store/studio";
import { resolveInitialPage, updateBrowserPath } from "./browserNavigation";
import {
  DEFAULT_TOOL_PAGE,
  findAlternatePage,
  findPageForModule,
  findPublicPage,
  isNotFoundPage,
  isToolPage,
  type ColorTab,
  type HomePage,
  type NotFoundPage,
  type TopModule,
  type TrustPage,
} from "./routes";

const SAFE_FONT_PATTERN = /^[a-zA-Z0-9\s\-_]+$/;

const TOP_TAB_KEYS: Partial<Record<string, TopModule>> = {
  c: "color",
  f: "font",
  d: "design",
  b: "brand",
};

const COLOR_TAB_KEYS: Partial<Record<string, ColorTab>> = {
  1: "pattern",
  2: "matching",
  3: "experiment",
  4: "gradient",
  5: "shades",
  6: "image",
  7: "a11y",
  8: "contrast",
};

const HELP_TOGGLE_KEY = "?";

export function undoRedoShortcuts(): KeyboardShortcut[] {
  return [
    {
      keys: "Ctrl+Z",
      id: "Urungkan (alat Pattern, Matching, Experiment, Gradient)",
      en: "Undo (Pattern, Matching, Experiment & Gradient tools)",
    },
    {
      keys: "Ctrl+Y",
      id: "Ulangi (alat Pattern, Matching, Experiment, Gradient)",
      en: "Redo (Pattern, Matching, Experiment & Gradient tools)",
    },
  ];
}

import { isTextEntryTarget } from "../../shared/lib/useUndoRedoShortcuts";

export type KeyboardShortcut = {
  keys: string;
  id: string;
  en: string;
};

export function topLevelShortcuts(): KeyboardShortcut[] {
  const labels: Record<TopModule, { id: string; en: string }> = {
    color: { id: "Alat warna", en: "Color tools" },
    font: { id: "Alat font", en: "Font tools" },
    design: { id: "Design System", en: "Design System" },
    brand: { id: "Brand Kit", en: "Brand Kit" },
  };
  return Object.entries(TOP_TAB_KEYS).map(([key, tab]) => ({
    keys: key.toUpperCase(),
    id: labels[tab as TopModule].id,
    en: labels[tab as TopModule].en,
  }));
}

export function colorTabShortcuts(): KeyboardShortcut[] {
  const labels: Record<ColorTab, { id: string; en: string }> = {
    pattern: { id: "Palet warna", en: "Color palette" },
    matching: { id: "Pencocokan warna", en: "Color matching" },
    experiment: { id: "Eksperimen warna", en: "Color experiment" },
    gradient: { id: "Generator gradient", en: "Gradient generator" },
    shades: { id: "Generator shade", en: "Shade generator" },
    image: { id: "Ekstraksi warna gambar", en: "Image color extraction" },
    a11y: { id: "Simulasi buta warna", en: "Color blindness simulator" },
    contrast: { id: "Cek kontras WCAG", en: "WCAG contrast checker" },
  };
  return Object.entries(COLOR_TAB_KEYS).map(([key, tab]) => ({
    keys: key,
    id: labels[tab as ColorTab].id,
    en: labels[tab as ColorTab].en,
  }));
}

export function useStudioRouter() {
  const initialPage = resolveInitialPage(window.location.pathname, window.location.search);
  const initialToolPage = isToolPage(initialPage)
    ? initialPage
    : findPageForModule(DEFAULT_TOOL_PAGE.topTab, DEFAULT_TOOL_PAGE.colorTab, initialPage.locale);
  const [colorTab, setColorTab] = useState<ColorTab>(initialToolPage.colorTab ?? "pattern");
  const [topTab, setTopTab] = useState<TopModule>(initialToolPage.topTab);
  const [locale, setLocale] = useState(initialPage.locale);
  const [contentPage, setContentPage] = useState<HomePage | TrustPage | NotFoundPage | null>(
    isToolPage(initialPage) ? null : initialPage,
  );

  const setActiveModule = useStudio((state) => state.setActiveModule);
  const setSelectedColor = useStudio((state) => state.setSelectedColor);
  const pushColorHistory = useStudio((state) => state.pushColorHistory);
  const setActiveFontFamily = useStudio((state) => state.setActiveFontFamily);

  const currentPage = contentPage ?? findPageForModule(topTab, colorTab, locale);

  useEffect(() => {
    // The not-found page is not a real route: keep the broken address visible
    // in the URL bar instead of "normalizing" it to /.
    if (isNotFoundPage(currentPage)) return;
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
  }, [currentPage, pushColorHistory, setActiveFontFamily, setSelectedColor]);

  useEffect(() => {
    const onPopState = () => {
      // Unknown paths get a real NotFoundPage (noindex) instead of a soft-404
      // homepage render, so address-bar experiments never index duplicate content.
      const page = findPublicPage(window.location.pathname);
      setLocale(page.locale);
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

  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && helpOpen) {
        setHelpOpen(false);
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTextEntryTarget(event.target)) return;

      if (event.key === HELP_TOGGLE_KEY || (event.key === "/" && event.shiftKey)) {
        event.preventDefault();
        setHelpOpen((open) => !open);
        return;
      }

      const colorTabKey = COLOR_TAB_KEYS[event.key];
      if (colorTabKey && topTab === "color" && isToolPage(currentPage)) {
        event.preventDefault();
        setColorTab(colorTabKey);
        updateBrowserPath(findPageForModule("color", colorTabKey, locale).path);
        return;
      }

      const tab = TOP_TAB_KEYS[event.key.toLowerCase()];
      if (!tab) return;

      setContentPage(null);
      setTopTab(tab);
      if (tab === "color" || tab === "font") setActiveModule(tab);
      updateBrowserPath(findPageForModule(tab, colorTab, locale).path);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [colorTab, currentPage, helpOpen, locale, setActiveModule, topTab]);

  const switchTopTab = (tab: TopModule) => {
    setContentPage(null);
    setTopTab(tab);
    if (tab === "color" || tab === "font") setActiveModule(tab);
    updateBrowserPath(findPageForModule(tab, colorTab, locale).path);
  };

  const switchColorTab = (tab: ColorTab) => {
    setContentPage(null);
    setColorTab(tab);
    setTopTab("color");
    setActiveModule("color");
    updateBrowserPath(findPageForModule("color", tab, locale).path);
  };

  const navigateToPath = (path: string) => {
    const page = findPublicPage(path);
    setLocale(page.locale);
    if (isToolPage(page)) {
      setContentPage(null);
      setTopTab(page.topTab);
      if (page.colorTab) setColorTab(page.colorTab);
    } else {
      setContentPage(page);
    }
    updateBrowserPath(page.path);
  };

  const switchLocale = () => {
    const target = findAlternatePage(currentPage);
    setLocale(target.locale);
    if (isToolPage(target)) {
      setContentPage(null);
      setTopTab(target.topTab);
      if (target.colorTab) setColorTab(target.colorTab);
    } else {
      setContentPage(target);
    }
    updateBrowserPath(target.path);
  };

  return {
    colorTab,
    topTab,
    currentPage,
    switchTopTab,
    switchColorTab,
    navigateToPath,
    switchLocale,
    helpOpen,
    setHelpOpen,
  };
}
