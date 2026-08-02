"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      // GSAP Page Transition: fade in, smooth scale, and slight slide up
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0.15,
          y: 16,
          scale: 0.995,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
          clearProps: "transform",
        }
      );
    }
  }, [pathname]);

  return (
    <div ref={containerRef} key={pathname} className="w-full">
      {children}
    </div>
  );
}
