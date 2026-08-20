// Global helpers injected by index.html for bootstrap error reporting.
export {};

declare global {
  interface ImportMetaEnv {
    readonly VITE_SITE_URL?: string;
    readonly VITE_SPONSOR_URL?: string;
    readonly VITE_SPONSOR_TITLE?: string;
    readonly VITE_SPONSOR_TEXT?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface Window {
    __showBootError?: (title: string, detail?: string) => void;
    __hideBootLoading?: () => void;
  }
}
