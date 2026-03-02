"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Tabs } from "@heroui/react";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  // ── Scroll-hide logic ─────────────────────────────────────────────────────
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const goingDown = currentY > lastScrollY.current;
      lastScrollY.current = currentY;

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setVisible(!goingDown);
      }, 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const NAV_ITEMS = [
    { id: "home", route: "/", label: t.navStories },
    { id: "learn", route: "/learn", label: t.navProgress },
    { id: "kana", route: "/kana", label: t.navKana },
  ] as const;

  const selectedKey = pathname.startsWith("/learn")
    ? "learn"
    : pathname.startsWith("/kana")
      ? "kana"
      : "home";

  // Hide on auth pages
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <div
      className={[
        "fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 pointer-events-none",
        "transition-transform duration-500 ease-in-out",
        visible ? "translate-y-0" : "translate-y-[calc(100%+1.5rem)]",
      ].join(" ")}
    >
      {" "}
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
  );
}
