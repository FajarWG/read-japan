import type { Metadata } from "next";
import { getSession } from "@/src/shared/lib/session";
import { LearningHub } from "@/src/modules/journey/components/LearningHub";
import { SettingsDropdown } from "@/src/shared/components/SettingsDropdown";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nihongo Flow — Learning Hub Dashboard",
  description:
    "Unified Japanese Learning Journey: Anki SRS Flashcards, Knowledge Navigation, Adaptive Error Analysis, and Multi-Skill Practice.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Header (copied from Anki header, with Help ? button removed) */}
        <header className="border-b border-border backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div className="min-w-0">
              <h1 className="font-jp text-base sm:text-lg font-bold leading-tight text-foreground flex items-center gap-2 truncate">
                <span>日本語フロー</span>
                <span className="font-sans text-[10px] sm:text-xs bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                  Home
                </span>
              </h1>
              <p className="text-[10px] sm:text-xs text-muted line-clamp-1 truncate">
                Your Japanese Learning Hub & Study Journey
              </p>
            </div>
            <div className="flex items-center gap-2">
              {session && (
                <span className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border bg-surface text-foreground">
                  👤 {session.username}
                </span>
              )}
              <SettingsDropdown />
            </div>
          </div>
        </header>

        {/* Learning Hub Widgets */}
        <LearningHub />
      </div>
    </div>
  );
}
