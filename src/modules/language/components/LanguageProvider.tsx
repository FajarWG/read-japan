"use client";

import { createContext, useContext } from "react";
import { translations } from "@/src/modules/language/lib/i18n";
import type { Lang, Translations } from "@/src/modules/language/lib/i18n";

// ─────────────────────────────────────────────────────────────────────────────
// Context
//
// The UI chrome is locked to English by design — feature names read better in
// English/Japanese. Only *content* (Japanese → meaning) stays Indonesian, and
// that comes from data (Prep translations, Kotoba `translationId`), not here.
// `lang`/`toggleLang` are kept as no-ops so the existing call sites don't need
// to change, but there is no runtime language switching anymore.
// ─────────────────────────────────────────────────────────────────────────────

interface LanguageContextValue {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  t: translations.en,
  toggleLang: () => {},
});

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return (
    <LanguageContext.Provider
      value={{ lang: "en", t: translations.en, toggleLang: () => {} }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useLanguage() {
  return useContext(LanguageContext);
}
