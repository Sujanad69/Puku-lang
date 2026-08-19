import { SRSItem, SRSReviewQuality, UserProgress, VocabWord } from '../types';

export const SRS_LEVELS_LABEL: Record<number, { name: string; color: string; badge: string; intervalDesc: string }> = {
  0: { name: 'Due / Relearning', color: 'text-rose-500 bg-rose-500/10 border-rose-500/30', badge: '🔴 Due Now', intervalDesc: 'Needs immediate review' },
  1: { name: 'Novice (1 Day)', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30', badge: '🟡 1d Interval', intervalDesc: 'Review tomorrow' },
  2: { name: 'Familiar (3 Days)', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30', badge: '🟡 3d Interval', intervalDesc: 'Review in 3 days' },
  3: { name: 'Competent (7 Days)', color: 'text-blue-500 bg-blue-500/10 border-blue-500/30', badge: '🔵 7d Interval', intervalDesc: 'Review in 1 week' },
  4: { name: 'Proficient (14 Days)', color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30', badge: '🟣 14d Interval', intervalDesc: 'Review in 2 weeks' },
  5: { name: 'Mastered / Long-Term', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30', badge: '🟢 30d+ Mature', intervalDesc: 'Locked in long-term memory' },
};

/**
 * Returns today's date formatted as YYYY-MM-DD
 */
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Adds days to a given YYYY-MM-DD date or today
 */
export function addDaysToDate(days: number, fromDateStr?: string): string {
  const base = fromDateStr ? new Date(fromDateStr) : new Date();
  base.setDate(base.getDate() + days);
  return base.toISOString().split('T')[0];
}

/**
 * Calculates days difference between two YYYY-MM-DD dates (positive if target is in future)
 */
export function getDaysDifference(targetDateStr: string, fromDateStr = getTodayDateString()): number {
  const target = new Date(targetDateStr).getTime();
  const from = new Date(fromDateStr).getTime();
  const diffTime = target - from;
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Core SM-2 / Leitner Spaced Repetition scheduling algorithm
 */
export function calculateSRSUpdate(
  current: SRSItem | undefined,
  quality: SRSReviewQuality,
  wordInfo: { pt: string; en: string; phonetic?: string; nepali?: string }
): SRSItem {
  const today = getTodayDateString();
  const nowIso = new Date().toISOString();

  let easeFactor = current?.easeFactor ?? 2.5;
  let repetitions = current?.repetitions ?? 0;
  let lapses = current?.lapses ?? 0;
  let level = current?.level ?? 0;
  let intervalDays = current?.intervalDays ?? 0;

  switch (quality) {
    case 'again': {
      // Memory lapse: reset interval and repetitions
      lapses += 1;
      repetitions = 0;
      level = 0;
      intervalDays = 0; // Due today / immediately
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      break;
    }
    case 'hard': {
      // Hard recall: minor interval growth
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      if (repetitions === 0) {
        intervalDays = 1;
        level = 1;
        repetitions = 1;
      } else {
        intervalDays = Math.max(1, Math.round(intervalDays * 1.2));
        level = Math.min(5, Math.max(1, level));
      }
      break;
    }
    case 'good': {
      // Successful standard recall
      repetitions += 1;
      if (repetitions === 1) {
        intervalDays = 1;
        level = 1;
      } else if (repetitions === 2) {
        intervalDays = 3;
        level = 2;
      } else if (repetitions === 3) {
        intervalDays = 7;
        level = 3;
      } else if (repetitions === 4) {
        intervalDays = 14;
        level = 4;
      } else {
        intervalDays = Math.round(Math.max(14, intervalDays) * easeFactor);
        level = 5;
      }
      break;
    }
    case 'easy': {
      // Effortless recall: accelerates interval growth
      repetitions += 1;
      easeFactor = Math.min(3.2, easeFactor + 0.15);
      if (repetitions === 1) {
        intervalDays = 3;
        level = 2;
      } else if (repetitions === 2) {
        intervalDays = 7;
        level = 3;
      } else if (repetitions === 3) {
        intervalDays = 14;
        level = 4;
      } else {
        intervalDays = Math.round(Math.max(14, intervalDays) * easeFactor * 1.35);
        level = 5;
      }
      break;
    }
  }

  const nextReviewAt = addDaysToDate(intervalDays, today);
  const prevHistory = current?.history || [];
  const updatedHistory = [...prevHistory, { date: nowIso, quality }].slice(-15); // Keep last 15 reviews

  return {
    wordPt: wordInfo.pt,
    en: wordInfo.en,
    phonetic: wordInfo.phonetic || current?.phonetic,
    nepali: wordInfo.nepali || current?.nepali,
    level,
    intervalDays,
    lastReviewedAt: nowIso,
    nextReviewAt,
    repetitions,
    easeFactor: Number(easeFactor.toFixed(2)),
    lapses,
    history: updatedHistory,
  };
}

/**
 * Calculates current retention percentage based on the Ebbinghaus forgetting curve
 */
export function calculateRetentionScore(item: SRSItem): number {
  const today = getTodayDateString();
  const diffDays = getDaysDifference(item.nextReviewAt, today);

  // If next review is in the future, retention is still high (85 - 100%)
  if (diffDays > 0) {
    const totalSpan = Math.max(1, item.intervalDays);
    const remainingRatio = diffDays / totalSpan;
    return Math.min(100, Math.round(85 + remainingRatio * 15));
  }

  // If overdue (diffDays <= 0), retention decays based on how many days overdue
  const overdueDays = Math.abs(diffDays);
  const stability = Math.max(1, item.intervalDays);
  const retention = Math.exp(-overdueDays / (stability * 1.5)) * 85;
  return Math.max(15, Math.min(85, Math.round(retention)));
}

/**
 * Aggregates statistics for SRS dashboard
 */
export function getSRSStats(srsRecords: Record<string, SRSItem> = {}) {
  const today = getTodayDateString();
  const items = Object.values(srsRecords);

  const dueItems: SRSItem[] = [];
  const learningItems: SRSItem[] = [];
  const matureItems: SRSItem[] = [];

  let totalRetention = 0;

  items.forEach((item) => {
    const retention = calculateRetentionScore(item);
    totalRetention += retention;

    if (item.nextReviewAt <= today || item.level === 0) {
      dueItems.push(item);
    } else if (item.level >= 4) {
      matureItems.push(item);
    } else {
      learningItems.push(item);
    }
  });

  const averageRetention = items.length > 0 ? Math.round(totalRetention / items.length) : 100;

  return {
    totalTracked: items.length,
    dueToday: dueItems,
    dueCount: dueItems.length,
    learning: learningItems,
    learningCount: learningItems.length,
    mature: matureItems,
    matureCount: matureItems.length,
    averageRetention,
  };
}

/**
 * Seeds initial SRS entries from completed units, weak words, and starter vocabulary
 * so that users immediately have active spaced repetition data to interact with.
 */
export function seedInitialSRSRecords(
  progress: UserProgress,
  allWords: VocabWord[]
): Record<string, SRSItem> {
  const today = getTodayDateString();
  const records: Record<string, SRSItem> = { ...(progress.srsRecords || {}) };

  // If user already has 10+ records, return existing
  if (Object.keys(records).length >= 10) {
    return records;
  }

  // 1. Seed weak words as Level 0 (Due immediately)
  progress.weakWords.forEach((w) => {
    if (!records[w.pt]) {
      records[w.pt] = {
        wordPt: w.pt,
        en: w.en,
        phonetic: w.phonetic,
        nepali: w.nepali,
        level: 0,
        intervalDays: 0,
        lastReviewedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        nextReviewAt: today,
        repetitions: 0,
        easeFactor: 2.3,
        lapses: 1,
      };
    }
  });

  // 2. Seed some initial words with varied staggered intervals (1d, 3d, 7d, 14d) to represent initial memory stages
  const sampleWords = allWords.slice(0, 18);
  const distribution = [
    { level: 0, interval: 0, daysAgo: 1, nextOffset: 0 },   // Due today
    { level: 1, interval: 1, daysAgo: 0, nextOffset: 1 },   // Due tomorrow
    { level: 2, interval: 3, daysAgo: 1, nextOffset: 2 },   // In 2 days
    { level: 3, interval: 7, daysAgo: 2, nextOffset: 5 },   // In 5 days
    { level: 4, interval: 14, daysAgo: 4, nextOffset: 10 }, // In 10 days
    { level: 5, interval: 30, daysAgo: 6, nextOffset: 24 }, // In 24 days
  ];

  sampleWords.forEach((w, idx) => {
    if (!records[w.pt]) {
      const cfg = distribution[idx % distribution.length];
      const lastReviewedDate = new Date(Date.now() - 86400000 * cfg.daysAgo).toISOString();
      const nextReviewDate = addDaysToDate(cfg.nextOffset, today);

      records[w.pt] = {
        wordPt: w.pt,
        en: w.en,
        phonetic: w.phonetic,
        nepali: w.nepali,
        level: cfg.level,
        intervalDays: cfg.interval,
        lastReviewedAt: lastReviewedDate,
        nextReviewAt: nextReviewDate,
        repetitions: cfg.level,
        easeFactor: 2.5,
        lapses: 0,
      };
    }
  });

  return records;
}
