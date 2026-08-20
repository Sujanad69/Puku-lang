import { UserProgress, VocabWord } from '../types';
import { OUTFITS_DATA } from '../data/outfitsData';
import { getNepalDateString } from './date';

const STORAGE_KEY = 'portuguese_puku_progress_v3';

export const INITIAL_PROGRESS: UserProgress = {
  xp: 0,
  coins: 0,
  gems: 0,
  hearts: 5,
  streak: 0,
  lastPlayDate: getNepalDateString(),
  purchasedOutfits: ['base'],
  currentOutfitId: 'base',
  weakWords: [],
  masteredWords: [],
  srsRecords: {},
  todayXP: 0,
  dailyGoalXP: 50,
  remindersEnabled: true,
  themeDark: true,
  hasSeenOnboarding: false,
  completedUnits: [],
  completedLessons: {},
  quests: {},
  dailyQuestsDate: getNepalDateString(),
  streakFreezeCount: 0,
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return checkDailyReset(INITIAL_PROGRESS);
    
    const parsed = JSON.parse(raw);
    const merged = { ...INITIAL_PROGRESS, ...parsed };
    return checkDailyReset(merged);
  } catch {
    return INITIAL_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress:', err);
  }
}

function checkDailyReset(progress: UserProgress): UserProgress {
  const today = getNepalDateString();
  const last = progress.lastPlayDate;

  if (last !== today) {
    const yesterdayStr = getNepalDateString(-1);

    let newStreak = progress.streak;
    if (last === yesterdayStr) {
      // Continued streak!
      newStreak += 1;
    } else if (last < yesterdayStr) {
      // Missed a day
      if (progress.streakFrozen) {
        // Freeze item protected streak!
      } else {
        newStreak = 1;
      }
    }

    const updated: UserProgress = {
      ...progress,
      hearts: 5, // Full hearts refill daily!
      todayXP: 0,
      lastPlayDate: today,
      streak: newStreak,
      streakFrozen: false,
    };
    saveUserProgress(updated);
    return updated;
  }

  return progress;
}

export function getCurrentOutfit(outfitId: string) {
  return OUTFITS_DATA.find(o => o.id === outfitId) || OUTFITS_DATA[0];
}
