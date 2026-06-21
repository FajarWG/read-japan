import type { Metadata } from "next";
import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";
import { KanjiLearning } from "@/src/modules/kanji/components/KanjiLearning";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kanji — Nihongo Flow",
  description: "Belajar kanji JLPT N5 dengan spaced repetition.",
};

export default function KanjiPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="flex w-full max-w-3xl flex-col">
        <header className="border-b border-border backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div>
              <h1 className="font-jp text-lg font-bold leading-tight text-foreground">
                📚 Kanji Learning
              </h1>
              <p className="text-xs text-muted">
                JLPT N5 · Spaced Repetition
              </p>
            </div>
            <div className="flex items-center gap-2">
              <SettingsDropdown />
            </div>
          </div>
        </header>

        <main className="px-4 py-6">
          <KanjiLearning />
        </main>
      </div>
    </div>
  );
}
