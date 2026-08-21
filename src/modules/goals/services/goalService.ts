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
  slotKey: "morning" | "afternoon" | "evening";
  timeRange: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  isCurrentSlot: boolean;
  module: string;
}

export interface CalendarDayItem {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3;
  completedSessions: number;
  sessions: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
  reviewCount: number;
  studyMinutes: number;
  isExamDay: boolean;
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

export async function getTodayMissions(
  userId?: number,
  customTarget?: number,
): Promise<MissionItem[]> {
  const todayStr = new Date().toISOString().split("T")[0];
  const now = new Date();
  const currentHour = now.getHours();

  const isMorningSlot = currentHour >= 0 && currentHour < 10;
  const isAfternoonSlot = currentHour >= 10 && currentHour < 15;
  const isEveningSlot = currentHour >= 15 && currentHour < 24;

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const morningEnd = new Date(now);
  morningEnd.setHours(10, 0, 0, 0);

  const afternoonEnd = new Date(now);
  afternoonEnd.setHours(15, 0, 0, 0);

  let morningCards = 0;
  let afternoonCards = 0;
  let eveningCards = 0;

  let morningSeconds = 0;
  let afternoonSeconds = 0;
  let eveningSeconds = 0;

  if (userId) {
    // 1. Fetch Anki Review Events for today
    const reviewEvents = await prisma.ankiReviewEvent.findMany({
      where: {
        userId,
        createdAt: { gte: startOfDay },
      },
      select: { createdAt: true },
    });

    for (const rev of reviewEvents) {
      const h = new Date(rev.createdAt).getHours();
      if (h < 10) morningCards++;
      else if (h < 15) afternoonCards++;
      else eveningCards++;
    }

    // 2. Fetch Study Timer Sessions for today
    const timerSessions = await prisma.studyTimerSession.findMany({
      where: {
        userId,
        startedAt: { gte: startOfDay },
      },
      select: { startedAt: true, accumulatedSeconds: true },
    });

    for (const t of timerSessions) {
      const h = new Date(t.startedAt).getHours();
      if (h < 10) morningSeconds += t.accumulatedSeconds;
      else if (h < 15) afternoonSeconds += t.accumulatedSeconds;
      else eveningSeconds += t.accumulatedSeconds;
    }

    // 3. Fallback to general ActivityLog
    const activityLogs = await prisma.activityLog.findMany({
      where: {
        userId,
        createdAt: { gte: startOfDay },
      },
      select: { createdAt: true },
    });

    for (const act of activityLogs) {
      const h = new Date(act.createdAt).getHours();
      if (h < 10 && morningCards === 0) morningCards += 1;
      else if (h >= 10 && h < 15 && afternoonCards === 0) afternoonCards += 1;
      else if (h >= 15 && eveningCards === 0) eveningCards += 1;
    }
  }

  // Study threshold: customizable target count (default: 5)
  const TARGET_CARDS = customTarget && customTarget > 0 ? customTarget : 5;
  const morningCompleted = morningCards >= TARGET_CARDS || morningSeconds >= 180;
  const afternoonCompleted = afternoonCards >= TARGET_CARDS || afternoonSeconds >= 180;
  const eveningCompleted = eveningCards >= TARGET_CARDS || eveningSeconds >= 180;

  const defaultMissions: Array<{
    id: number;
    title: string;
    slotKey: "morning" | "afternoon" | "evening";
    timeRange: string;
    targetCount: number;
    currentCount: number;
    completed: boolean;
    isCurrentSlot: boolean;
    module: string;
  }> = [
    {
      id: 1,
      title: "Morning Study",
      slotKey: "morning",
      timeRange: "00:00 - 10:00",
      targetCount: TARGET_CARDS,
      currentCount: morningCards,
      completed: morningCompleted,
      isCurrentSlot: isMorningSlot,
      module: "Morning Session",
    },
    {
      id: 2,
      title: "Afternoon Study",
      slotKey: "afternoon",
      timeRange: "10:00 - 15:00",
      targetCount: TARGET_CARDS,
      currentCount: afternoonCards,
      completed: afternoonCompleted,
      isCurrentSlot: isAfternoonSlot,
      module: "Afternoon Session",
    },
    {
      id: 3,
      title: "Evening Study",
      slotKey: "evening",
      timeRange: "15:00 - 24:00",
      targetCount: TARGET_CARDS,
      currentCount: eveningCards,
      completed: eveningCompleted,
      isCurrentSlot: isEveningSlot,
      module: "Evening Session",
    },
  ];

  if (!userId) {
    return defaultMissions;
  }

  // Update DailyMission database records
  const existing = await prisma.dailyMission.findMany({
    where: { userId, date: todayStr },
  });

  const needsReseed =
    existing.length !== 3 ||
    existing.some((e) => !defaultMissions.some((dm) => dm.title === e.title));

  if (needsReseed) {
    await prisma.dailyMission.deleteMany({
      where: { userId, date: todayStr },
    });

    for (const dm of defaultMissions) {
      await prisma.dailyMission.create({
        data: {
          userId,
          date: todayStr,
          title: dm.title,
          module: dm.module,
          targetCount: dm.targetCount,
          currentCount: dm.currentCount,
          completed: dm.completed,
        },
      });
    }
  } else {
    for (const dm of defaultMissions) {
      const match = existing.find((e) => e.title === dm.title);
      if (match && (match.completed !== dm.completed || match.currentCount !== dm.currentCount)) {
        await prisma.dailyMission.update({
          where: { id: match.id },
          data: {
            completed: dm.completed,
            currentCount: dm.currentCount,
          },
        });
      }
    }
  }

  // Also sync with LearningCalendar entry for today
  const completedSlots =
    (morningCompleted ? 1 : 0) +
    (afternoonCompleted ? 1 : 0) +
    (eveningCompleted ? 1 : 0);
  const totalTodayReviews = morningCards + afternoonCards + eveningCards;
  const totalTodayMinutes = Math.round(
    (morningSeconds + afternoonSeconds + eveningSeconds) / 60,
  );

  await prisma.learningCalendar.upsert({
    where: { userId_date: { userId, date: todayStr } },
    create: {
      userId,
      date: todayStr,
      completedMissions: completedSlots,
      reviewCount: totalTodayReviews,
      studyMinutes: totalTodayMinutes,
    },
    update: {
      completedMissions: completedSlots,
      reviewCount: totalTodayReviews,
      studyMinutes: totalTodayMinutes,
    },
  });

  return defaultMissions;
}

export async function getLearningCalendarData(
  userId?: number,
): Promise<CalendarDayItem[]> {
  const activeGoal = await getUserActiveGoal(userId);
  const examDateStr = activeGoal?.examDate
    ? new Date(activeGoal.examDate).toISOString().split("T")[0]
    : null;

  const now = new Date();
  const DAYS_TO_SHOW = 140; // 20 weeks × 7 days (approx 5 months)

  if (!userId) {
    const days: CalendarDayItem[] = [];
    for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dateStr = d.toISOString().split("T")[0];
      const rand = (i * 13) % 10;
      const completedSessions = i === 0 ? 1 : rand > 6 ? 3 : rand > 3 ? 2 : rand > 1 ? 1 : 0;
      const level = (completedSessions >= 3 ? 3 : completedSessions === 2 ? 2 : completedSessions === 1 ? 1 : 0) as 0 | 1 | 2 | 3;

      days.push({
        date: dateStr,
        count: completedSessions * 5 + 5,
        level,
        completedSessions,
        sessions: {
          morning: completedSessions >= 1,
          afternoon: completedSessions >= 2,
          evening: completedSessions >= 3,
        },
        reviewCount: completedSessions * 10,
        studyMinutes: completedSessions * 15,
        isExamDay: examDateStr ? dateStr === examDateStr : false,
      });
    }
    return days;
  }

