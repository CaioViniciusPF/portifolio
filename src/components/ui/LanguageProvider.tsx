"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Locale } from "@/types";

interface LanguageContextValue {
  locale: Locale;
  toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "pt",
  toggleLocale: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("pt");

  useEffect(() => {
    if (localStorage.getItem("locale") === "en") {
      setLocale("en");
      document.documentElement.lang = "en";
    }
  }, []);

  const toggleLocale = () => {
    setLocale((prev) => {
      const next: Locale = prev === "pt" ? "en" : "pt";
      localStorage.setItem("locale", next);
      document.documentElement.lang = next === "pt" ? "pt-BR" : "en";
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ locale, toggleLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
