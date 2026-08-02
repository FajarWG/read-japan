"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Compass } from "lucide-react";
import gsap from "gsap";

const ROUTE_NAMES: Record<string, string> = {
  "/": "Learning Hub",
  "/anki": "Anki Review Engine",
  "/adaptive": "Adaptive Learning Engine",
  "/bunpou": "Bunpou Grammar",
  "/katsuyou": "Katsuyou Conjugation",
  "/kakou": "Kakou Handwriting",
  "/prep": "Pre-Class Cheat Sheet",
  "/kanji-tamago": "Kanji Tamago Mnemonic",
  "/conversation": "AI VRM Conversation",
  "/goals/setup": "Goal Setup & Exam Planner",
  "/settings": "Settings Center",
  "/login": "Authentication",
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);

    if (overlayRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsTransitioning(false);
        },
      });

      // 1. Overlay slides down/fades in
      tl.fromTo(
        overlayRef.current,
        { opacity: 0, scale: 1.02 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.inOut" }
      )
      // 2. Text scales up with pulse
      .fromTo(
        textRef.current,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
        "-=0.2"
      )
      // 3. Hold for 1.8s (Total ~2.7s visible duration) and fade out curtain
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        delay: 1.8,
      });
    }

    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0.2, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.3 }
      );
    }
  }, [pathname]);

  const targetTitle = ROUTE_NAMES[pathname] || pathname.replace("/", "").toUpperCase() || "Nihongo Flow";

  return (
    <>
      {/* Fullscreen GSAP Transition Overlay Curtain (2.5 - 3 Seconds Duration) */}
      <div
        ref={overlayRef}
        aria-hidden={!isTransitioning}
        className={`fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-white pointer-events-none transition-opacity ${
          isTransitioning ? "opacity-100" : "opacity-0 hidden"
        }`}
      >
        <div ref={textRef} className="flex flex-col items-center gap-4 text-center">
          <div className="p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-2xl shadow-blue-500/20 animate-pulse">
            <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Navigating to...
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {targetTitle}
            </h2>
          </div>
        </div>
      </div>

      <div ref={containerRef} key={pathname} className="w-full">
        {children}
      </div>
    </>
  );
}
