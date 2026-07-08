"use client";

import { useTransition, useState } from "react";
import { Popover } from "@heroui/react";
import { Settings, Wrench, Moon, Sun, HelpCircle, LogOut } from "lucide-react";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { useTheme } from "@/src/modules/theme/components/ThemeProvider";
import { useAuth } from "@/src/modules/auth/components/AuthProvider";
import { logoutAction } from "@/src/modules/auth/actions";

export function SettingsDropdown({
  adminModeActive,
  onAdminModeToggle,
}: {
  adminModeActive?: boolean;
  onAdminModeToggle?: (active: boolean) => void;
} = {}) {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [isPending, startLogout] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

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
          <Settings size={16} className="transition-transform duration-500 hover:rotate-45" />
        </button>
      </Popover.Trigger>
      <Popover.Content className="w-56 p-2 rounded-xl bg-white dark:bg-zinc-900 border border-border shadow-xl" placement="bottom end">
        <Popover.Dialog className="flex flex-col gap-1">
          {/* Admin Mode Toggle (conditional) */}
          {user?.role === "ADMIN" && onAdminModeToggle !== undefined && adminModeActive !== undefined && (
            <>
              <div className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-surface-muted transition-colors">
                <span className="text-xs font-semibold text-foreground flex items-center gap-2 select-none">
                  <Wrench size={14} /> Admin Mode
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
          {/* Theme Row */}
          <div className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-surface-muted transition-colors">
            <span className="text-xs font-semibold text-foreground flex items-center gap-2 select-none">
              {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />} Theme
            </span>
            <button
              onClick={toggleTheme}
              className="text-[11px] font-bold px-2 py-1 rounded-md border border-border hover:border-accent hover:text-accent transition-colors capitalize cursor-pointer"
            >
              {theme === "dark" ? "Dark" : "Light"}
            </button>
          </div>

          <div className="h-px bg-border my-1" />

          {/* About Button */}
          <button
            onClick={() => {
              setIsOpen(false);
              window.dispatchEvent(new CustomEvent("open-about"));
            }}
            className="w-full flex items-center gap-2 px-2.5 py-2 text-left text-xs font-semibold text-foreground hover:bg-surface-muted rounded-lg transition-colors cursor-pointer"
          >
            <HelpCircle size={14} /> {t.creditsAbout}
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
            <LogOut size={14} /> {isPending ? t.saving : t.authLogout}
          </button>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
