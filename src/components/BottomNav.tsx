"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs } from "@heroui/react";

// ─────────────────────────────────────────────────────────────────────────────
// BottomNav — Floating bottom navigation tabs
// Menggunakan HeroUI Tabs dengan selectedKey + onSelectionChange untuk routing.
// ─────────────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "home", route: "/", emoji: "📚", label: "Cerita" },
  { id: "learn", route: "/learn", emoji: "📊", label: "Progres" },
  { id: "kana", route: "/kana", emoji: "🔤", label: "Kana" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const selectedKey = pathname.startsWith("/learn")
    ? "learn"
    : pathname.startsWith("/kana")
      ? "kana"
      : "home";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-5 pointer-events-none">
      <div className="pointer-events-auto">
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
                "rounded-2xl border border-border bg-surface/90 shadow-xl backdrop-blur-md",
                "px-1.5 py-1.5 gap-1",
                /* override per-tab defaults */
                "*:rounded-xl *:px-5 *:h-auto *:py-2",
                "*:text-muted *:transition-colors",
                "*:data-[selected=true]:text-accent",
              ].join(" ")}
            >
              {NAV_ITEMS.map(({ id, emoji, label }) => (
                <Tabs.Tab key={id} id={id}>
                  <span className="flex flex-col items-center gap-0.5 select-none">
                    <span className="text-[18px] leading-none">{emoji}</span>
                    <span className="text-[10px] font-semibold leading-none tracking-wide uppercase">
                      {label}
                    </span>
                  </span>
                  <Tabs.Indicator className="bg-accent/10 rounded-xl" />
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
      </div>
    </div>
  );
}
