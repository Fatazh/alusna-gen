import { createContext } from "react";
import { type Locale } from "./locale";

export type LocaleContextValue = {
  locale: Locale;
  text: <T>(id: T, en: T) => T;
};

export const LocaleContext = createContext<LocaleContextValue>({
  locale: "id",
  text: (id) => id,
});
