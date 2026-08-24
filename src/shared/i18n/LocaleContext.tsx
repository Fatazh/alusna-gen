import { type ReactNode } from "react";
import { type Locale, pick } from "./locale";
import { LocaleContext } from "./localeContextValue";

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <LocaleContext.Provider value={{ locale, text: (id, en) => pick(locale, id, en) }}>
      {children}
    </LocaleContext.Provider>
  );
}
