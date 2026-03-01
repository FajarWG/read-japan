"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Modal,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Chip,
} from "@heroui/react";
import { useLanguage } from "@/src/modules/language/components/LanguageProvider";

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
export interface StoryItem {
  id: number;
  title: string;
  content: string;
  focus: string | null;
  totalReads: number;
  createdAt: Date;
}

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────
function countKana(text: string): number {
  return (text.match(/[\u3040-\u309f\u30a0-\u30ff]/g) ?? []).length;
}

function formatDate(date: Date, lang: string): string {
  return new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

// ─────────────────────────────────────────
// Component
// ─────────────────────────────────────────
export function StoryPickerModal({ stories }: { stories: StoryItem[] }) {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [selected, setSelected] = useState<number | null>(null);

  function handlePick(id: number) {
    setSelected(id);
    router.push(`/read/${id}`);
  }

  return (
    <Modal>
      <Button variant="secondary" size="sm" className="shrink-0">
        📚 {t.chooseStory}
      </Button>
      <Modal.Backdrop>
        <Modal.Container scroll="inside" size="lg">
          <Modal.Dialog className="sm:max-w-130">
            <Modal.Header>
              <Modal.Heading>{t.chooseStory}</Modal.Heading>
              <p className="text-sm leading-5 text-muted">
                {t.storiesAvailable.replace("{n}", String(stories.length))}
              </p>
            </Modal.Header>

            <Modal.Body className="flex flex-col gap-2 pb-2">
              {stories.map((story, i) => (
                <button
                  key={story.id}
                  onClick={() => handlePick(story.id)}
                  disabled={selected === story.id}
                  className="w-full text-left"
                  aria-label={`Baca cerita: ${story.title}`}
                >
                  <Card
                    className={[
                      "border bg-surface shadow-none transition-all duration-150 rounded-xl cursor-pointer",
                      selected === story.id
                        ? "border-accent/60 opacity-60"
                        : "border-border hover:border-accent/50 hover:shadow-md",
                    ].join(" ")}
                  >
                    <CardHeader className="flex flex-row items-start justify-between gap-4 px-5 pt-4 pb-2">
                      {/* Left: number + title */}
                      <div className="min-w-0 flex flex-col gap-0.5">
                        <span className="text-[11px] font-medium text-muted">
                          #{i + 1}
                        </span>
                        <CardTitle className="font-jp text-base font-semibold leading-snug text-foreground">
                          {story.title}
                        </CardTitle>
                      </div>

                      {/* Right: badges */}
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <Chip
                          variant="soft"
                          size="sm"
                          className="text-[11px] font-medium"
                        >
                          ✍️ {countKana(story.content)} kana
                        </Chip>
                        <span
                          className={[
                            "text-[11px] font-medium tabular-nums",
                            story.totalReads === 0
                              ? "text-muted"
                              : "text-indigo-500 dark:text-indigo-400",
                          ].join(" ")}
                        >
                          📖 {story.totalReads}x dibaca
                        </span>
                        <span className="text-[11px] text-muted whitespace-nowrap">
                          {formatDate(new Date(story.createdAt), lang)}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="px-5 pb-4">
                      <p className="font-jp line-clamp-2 text-xs leading-relaxed text-muted">
                        {story.content}
                      </p>
                      {story.focus && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted">
                          <span className="shrink-0">🎯</span>
                          <span className="font-jp line-clamp-1">
                            {story.focus}
                          </span>
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </button>
              ))}
            </Modal.Body>

            <Modal.Footer>
              <Button slot="close" variant="secondary">
                {t.cancel}
              </Button>
            </Modal.Footer>
            <Modal.CloseTrigger />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
