import { useContext } from "react";
import { LocaleContext } from "./localeContextValue";

export function useLocale() {
  return useContext(LocaleContext);
}
