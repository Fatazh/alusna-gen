import { createContext, useContext } from "react";

export type ToastContextValue = { show: (message: string) => void };

export const ToastContext = createContext<ToastContextValue>({ show: () => {} });

export function useToast() {
  return useContext(ToastContext);
}
