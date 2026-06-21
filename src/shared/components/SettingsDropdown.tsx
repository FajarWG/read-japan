"use client";

import { useTransition, useState } from "react";
import { Popover } from "@heroui/react";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { useTheme } from "@/src/modules/theme/components/ThemeProvider";
import { useAuth } from "@/src/modules/auth/components/AuthProvider";
import { logoutAction } from "@/src/modules/auth/actions";
import { SearchOverlay } from "@/src/shared/components/SearchOverlay";

export function SettingsDropdown({
  adminModeActive,
  onAdminModeToggle,
}: {
  adminModeActive?: boolean;
  onAdminModeToggle?: (active: boolean) => void;
} = {}) {
  const { lang, t, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [isPending, startLogout] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    setIsOpen(false);
    startLogout(async () => {
      await logoutAction();
    });
  };

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger>
        <button
          type="button"
          aria-label="Settings"
          className="flex items-center justify-center h-8 w-8 rounded-full border border-border bg-surface text-foreground transition-all duration-150 hover:border-accent/50 hover:text-accent focus:outline-none shrink-0 cursor-pointer"
        >
          {/* Settings Cog Icon */}
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
            className="transition-transform duration-500 hover:rotate-45"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </Popover.Trigger>
      <Popover.Content className="w-56 p-2 rounded-xl bg-white dark:bg-zinc-900 border border-border shadow-xl" placement="bottom end">
        <Popover.Dialog className="flex flex-col gap-1">
          {/* Admin Mode Toggle (conditional) */}
          {user?.role === "ADMIN" && onAdminModeToggle !== undefined && adminModeActive !== undefined && (
            <>
              <div className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-surface-muted transition-colors">
                <span className="text-xs font-semibold text-foreground flex items-center gap-2 select-none">
                  🛠️ {lang === "en" ? "Admin Mode" : "Mode Admin"}
                </span>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={adminModeActive}
                    onChange={(e) => onAdminModeToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-zinc-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="h-px bg-border my-1" />
            </>
          )}
          {/* Language Row */}
          <div className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-surface-muted transition-colors">
            <span className="text-xs font-semibold text-foreground flex items-center gap-2 select-none">
              🌐 {lang === "en" ? "Language" : "Bahasa"}
            </span>
            <button
              onClick={toggleLang}
              className="text-[11px] font-bold px-2 py-1 rounded-md border border-border hover:border-accent hover:text-accent transition-colors cursor-pointer"
            >
              {lang === "en" ? "English" : "Indonesia"}
            </button>
          </div>

          {/* Theme Row */}
          <div className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-surface-muted transition-colors">
            <span className="text-xs font-semibold text-foreground flex items-center gap-2 select-none">
              {theme === "dark" ? "🌙" : "☀️"} {lang === "en" ? "Theme" : "Tema"}
            </span>
            <button
              onClick={toggleTheme}
              className="text-[11px] font-bold px-2 py-1 rounded-md border border-border hover:border-accent hover:text-accent transition-colors capitalize cursor-pointer"
            >
              {theme === "dark" ? (lang === "en" ? "Dark" : "Gelap") : (lang === "en" ? "Light" : "Terang")}
            </button>
          </div>

          <div className="h-px bg-border my-1" />

          {/* Search */}
          <button
            onClick={() => {
              setIsOpen(false);
              setSearchOpen(true);
            }}
            className="w-full flex items-center gap-2 px-2.5 py-2 text-left text-xs font-semibold text-foreground hover:bg-surface-muted rounded-lg transition-colors cursor-pointer"
          >
            🔍 Search
          </button>

          {/* About Button */}
          <button
            onClick={() => {
              setIsOpen(false);
              window.dispatchEvent(new CustomEvent("open-about"));
            }}
            className="w-full flex items-center gap-2 px-2.5 py-2 text-left text-xs font-semibold text-foreground hover:bg-surface-muted rounded-lg transition-colors cursor-pointer"
          >
            ❓ {t.creditsAbout}
          </button>

          {/* Auth Section — middleware menjamin user selalu ada */}
          <div className="h-px bg-border my-1" />
          <div className="px-2.5 py-1.5 flex flex-col">
            <span className="text-[10px] text-muted uppercase tracking-wider select-none font-bold">
              User
            </span>
            <span className="text-xs font-bold text-foreground truncate select-none">
              {user?.username ?? "—"}
              {user?.role === "ADMIN" && ` (${t.admin})`}
            </span>
          </div>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="w-full flex items-center gap-2 px-2.5 py-2 text-left text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
          >
            🚪 {isPending ? t.saving : t.authLogout}
          </button>
        </Popover.Dialog>
      </Popover.Content>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </Popover>
  );
}
