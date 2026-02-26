"use client";

import { useTheme } from "./ThemeProvider";

// ─────────────────────────────────────────────────────────────────────────────
// Sun icon (light mode indicator)
// ─────────────────────────────────────────────────────────────────────────────

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Moon icon (dark mode indicator)
// ─────────────────────────────────────────────────────────────────────────────

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ThemeToggle
// ─────────────────────────────────────────────────────────────────────────────

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Aktifkan light mode" : "Aktifkan dark mode"
      }
      title={theme === "dark" ? "Aktifkan light mode" : "Aktifkan dark mode"}
      className="
        flex items-center justify-center
        h-8 w-8 rounded-full
        border border-border
        bg-surface text-foreground
        transition-all duration-150
        hover:border-accent/50 hover:text-accent
        focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1
        shrink-0
      "
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
