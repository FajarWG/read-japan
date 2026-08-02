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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Nihongo Flow Platform
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Learning Hub
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {session && (
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                👤 {session.username}
              </span>
            )}
            <SettingsDropdown />
          </div>
        </div>

        {/* Learning Hub Widgets */}
        <LearningHub />
      </div>
    </div>
  );
}
