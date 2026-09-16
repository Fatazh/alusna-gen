import { createContext, useContext } from "react";

export type ToastTone = "neutral" | "success" | "warning" | "error";

export type ShowToastOptions = {
  tone?: ToastTone;
  background?: string;
  foreground?: string;
};

export type ToastContextValue = { show: (message: string, options?: ShowToastOptions) => void };

export const ToastContext = createContext<ToastContextValue>({ show: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const TONE_CLASS: Record<ToastTone, string> = {
  neutral:
    "border-emerald-500/30 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 [&_svg]:text-emerald-600 dark:[&_svg]:text-emerald-200",
  success:
    "border-emerald-500/30 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 [&_svg]:text-emerald-600 dark:[&_svg]:text-emerald-200",
  warning: "border-amber-500/40 bg-amber-500/20 text-amber-700 dark:text-amber-300",
  error: "border-rose-500/40 bg-rose-500/20 text-rose-700 dark:text-rose-300",
};

// Explicit background+foreground (design-system themed toast) wins over tone classes;
// a partial pair falls back to the tone so a toast is never left unstyled.
export function resolveToastPresentation(options: ShowToastOptions): {
  className: string;
  style?: { backgroundColor: string; color: string };
} {
  const toneClass = TONE_CLASS[options.tone ?? "neutral"];
  if (options.background !== undefined && options.foreground !== undefined) {
    return {
      className: "",
      style: { backgroundColor: options.background, color: options.foreground },
    };
  }
  return { className: toneClass };
}
