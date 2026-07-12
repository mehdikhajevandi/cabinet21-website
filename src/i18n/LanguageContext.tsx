import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { translations, type Lang, type Translations } from "./translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: Translations;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "cabinet21-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "fa";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "en" || stored === "fa" ? stored : "fa";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    const root = document.documentElement;
    root.setAttribute("lang", lang === "fa" ? "fa" : "en");
    root.setAttribute("dir", lang === "fa" ? "rtl" : "ltr");
    root.classList.toggle("font-fa", lang === "fa");
    root.classList.toggle("font-en", lang === "en");
  }, [lang]);

  const value = useMemo<LanguageContextValue>(() => {
    return {
      lang,
      setLang: setLangState,
      toggleLang: () => setLangState((prev) => (prev === "fa" ? "en" : "fa")),
      t: translations[lang],
      dir: lang === "fa" ? "rtl" : "ltr",
    };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