  const startDate = new Date(now.getTime() - DAYS_TO_SHOW * 86400000);

  // Fetch all calendar logs and review events in the range
  const [calendarLogs, reviewEvents] = await Promise.all([
    prisma.learningCalendar.findMany({
      where: { userId },
    }),
    prisma.ankiReviewEvent.findMany({
      where: {
        userId,
        createdAt: { gte: startDate },
      },
      select: { createdAt: true },
    }),
  ]);

  const calLogMap = new Map<string, { completedMissions: number; reviewCount: number; studyMinutes: number }>();
  for (const c of calendarLogs) {
    calLogMap.set(c.date, {
      completedMissions: c.completedMissions,
      reviewCount: c.reviewCount,
      studyMinutes: c.studyMinutes,
    });
  }

  const daySlotMap = new Map<string, { morning: number; afternoon: number; evening: number }>();
  for (const r of reviewEvents) {
    const dateStr = new Date(r.createdAt).toISOString().split("T")[0];
    const h = new Date(r.createdAt).getHours();
    const entry = daySlotMap.get(dateStr) || { morning: 0, afternoon: 0, evening: 0 };
    if (h < 10) entry.morning++;
    else if (h < 15) entry.afternoon++;
    else entry.evening++;
    daySlotMap.set(dateStr, entry);
  }

  const days: CalendarDayItem[] = [];
  for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = d.toISOString().split("T")[0];
    const cal = calLogMap.get(dateStr);
    const slots = daySlotMap.get(dateStr) || { morning: 0, afternoon: 0, evening: 0 };

    const morning = slots.morning >= 5;
    const afternoon = slots.afternoon >= 5;
    const evening = slots.evening >= 5;

    let completedSessions = (morning ? 1 : 0) + (afternoon ? 1 : 0) + (evening ? 1 : 0);
    if (cal && cal.completedMissions > completedSessions) {
      completedSessions = cal.completedMissions;
    }

    const level = (
      completedSessions >= 3 ? 3 : completedSessions === 2 ? 2 : completedSessions === 1 ? 1 : 0
    ) as 0 | 1 | 2 | 3;

    const reviewCount = cal?.reviewCount ?? (slots.morning + slots.afternoon + slots.evening);
    const studyMinutes = cal?.studyMinutes ?? Math.round(reviewCount * 1.5);

    days.push({
      date: dateStr,
      count: reviewCount,
      level,
      completedSessions,
      sessions: {
        morning: morning || completedSessions >= 1,
        afternoon: afternoon || completedSessions >= 2,
        evening: evening || completedSessions >= 3,
      },
      reviewCount,
      studyMinutes,
      isExamDay: examDateStr ? dateStr === examDateStr : false,
    });
  }

  return days;
}
