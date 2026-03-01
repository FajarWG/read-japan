"use client";

import Link from "next/link";
import {
  buttonVariants,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Chip,
  Separator,
  Tooltip,
} from "@heroui/react";

import Reader from "@/src/modules/stories/components/Reader";
import { ThemeToggle } from "@/src/modules/theme/components/ThemeToggle";
import { LanguageToggle } from "@/src/modules/language/components/LanguageToggle";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

export interface StoryForRead {
  id: number;
  title: string;
  content: string;
  translation: string | null;
  focus: string | null;
  totalReads: number;
  createdAt: Date;
}

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

function countKanaChars(text: string): number {
  return (text.match(/[\u3040-\u309f\u30a0-\u30ff]/g) ?? []).length;
}

// ─────────────────────────────────────────
// Component
// ─────────────────────────────────────────

export function ReadPageContent({ story }: { story: StoryForRead }) {
  const { lang, t } = useLanguage();

  const kanaCount = countKanaChars(story.content);
  const mins = Math.ceil(story.content.length / 300);
  const readingTime = mins <= 1 ? t.lessThanMinute : `${mins} ${t.minutes}`;

  const dateLocale = lang === "en" ? "en-US" : "id-ID";
  const formattedDate = new Intl.DateTimeFormat(dateLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(story.createdAt));

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col">
        {/* ── Top bar ──────────────────────────────────────── */}
        <header className="border-b border-border backdrop-blur-sm rounded-t-2xl">
          <div className="grid grid-cols-3 items-center px-4 py-3">
            {/* Left: Back button */}
            <div className="flex items-center">
              <Link
                href="/"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "shrink-0",
                })}
              >
                {t.back}
              </Link>
            </div>

            {/* Center: Title */}
            <div className="flex justify-center">
              <span className="font-jp text-sm font-semibold text-foreground line-clamp-1 text-center max-w-40 sm:max-w-xs">
                Reading Mode
              </span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center justify-end gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* ── Main content ─────────────────────────────────── */}
        <main className="px-4 py-10">
          <Card className="bg-surface border border-border shadow-sm rounded-2xl overflow-hidden">
            {/* Card header */}
            <CardHeader className="px-8 pt-8 pb-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="font-jp text-3xl font-bold leading-snug text-foreground">
                  {story.title}
                </CardTitle>
                <Tooltip delay={0}>
                  <Tooltip.Trigger>
                    <button
                      type="button"
                      aria-label="Reading guide"
                      className="mt-1 flex items-center justify-center w-7 h-7 rounded-full text-muted hover:text-foreground hover:bg-surface-muted transition-colors shrink-0"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Content className="max-w-72">
                    <div className="flex flex-col gap-2 py-0.5">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs font-semibold">
                          {t.readingModeTitle}
                        </p>
                        <p className="text-xs text-muted">
                          {t.readingModeDesc}
                        </p>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs font-semibold">
                          {t.reviewModeTitle}
                        </p>
                        <p className="text-xs text-muted">{t.reviewModeDesc}</p>
                      </div>
                    </div>
                  </Tooltip.Content>
                </Tooltip>
              </div>

              {/* Meta badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Chip
                  variant="soft"
                  size="sm"
                  className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 font-medium text-xs"
                >
                  ✍️ {kanaCount} kana
                </Chip>
                <Chip
                  variant="soft"
                  size="sm"
                  className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 font-medium text-xs"
                >
                  ⏱️ {readingTime}
                </Chip>
                {story.focus && (
                  <Chip
                    variant="soft"
                    size="sm"
                    className="bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 font-medium font-jp text-xs"
                  >
                    🎯 {story.focus}
                  </Chip>
                )}
              </div>
            </CardHeader>

            <div className="px-8">
              <Separator className="bg-border" />
            </div>

            {/* Card body */}
            <CardContent className="px-8 pt-6">
              <article className="font-jp">
                <Reader
                  storyContent={story.content}
                  translation={story.translation ?? undefined}
                  storyId={story.id}
                />
              </article>
            </CardContent>

            {/* Card footer */}
            <CardFooter className="px-8 py-5 flex items-center justify-between text-xs text-muted">
              <span>Story #{story.id}</span>
              <span>
                {t.createdOn} {formattedDate}
              </span>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
}
