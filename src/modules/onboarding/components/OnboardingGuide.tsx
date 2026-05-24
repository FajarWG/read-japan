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
  const [imageLoading, setImageLoading] = useState(true);
  const [logoLoading, setLogoLoading] = useState(true);

  // Controlled states for modals
  const [guideOpen, setGuideOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Slide definitions
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

  // Auto-open on first visit
  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      handleOpen();
      setGuideOpen(true);
    }
  }, []);

  // Listen to global events to open the modals
  useEffect(() => {
    const handleOpenGuideEvent = () => {
      handleOpen();
      setGuideOpen(true);
    };

    const handleOpenAboutEvent = () => {
      setAboutOpen(true);
    };

    window.addEventListener("open-guide", handleOpenGuideEvent);
    window.addEventListener("open-about", handleOpenAboutEvent);

    return () => {
      window.removeEventListener("open-guide", handleOpenGuideEvent);
      window.removeEventListener("open-about", handleOpenAboutEvent);
    };
  }, []);

  // Reset loading state whenever the slide (and its image) changes
  useEffect(() => {
    if (current.imageSrc) setImageLoading(true);
  }, [step, current.imageSrc]);

  function handleOpen() {
    setStep(0);
    setImageLoading(true);
    setLogoLoading(true);
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

  return (
    <>
      {/* ── Credits / About modal ──────────────────────────────────────────── */}
      <Modal isOpen={aboutOpen} onOpenChange={setAboutOpen}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="max-w-sm w-full">
              <Modal.CloseTrigger />

              <Modal.Body className="px-6 pt-8 pb-4 flex flex-col gap-5">
                {/* Logo / brand */}
                <div className="relative w-[120px] h-[120px] mx-auto">
                  {logoLoading && (
                    <div className="absolute inset-0 rounded-xl bg-surface-muted animate-pulse" />
                  )}
                  <Image
                    src="/logo.png"
                    alt="Read Japan logo"
                    width={120}
                    height={120}
                    className={`transition-opacity duration-300 ${logoLoading ? "opacity-0" : "opacity-100"}`}
                    onLoad={() => setLogoLoading(false)}
                  />
                </div>

                <p className="text-sm text-muted leading-relaxed text-center">
                  {t.creditsProjectDesc}
                </p>

                <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm">
                  {/* Made by */}
                  <div className="flex items-center gap-3">
                    <span className="text-base">👤</span>
                    <div>
                      <p className="text-[11px] text-muted">
                        {t.creditsMadeBy}
                      </p>
                      <p className="font-semibold text-foreground">FajarWG</p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex items-center gap-3">
                    <span className="text-base">✉️</span>
                    <div>
                      <p className="text-[11px] text-muted">
                        {t.creditsContact}
                      </p>
                      <a
                        href="mailto:fajarwahyugumelar@gmail.com"
                        className="font-medium text-accent hover:underline"
                      >
                        fajarwahyugumelar@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* GitHub */}
                  <div className="flex items-center gap-3">
                    <span className="text-base">🐙</span>
                    <div>
                      <a
                        href="https://github.com/fajarwg/read-japan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-accent hover:underline"
                      >
                        {t.creditsOpenSource}
                      </a>
                    </div>
                  </div>
                </div>
              </Modal.Body>

              <Modal.Footer className="px-6 pb-5 pt-2">
                <Button slot="close" variant="secondary" className="w-full cursor-pointer">
                  {t.onboardingClose}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* ── Guide modal ─────────────────────────────────────────────────────── */}
      <Modal isOpen={guideOpen} onOpenChange={setGuideOpen}>
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
                    <>
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-surface-muted">
                          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-border border-t-accent" />
                        </div>
                      )}
                      <Image
                        src={current.imageSrc}
                        alt={current.imageAlt ?? current.title}
                        fill
                        className={`object-cover transition-opacity duration-300 ${imageLoading ? "opacity-0" : "opacity-100"}`}
                        sizes="(max-width: 640px) 100vw, 249px"
                        onLoad={() => setImageLoading(false)}
                      />
                    </>
                  ) : (
                    <span className="text-6xl select-none">
                      {current.emoji}
                    </span>
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
                        "h-1.5 rounded-full transition-all duration-200 cursor-pointer",
                        i === step
                          ? "w-5 bg-accent"
                          : "w-1.5 bg-border hover:bg-muted",
                      ].join(" ")}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </Modal.Body>

              <Modal.Footer className="flex flex-col gap-2 px-6 pt-3">
                {/* Back / Next row */}
                <div className="flex gap-2">
                  {step > 0 && (
                    <Button
                      variant="secondary"
                      className="flex-1 cursor-pointer"
                      onPress={handleBack}
                    >
                      {t.onboardingBack}
                    </Button>
                  )}
                  {isLast ? (
                    /* Last slide: "Start!" closes the modal */
                    <Button slot="close" variant="primary" className="flex-1 cursor-pointer">
                      {t.onboardingStart}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      className="flex-1 cursor-pointer"
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
                  className="text-[11px] text-muted w-full cursor-pointer"
                  onPress={handleDontShow}
                >
                  {t.onboardingDontShow}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
