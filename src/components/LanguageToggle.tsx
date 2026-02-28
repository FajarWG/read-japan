"use client";

import { Switch } from "@heroui/react";
import { useLanguage } from "./LanguageProvider";

export function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <Switch
      size="lg"
      isSelected={lang === "id"}
      onChange={() => toggleLang()}
      aria-label={`Switch to ${lang === "en" ? "Indonesian" : "English"}`}
    >
      {({ isSelected }) => (
        <Switch.Control className={isSelected ? "bg-accent" : "bg-border"}>
          <Switch.Thumb>
            <div className="text-xs font-semibold text-foreground px-2">
              {isSelected ? "ID" : "EN"}
            </div>
          </Switch.Thumb>
        </Switch.Control>
      )}
    </Switch>
  );
}
