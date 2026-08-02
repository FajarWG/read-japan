import { prisma } from "@/src/shared/lib/db";

export interface ActivityItem {
  id: number;
  type: string;
  refId: string | null;
  metadata: any;
  createdAt: string;
}

export interface ContinueLearningState {
  module: string;
  title: string;
  href: string;
  lastActive: string;
}

export async function getLastUserActivity(userId?: number): Promise<ContinueLearningState> {
  if (!userId) {
    return {
      module: "Anki Review",
      title: "JLPT N5-N4 Flashcard Review",
      href: "/anki",
      lastActive: "Just now",
    };
  }

  const lastLog = await prisma.activityLog.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!lastLog) {
    return {
      module: "Anki Review",
      title: "JLPT N5-N4 Flashcard Review",
      href: "/anki",
      lastActive: "Ready to start",
    };
  }

  const moduleMap: Record<string, { module: string; title: string; href: string }> = {
    anki_review: { module: "Anki Review", title: "SRS Flashcards Review", href: "/anki" },
    bunpou_lesson: { module: "Bunpou Grammar", title: "Japanese Grammar Lessons", href: "/bunpou" },
    katsuyou_practice: { module: "Katsuyou Conjugation", title: "Verb & Adjective Conjugation", href: "/katsuyou" },
    kakou_handwriting: { module: "Kakou Handwriting", title: "Kanji Canvas Handwriting", href: "/kakou" },
    prep_sheet: { module: "Dekiru Prep", title: "Pre-class Study Sheets", href: "/prep" },
    conversation: { module: "AI Conversation", title: "3D VRM Japanese Practice", href: "/conversation" },
  };

  const matched = moduleMap[lastLog.type] || {
    module: "Anki Review",
    title: "JLPT N5-N4 Flashcard Review",
    href: "/anki",
  };

  return {
    ...matched,
    lastActive: new Date(lastLog.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

export async function getUserTimeline(userId?: number): Promise<ActivityItem[]> {
  if (!userId) return [];

  const logs = await prisma.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return logs.map((l) => ({
    id: l.id,
    type: l.type,
    refId: l.refId,
    metadata: l.metadata,
    createdAt: new Date(l.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));
}

export async function getCrossModuleRecommendations(userId?: number) {
  const recommendations = [
    {
      module: "Kakou Handwriting",
      title: "Practice Kanji Writing",
      description: "Reinforce your kanji memory by drawing stroke order on canvas.",
      href: "/kakou",
      badge: "Writing",
    },
    {
      module: "Katsuyou Conjugation",
      title: "Verb & Adjective Conjugation",
      description: "Master te-form, past tense, and potential form conjugations.",
      href: "/katsuyou",
      badge: "Grammar",
    },
    {
      module: "Bunpou Grammar",
      title: "Dekiru Grammar Lessons",
      description: "Study sentence patterns and real-life conversation sheets.",
      href: "/bunpou",
      badge: "Sentence",
    },
  ];

  return recommendations;
}
