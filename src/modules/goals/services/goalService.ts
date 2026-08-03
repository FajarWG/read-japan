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

  if (!goal) {
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
      progressPercent: 0,
      status: "On Track",
      plannerMode: daysRemaining > 60 ? "Normal" : daysRemaining > 7 ? "Intensive" : "Review Focus",
      remainingMaterial: {
        vocabCount: 1500,
        grammarCount: 120,
        kanjiCount: 300,
      },
    };
  }

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
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  let hasSomatomeToday = false;
  let hasAnkiReviewToday = false;
  let hasNewSrsPracticeToday = false;

  if (userId) {
    const [somatomeCount, somatomeActivity, ankiReviewCount, ankiActivity, newSrsCount] = await Promise.all([
      prisma.somatomeAttempt.count({
        where: { userId, createdAt: { gte: startOfDay } },
      }),
      prisma.activityLog.count({
        where: {
          userId,
          type: { in: ["somatome_answer", "somatome_practice"] },
          createdAt: { gte: startOfDay },
        },
      }),
      prisma.ankiProgress.count({
        where: { userId, updatedAt: { gte: startOfDay }, repetitions: { gte: 1 } },
      }),
      prisma.activityLog.count({
        where: {
          userId,
          type: { in: ["anki_review", "anki_study"] },
          createdAt: { gte: startOfDay },
        },
      }),
      prisma.ankiProgress.count({
        where: { userId, createdAt: { gte: startOfDay } },
      }),
    ]);

    hasSomatomeToday = (somatomeCount + somatomeActivity) > 0;
    hasAnkiReviewToday = (ankiReviewCount + ankiActivity) > 0;
    hasNewSrsPracticeToday = newSrsCount > 0;
  }

  const defaultMissions = [
    { title: "Somatome Study", module: "Somatome", autoCompleted: hasSomatomeToday },
    { title: "Review Anki SRS Flashcards", module: "Anki Review", autoCompleted: hasAnkiReviewToday },
    { title: "Practice New SRS Cards", module: "Anki Practice", autoCompleted: hasNewSrsPracticeToday },
  ];

  if (!userId) {
    return defaultMissions.map((m, idx) => ({
      id: idx + 1,
      title: m.title,
      module: m.module,
      targetCount: 1,
      currentCount: m.autoCompleted ? 1 : 0,
      completed: m.autoCompleted,
    }));
  }

  const existing = await prisma.dailyMission.findMany({
    where: { userId, date: todayStr },
  });

  const needsReseed = existing.length !== 3 || existing.some((e) => !defaultMissions.some((dm) => dm.title === e.title));

  if (needsReseed) {
    await prisma.dailyMission.deleteMany({
      where: { userId, date: todayStr },
    });

    const created = [];
    for (const dm of defaultMissions) {
      const record = await prisma.dailyMission.create({
        data: {
          userId,
          date: todayStr,
          title: dm.title,
          module: dm.module,
          targetCount: 1,
          currentCount: dm.autoCompleted ? 1 : 0,
          completed: dm.autoCompleted,
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

  const result = [];
  for (const m of existing) {
    let isCompleted = m.completed;
    if (m.title === "Somatome Study" && hasSomatomeToday) isCompleted = true;
    if (m.title === "Review Anki SRS Flashcards" && hasAnkiReviewToday) isCompleted = true;
    if (m.title === "Practice New SRS Cards" && hasNewSrsPracticeToday) isCompleted = true;

    if (isCompleted !== m.completed) {
      await prisma.dailyMission.update({
        where: { id: m.id },
        data: { completed: isCompleted, currentCount: isCompleted ? 1 : 0 },
      });
    }

    result.push({
      id: m.id,
      title: m.title,
      module: m.module,
      targetCount: m.targetCount,
      currentCount: isCompleted ? 1 : 0,
      completed: isCompleted,
    });
  }

  return result;
}

export async function getLearningCalendarData(userId?: number) {
  const activeGoal = await getUserActiveGoal(userId);
  const examDateStr = activeGoal?.examDate ? new Date(activeGoal.examDate).toISOString().split("T")[0] : null;

  if (!userId) {
    const days = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dateStr = d.toISOString().split("T")[0];
      days.push({
        date: dateStr,
        count: (i % 3 === 0) ? 0 : ((i * 7) % 20) + 5,
        isExamDay: examDateStr ? dateStr === examDateStr : i === 5,
      });
    }
    return days;
  }

  const calendarLogs = await prisma.learningCalendar.findMany({
    where: { userId },
  });

  const logMap = new Map<string, number>();
  for (const c of calendarLogs) {
    logMap.set(c.date, c.reviewCount + c.studyMinutes);
  }

  const days = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = d.toISOString().split("T")[0];
    const count = logMap.get(dateStr) || 0;
    days.push({
      date: dateStr,
      count,
      isExamDay: examDateStr ? dateStr === examDateStr : false,
    });
  }

  return days;
}
