import { prisma } from "@/src/shared/lib/db";

export interface GoalDetails {
  id: number;
  type: string;
  targetLevel: string;
  targetDate: string;
  examDate: string | null;
  daysRemaining: number;
  weeksRemaining: number;
  progressPercent: number;
  status: "Ahead" | "On Track" | "Behind";
  plannerMode: "Normal" | "Intensive" | "Review Focus";
  remainingMaterial: {
    vocabCount: number;
    grammarCount: number;
    kanjiCount: number;
  };
}

export interface MissionItem {
  id: number;
  title: string;
  module: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
}

export async function getUserActiveGoal(userId?: number): Promise<GoalDetails | null> {
  const defaultExamDate = new Date("2026-12-06T00:00:00Z"); // Default upcoming JLPT Dec 6, 2026

  if (!userId) {
    const now = new Date();
    const diffTime = defaultExamDate.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const weeksRemaining = Math.ceil(daysRemaining / 7);

    return {
      id: 0,
      type: "JLPT_N4",
      targetLevel: "N4",
      targetDate: defaultExamDate.toISOString(),
      examDate: defaultExamDate.toISOString(),
      daysRemaining,
      weeksRemaining,
      progressPercent: 58,
      status: "On Track",
      plannerMode: daysRemaining > 60 ? "Normal" : daysRemaining > 7 ? "Intensive" : "Review Focus",
      remainingMaterial: {
        vocabCount: 420,
        grammarCount: 28,
        kanjiCount: 112,
      },
    };
  }

  const goal = await prisma.goal.findFirst({
    where: { userId, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

  if (!goal) return null;

  const now = new Date();
  const exam = goal.examDate ? new Date(goal.examDate) : new Date(goal.targetDate);
  const diffTime = exam.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const weeksRemaining = Math.ceil(daysRemaining / 7);

  // Compute progress percent based on SRS completed cards
  const totalCompleted = await prisma.ankiProgress.count({
    where: { userId, repetitions: { gte: 1 } },
  });

  const targetCards = goal.targetLevel === "N5" ? 600 : goal.targetLevel === "N4" ? 1500 : 2500;
  const progressPercent = Math.min(100, Math.round((totalCompleted / targetCards) * 100));

  const plannerMode =
    daysRemaining > 60 ? "Normal" : daysRemaining > 7 ? "Intensive" : "Review Focus";

  // Determine status (Ahead, On Track, Behind)
  let status: "Ahead" | "On Track" | "Behind" = "On Track";
  if (progressPercent > 60) status = "Ahead";
  else if (progressPercent < 30) status = "Behind";

  const remainingCards = Math.max(0, targetCards - totalCompleted);

  return {
    id: goal.id,
    type: goal.type,
    targetLevel: goal.targetLevel,
    targetDate: goal.targetDate.toISOString(),
    examDate: exam.toISOString(),
    daysRemaining,
    weeksRemaining,
    progressPercent,
    status,
    plannerMode,
    remainingMaterial: {
      vocabCount: remainingCards,
      grammarCount: Math.round(remainingCards * 0.08),
      kanjiCount: Math.round(remainingCards * 0.2),
    },
  };
}

export async function getTodayMissions(userId?: number): Promise<MissionItem[]> {
  const todayStr = new Date().toISOString().split("T")[0];
  const activeGoal = await getUserActiveGoal(userId);
  const plannerMode = activeGoal?.plannerMode || "Normal";

  if (!userId) {
    if (plannerMode === "Review Focus") {
      return [
        { id: 1, title: "Review 60 SRS Flashcards (Review Focus)", module: "Anki Review", targetCount: 60, currentCount: 30, completed: false },
        { id: 2, title: "Fix 5 Weak Kanji Confusions", module: "Adaptive Engine", targetCount: 5, currentCount: 2, completed: false },
        { id: 3, title: "Practice 1 Kanji Writing Canvas", module: "Kakou Handwriting", targetCount: 1, currentCount: 1, completed: true },
      ];
    }

    if (plannerMode === "Intensive") {
      return [
        { id: 1, title: "Review 45 SRS Flashcards (Intensive)", module: "Anki Review", targetCount: 45, currentCount: 20, completed: false },
        { id: 2, title: "Learn 8 New Vocabulary", module: "Explore Layer", targetCount: 8, currentCount: 8, completed: true },
        { id: 3, title: "Practice 2 Grammar Lessons", module: "Bunpou Grammar", targetCount: 2, currentCount: 1, completed: false },
        { id: 4, title: "Complete 1 Kanji Canvas Writing", module: "Kakou Handwriting", targetCount: 1, currentCount: 1, completed: true },
      ];
    }

    return [
      { id: 1, title: "Review 30 SRS Flashcards", module: "Anki Review", targetCount: 30, currentCount: 15, completed: false },
      { id: 2, title: "Learn 5 New Vocabulary", module: "Explore Layer", targetCount: 5, currentCount: 5, completed: true },
      { id: 3, title: "Practice 1 Grammar Lesson", module: "Bunpou Grammar", targetCount: 1, currentCount: 1, completed: true },
      { id: 4, title: "Complete 1 Kanji Writing Canvas", module: "Kakou Handwriting", targetCount: 1, currentCount: 0, completed: false },
    ];
  }

  const existing = await prisma.dailyMission.findMany({
    where: { userId, date: todayStr },
  });

  if (existing.length > 0) {
    return existing.map((m) => ({
      id: m.id,
      title: m.title,
      module: m.module,
      targetCount: m.targetCount,
      currentCount: m.currentCount,
      completed: m.completed,
    }));
  }

  // Seed missions adjusted for plannerMode
  const missionsByMode = {
    "Review Focus": [
      { title: "Review 60 SRS Flashcards (Review Focus)", module: "Anki Review", targetCount: 60 },
      { title: "Fix 5 Weak Kanji Confusions", module: "Adaptive Engine", targetCount: 5 },
      { title: "Complete 1 Kanji Canvas Writing", module: "Kakou Handwriting", targetCount: 1 },
    ],
    Intensive: [
      { title: "Review 45 SRS Flashcards (Intensive)", module: "Anki Review", targetCount: 45 },
      { title: "Explore 8 New Vocabulary", module: "Explore Layer", targetCount: 8 },
      { title: "Practice 2 Grammar Lessons", module: "Bunpou Grammar", targetCount: 2 },
      { title: "Complete 1 Kanji Canvas Writing", module: "Kakou Handwriting", targetCount: 1 },
    ],
    Normal: [
      { title: "Review 30 SRS Flashcards", module: "Anki Review", targetCount: 30 },
      { title: "Explore 5 New Vocabulary", module: "Explore Layer", targetCount: 5 },
      { title: "Practice 1 Grammar Lesson", module: "Bunpou Grammar", targetCount: 1 },
      { title: "Complete 1 Kanji Canvas Writing", module: "Kakou Handwriting", targetCount: 1 },
    ],
  };

  const selectedMissions = missionsByMode[plannerMode] || missionsByMode.Normal;
  const created = [];
  for (const dm of selectedMissions) {
    const record = await prisma.dailyMission.create({
      data: {
        userId,
        date: todayStr,
        title: dm.title,
        module: dm.module,
        targetCount: dm.targetCount,
        currentCount: 0,
        completed: false,
      },
    });
    created.push({
      id: record.id,
      title: record.title,
      module: record.module,
      targetCount: record.targetCount,
      currentCount: record.currentCount,
      completed: record.completed,
    });
  }

  return created;
}

export async function getLearningCalendarData(userId?: number) {
  if (!userId) {
    const days = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      days.push({
        date: d.toISOString().split("T")[0],
        count: (i % 3 === 0) ? 0 : ((i * 7) % 20) + 5,
        isExamDay: i === 5,
      });
    }
    return days;
  }

  const calendarLogs = await prisma.learningCalendar.findMany({
    where: { userId },
    take: 90,
  });

  return calendarLogs.map((c) => ({
    date: c.date,
    count: c.reviewCount + c.studyMinutes,
    isExamDay: false,
  }));
}
