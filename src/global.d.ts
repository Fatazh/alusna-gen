// Global helpers injected by index.html for bootstrap error reporting.
export {};

declare global {
  interface ImportMetaEnv {
    readonly VITE_SITE_URL?: string;
    readonly VITE_CONTACT_EMAIL?: string;
    readonly VITE_SPONSOR_URL?: string;
    readonly VITE_SPONSOR_TITLE?: string;
    readonly VITE_SPONSOR_TEXT?: string;
    readonly VITE_SUPPORT_URL?: string;
    readonly VITE_SUPPORT_TITLE?: string;
    readonly VITE_ANALYTICS_ENABLED?: string;
    readonly VITE_GA4_ID?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface Window {
    __showBootError?: (title: string, detail?: string) => void;
    __hideBootLoading?: () => void;
  }
}
