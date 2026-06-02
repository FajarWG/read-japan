"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Tabs } from "@heroui/react";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  // ── Show/Hide Nav visibility state ─────────────────────────────────────────
  const [visible, setVisible] = useState(true);

  const NAV_ITEMS = [
    { id: "prep", route: "/prep", label: "Prep" },
    { id: "anki", route: "/anki", label: "Anki" },
    { id: "kana", route: "/kana", label: t.navKana },
    { id: "story", route: "/stories", label: t.navStories },
  ] as const;

  const selectedKey = pathname.startsWith("/anki")
    ? "anki"
    : pathname.startsWith("/kana")
      ? "kana"
      : pathname.startsWith("/stories") || pathname.startsWith("/read") || pathname.startsWith("/learn")
        ? "story"
        : pathname.startsWith("/prep")
          ? "prep"
          : "none";

  // Hide on auth pages
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <>
      <div
        className={[
          "fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 pointer-events-none",
          "transition-transform duration-500 ease-in-out",
          visible ? "translate-y-0" : "translate-y-[calc(100%+2.5rem)]",
        ].join(" ")}
      >
        <div className="pointer-events-auto flex flex-col items-center gap-5">
          <button
            onClick={() => setVisible(false)}
            className="flex items-center justify-center text-[9px] font-bold tracking-wider uppercase text-foreground/45 hover:text-foreground/80 bg-white/20 dark:bg-white/7 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-full px-2.5 py-0.5 shadow-xs transition-all duration-200 cursor-pointer"
          >
            Sembunyikan Navigasi ▼
          </button>
          
          <div className="relative pointer-events-auto">
            {/* Centered protruding Home Button */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
              <button
                onClick={() => router.push("/")}
                className={[
                  "flex items-center justify-center h-8 w-8 rounded-full border shadow-md transition-all duration-200 cursor-pointer pointer-events-auto",
                  pathname === "/"
                    ? "bg-accent border-accent text-white shadow-accent/25 shadow-lg scale-105"
                    : "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-white/40 dark:border-white/12 text-foreground/75 hover:text-foreground hover:border-white/70 hover:scale-110",
                ].join(" ")}
                title="Beranda"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </button>
            </div>

            <Tabs
              selectedKey={selectedKey}
              onSelectionChange={(key) => {
                const item = NAV_ITEMS.find((n) => n.id === key);
                if (item) router.push(item.route);
              }}
            >
              <Tabs.ListContainer>
                <Tabs.List
                  aria-label="Navigasi utama"
                  className={[
                    /* Liquid glass container */
                    "rounded-2xl px-1.5 py-1.5 gap-0.5",
                    /* Translucent fill */
                    "bg-white/20 dark:bg-white/7",
                    /* Strong backdrop blur */
                    "backdrop-blur-2xl",
                    /* Glass edge — outer border */
                    "border border-white/40 dark:border-white/12",
                    /* Depth shadow + inner highlight */
                    "shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.5)]",
                    "dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]",
                    /* Tab overrides */
                    "*:rounded-xl *:px-5 *:h-9",
                    "*:text-sm *:font-semibold *:tracking-wide",
                    "*:text-foreground/60 *:transition-all *:duration-200",
                    "*:data-[selected=true]:text-foreground",
                  ].join(" ")}
                >
                  {NAV_ITEMS.map(({ id, label }) => (
                    <Tabs.Tab key={id} id={id}>
                      {label}
                      <Tabs.Indicator
                        className={[
                          "rounded-xl",
                          "bg-white/50 dark:bg-white/12",
                          "shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_3px_rgba(0,0,0,0.1)]",
                          "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_1px_3px_rgba(0,0,0,0.3)]",
                        ].join(" ")}
                      />
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>
          </div>
        </div>
      </div>

      {!visible && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-55 pointer-events-auto">
          <button
            onClick={() => setVisible(true)}
            className="flex items-center justify-center text-[10px] font-bold text-foreground/75 hover:text-foreground bg-white/80 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 rounded-full px-3 py-1.5 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            ▲ Tampilkan Navigasi
          </button>
        </div>
      )}
    </>
  );
}
