"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Modal, Button } from "@heroui/react";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";
import { LanguageToggle } from "../../language/components/LanguageToggle";

const STORAGE_KEY = "rj-onboarding-seen";

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

interface Slide {
  emoji: string;
  title: string;
  desc: string;
  /**
   * Path under /public — e.g. "/onboarding/reading-mode.png"
   * When undefined, the emoji is shown as a placeholder.
   */
  imageSrc?: string;
  imageAlt?: string;
}

// ─────────────────────────────────────────
// OnboardingGuide
// ─────────────────────────────────────────

export function OnboardingGuide() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [step, setStep] = useState(0);
  // Ref on the FAB so we can auto-open the HeroUI modal on first visit
  const triggerRef = useRef<HTMLButtonElement>(null);

  // ── Slide definitions ──────────────────────────────────────────────────────
  //
  //  IMAGE GUIDE — for each slide that has a placeholder, add a screenshot:
  //    • Size: 800 × 440 px  (2:1 ratio works too, e.g. 600 × 330 px)
  //    • Format: PNG or WebP
  //    • Place the file in /public/onboarding/
  //    • Then set imageSrc: "/onboarding/<filename>.png"  (or .webp)
  //
  // ──────────────────────────────────────────────────────────────────────────
  const slides: Slide[] = [
    {
      emoji: "🌸",
      title: t.onboardingSlide1Title,
      desc: t.onboardingSlide1Desc,
    },
    {
      emoji: "📖",
      title: t.onboardingSlide2Title,
      desc: t.onboardingSlide2Desc,

      imageSrc: "/onboarding/reading-mode.png",
      imageAlt: "Reading mode — tap kana to see its reading",
    },
    {
      emoji: "✅",
      title: t.onboardingSlide3Title,
      desc: t.onboardingSlide3Desc,
      imageSrc: "/onboarding/review-mode.png",
      imageAlt: "Review mode — mark characters you misread",
    },
    {
      emoji: "📊",
      title: t.onboardingSlide4Title,
      desc: t.onboardingSlide4Desc,
      imageSrc: "/onboarding/progress.png",
      imageAlt: "Progress page — see which kana need practice",
    },
    {
      emoji: "🔐",
      title: t.onboardingSlide5Title,
      desc: t.onboardingSlide5Desc,
    },
  ];

  const totalSteps = slides.length;
  const isLast = step === totalSteps - 1;
  const current = slides[step];

  // Auto-open on first visit by programmatically clicking the HeroUI trigger
  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      triggerRef.current?.click();
    }
  }, []);

  function handleOpen() {
    setStep(0);
  }

  function handleDontShow() {
    localStorage.setItem(STORAGE_KEY, "1");
  }

  function handleNext() {
    if (!isLast) setStep((s) => s + 1);
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  // Hide FAB on auth pages
  const hideOnPage = pathname === "/login" || pathname === "/register";

  return (
    <Modal>
      {/* ── FAB trigger ─────────────────────────────────────────────────── */}
      <Button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        aria-label={t.onboardingGuide}
        className={[
          "fixed bottom-6 right-4 z-50 flex items-center gap-1.5 rounded-2xl bg-surface border border-border shadow-lg px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface-muted active:scale-95 transition-all duration-150",
          hideOnPage ? "hidden" : "",
        ].join(" ")}
      >
        {/* Book icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-3.5 w-3.5 text-accent shrink-0"
        >
          <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.025a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.5c1.978 0 3.783.674 5.25 1.784V4.533ZM12.75 20.284A8.235 8.235 0 0 1 18 18.5c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.707V4.262a.75.75 0 0 0-.5-.707A9.734 9.734 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v15.75Z" />
        </svg>
        {t.onboardingGuide}
      </Button>

      {/* ── Modal ───────────────────────────────────────────────────────── */}
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="max-w-md w-full">
            <div className="absolute right-12 top-4 z-10 flex items-center gap-1">
              <LanguageToggle />
            </div>
            <Modal.CloseTrigger />

            {/* Slide image / emoji */}
            <div className="px-6 pt-7">
              <div className="mb-5 h-44 w-full shadow-sm border overflow-hidden rounded-xl bg-surface-muted flex items-center justify-center relative">
                {current.imageSrc ? (
                  /*
                   * Once you add the image file under /public/onboarding/,
                   * uncomment the imageSrc line in the slides array above.
                   * The <Image> fills the 176px-tall container.
                   */
                  <Image
                    src={current.imageSrc}
                    alt={current.imageAlt ?? current.title}
                    fill
                    className="object-cover "
                    sizes="(max-width: 640px) 100vw, 249px"
                  />
                ) : (
                  <span className="text-6xl select-none">{current.emoji}</span>
                )}
              </div>
            </div>

            <Modal.Body className="px-6 pb-2 flex flex-col gap-2">
              {/* Title + description */}
              <h2 className="text-base font-bold text-foreground leading-snug">
                {current.title}
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                {current.desc}
              </p>

              {/* Dot navigator */}
              <div className="mt-3 flex justify-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setStep(i)}
                    className={[
                      "h-1.5 rounded-full transition-all duration-200",
                      i === step
                        ? "w-5 bg-accent"
                        : "w-1.5 bg-border hover:bg-muted",
                    ].join(" ")}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </Modal.Body>

            <Modal.Footer className="flex flex-col gap-2 px-6  pt-3">
              {/* Back / Next row */}
              <div className="flex gap-2">
                {step > 0 && (
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onPress={handleBack}
                  >
                    {t.onboardingBack}
                  </Button>
                )}
                {isLast ? (
                  /* Last slide: "Start!" closes the modal */
                  <Button slot="close" variant="primary" className="flex-1">
                    {t.onboardingStart}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="flex-1"
                    onPress={handleNext}
                  >
                    {t.onboardingNext}
                  </Button>
                )}
              </div>

              {/* Login CTA on last slide */}
              {isLast && (
                <Link
                  href="/login"
                  onClick={handleDontShow}
                  className="block text-center text-xs text-accent font-medium py-1.5 hover:underline transition-colors"
                >
                  {t.authLogin} →
                </Link>
              )}

              {/* Don't show again */}
              <Button
                slot="close"
                variant="ghost"
                size="sm"
                className="text-[11px] text-muted w-full"
                onPress={handleDontShow}
              >
                {t.onboardingDontShow}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
